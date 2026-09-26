import type { Entry } from "@/lib/profile";

type Props = { items: { kind: "Education" | "Experience"; entry: Entry }[] };

export default function Timeline({ items }: Props) {
  return (
    <ol className="relative ml-2 border-l border-zinc-200 dark:border-zinc-800">
      {items.map(({ kind, entry }) => (
        <li key={`${kind}-${entry.title}`} className="mb-10 ml-6 last:mb-0">
          <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-zinc-950" />
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
            {kind}
            {entry.fields.Period && (
              <span className="text-zinc-500 dark:text-zinc-400"> · {entry.fields.Period}</span>
            )}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
          {entry.fields.Location && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{entry.fields.Location}</p>
          )}
          {entry.description && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {entry.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
