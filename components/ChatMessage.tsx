type Props = {
  role: "user" | "assistant";
  children: string;
  pending?: boolean;
};

const URL_RE = /(https?:\/\/[^\s)]+)/g;

/** Renders plain text with bare URLs turned into links (no HTML injection). */
function linkify(text: string) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" className="underline underline-offset-2">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default function ChatMessage({ role, children, pending }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap ${
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        {pending ? (
          <span className="inline-flex gap-1" aria-label="Typing">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
          </span>
        ) : (
          linkify(children)
        )}
      </div>
    </div>
  );
}
