import Anthropic from "@anthropic-ai/sdk";
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_CHARS } from "@/lib/chat-limits";
import { buildSystemPrompt } from "@/lib/prompt";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 1024;

// Created lazily so builds work without credentials. Reads ANTHROPIC_API_KEY
// from the server environment; the key is never sent to the client.
let client: Anthropic | undefined;
const getClient = () => (client ??= new Anthropic());

type ValidationResult = { ok: true; messages: Anthropic.MessageParam[] } | { ok: false; error: string };

function validate(body: unknown): ValidationResult {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: "Send a non-empty `messages` array." };
  }

  const messages: Anthropic.MessageParam[] = [];
  for (const m of raw) {
    const { role, content } = (m ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return { ok: false, error: "Each message needs a user/assistant role and string content." };
    }
    const text = content.trim();
    if (!text) return { ok: false, error: "Messages cannot be empty." };
    if (text.length > MAX_MESSAGE_CHARS) {
      return { ok: false, error: `Please keep messages under ${MAX_MESSAGE_CHARS} characters.` };
    }
    messages.push({ role, content: text });
  }

  // Keep only the most recent turns, starting on a user message.
  let recent = messages.slice(-MAX_HISTORY_MESSAGES);
  while (recent.length && recent[0].role !== "user") recent = recent.slice(1);

  if (!recent.length || recent[recent.length - 1].role !== "user") {
    return { ok: false, error: "The last message must be from the user." };
  }
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].role === recent[i - 1].role) {
      return { ok: false, error: "Messages must alternate between user and assistant." };
    }
  }
  return { ok: true, messages: recent };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("chat unavailable: ANTHROPIC_API_KEY is not set");
    return Response.json(
      { error: "The AI twin isn't available right now — please use the contact links instead." },
      { status: 503 },
    );
  }

  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    // Short, grounded chat answers don't need extended reasoning; keeps latency and cost low.
    thinking: { type: "disabled" },
    system: [{ type: "text", text: buildSystemPrompt(), cache_control: { type: "ephemeral" } }],
    messages: result.messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("…"));
        } else if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode("Sorry, I can't help with that. Ask me about my projects or skills!"),
          );
        }
      } catch (err) {
        // Log the error type only — never the request headers or API key.
        const status = err instanceof Anthropic.APIError ? err.status : undefined;
        console.error("chat stream failed", status ?? (err as Error)?.name);
        const message =
          err instanceof Anthropic.RateLimitError
            ? "I'm getting a lot of questions right now — please try again in a minute."
            : "Sorry, something went wrong on my side. Please try again.";
        controller.enqueue(encoder.encode(`\n\n${message}`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
