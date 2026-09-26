import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_CHARS } from "@/lib/chat-limits";
import { errorStatus, getProvider, type ChatTurn } from "@/lib/llm";
import { buildSystemPrompt } from "@/lib/prompt";

export const runtime = "nodejs";

type ValidationResult = { ok: true; messages: ChatTurn[] } | { ok: false; error: string };

function validate(body: unknown): ValidationResult {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: "Send a non-empty `messages` array." };
  }

  const messages: ChatTurn[] = [];
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

  // API keys are read server-side only (lib/llm.ts); they never reach the client.
  const provider = getProvider();
  if (!provider) {
    console.error("chat unavailable: set GEMINI_API_KEY (free) or ANTHROPIC_API_KEY");
    return Response.json(
      { error: "The AI twin isn't available right now — please use the contact links instead." },
      { status: 503 },
    );
  }

  const abort = new AbortController();
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const chunks = provider.stream({
          system: buildSystemPrompt(),
          messages: result.messages,
          signal: abort.signal,
        });
        for await (const text of chunks) controller.enqueue(encoder.encode(text));
      } catch (err) {
        if (abort.signal.aborted) return;
        // Log the provider and status only — never request headers or API keys.
        const status = errorStatus(err);
        console.error(`chat stream failed (${provider.name})`, status ?? (err as Error)?.name);
        const message =
          status === 429
            ? "I'm getting a lot of questions right now — please try again in a minute."
            : "Sorry, something went wrong on my side. Please try again.";
        controller.enqueue(
          encoder.encode(`

${message}`),
        );
      } finally {
        if (!abort.signal.aborted) controller.close();
      }
    },
    cancel() {
      abort.abort();
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
