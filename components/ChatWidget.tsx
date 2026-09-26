"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_CHARS } from "@/lib/chat-limits";
import ChatMessage from "./ChatMessage";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What projects have you built?",
  "What are your strongest skills?",
  "Where are you studying?",
  "How can I contact you?",
];

export default function ChatWidget({ name }: { name: string }) {
  const firstName = name.split(" ")[0] || name;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!content || loading) return;

    const history = [...messages, { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const appendToReply = (chunk: string) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + chunk };
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Failed/empty replies are dropped so roles keep alternating.
          messages: history.filter((m) => m.content).slice(-MAX_HISTORY_MESSAGES),
        }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToReply(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      appendToReply(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={`Chat with ${firstName}'s AI twin`}
          className="fixed right-4 bottom-24 z-40 flex h-[min(34rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div>
              <p className="font-semibold">{firstName}&apos;s AI twin</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Answers only from my profile — may be imperfect
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              ✕
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <ChatMessage role="assistant">
              {`Hi! I'm ${firstName}'s AI twin. Ask me about my projects, skills, or education.`}
            </ChatMessage>
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} pending={loading && i === messages.length - 1 && !m.content}>
                {m.content}
              </ChatMessage>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-indigo-200 px-3 py-1.5 text-left text-xs text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              maxLength={MAX_MESSAGE_CHARS}
              rows={1}
              placeholder="Ask me anything about my work…"
              aria-label="Your message"
              className="max-h-28 flex-1 resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : `Chat with ${firstName}'s AI twin`}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-300 focus:outline-none dark:focus:ring-indigo-800"
      >
        {open ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
