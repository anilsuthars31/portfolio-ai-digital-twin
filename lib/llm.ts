import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export type ChatTurn = { role: "user" | "assistant"; content: string };

type StreamArgs = { system: string; messages: ChatTurn[]; signal: AbortSignal };

export type Provider = {
  name: "claude" | "gemini";
  /** Yields reply text chunks; appends a short notice if the reply was cut off or refused. */
  stream: (args: StreamArgs) => AsyncGenerator<string>;
};

const MAX_TOKENS = 1024;

// Claude (paid) — used when ANTHROPIC_API_KEY is set.
const CLAUDE_MODEL = "claude-sonnet-5";
let anthropic: Anthropic | undefined;

async function* streamClaude({ system, messages, signal }: StreamArgs) {
  anthropic ??= new Anthropic();
  const stream = anthropic.messages.stream(
    {
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      // Short, grounded chat answers don't need extended reasoning; keeps latency and cost low.
      thinking: { type: "disabled" },
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages,
    },
    { signal },
  );
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") yield event.delta.text;
  }
  const final = await stream.finalMessage();
  if (final.stop_reason === "max_tokens") yield "…";
  if (final.stop_reason === "refusal")
    yield "Sorry, I can't help with that. Ask me about my projects or skills!";
}

// Gemini (free tier via Google AI Studio) — used when only GEMINI_API_KEY is set.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const GEMINI_FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"];
// The free tier is often briefly overloaded (503) or rate limited (429); these are worth retrying.
const RETRYABLE = new Set([429, 500, 503]);
let gemini: GoogleGenAI | undefined;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function* streamGemini({ system, messages, signal }: StreamArgs) {
  gemini ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  // Try the main model twice, then the fallback models. Retries only happen before any
  // text has been sent, so the visitor never sees a half answer repeated.
  const attempts = [GEMINI_MODEL, GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS];

  for (let i = 0; i < attempts.length; i++) {
    let sentText = false;
    try {
      const stream = await gemini.models.generateContentStream({
        model: attempts[i],
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        config: {
          systemInstruction: system,
          // Thinking tokens count toward the output budget, so leave headroom for the answer.
          maxOutputTokens: MAX_TOKENS * 2,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          abortSignal: signal,
        },
      });
      for await (const chunk of stream) {
        if (chunk.text) {
          sentText = true;
          yield chunk.text;
        }
      }
      return;
    } catch (err) {
      const status = errorStatus(err);
      const canRetry = !sentText && !signal.aborted && status !== undefined && RETRYABLE.has(status);
      if (!canRetry || i === attempts.length - 1) throw err;
      console.warn(`gemini ${attempts[i]} returned ${status}; retrying`);
      await sleep(800 * (i + 1));
    }
  }
}

/** Picks Claude when its key is configured, otherwise Gemini's free tier; null if neither is set. */
export function getProvider(): Provider | null {
  if (process.env.ANTHROPIC_API_KEY) return { name: "claude", stream: streamClaude };
  if (process.env.GEMINI_API_KEY) return { name: "gemini", stream: streamGemini };
  return null;
}

/** HTTP status of a provider error, if any (both SDKs expose `status`). */
export function errorStatus(err: unknown): number | undefined {
  const status = (err as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : undefined;
}
