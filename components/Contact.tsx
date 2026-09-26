const LABELS: Record<string, (value: string) => string> = {
  Email: (v) => `mailto:${v}`,
  GitHub: (v) => v,
  LinkedIn: (v) => v,
};

export default function Contact({ contact }: { contact: Record<string, string> }) {
  const links = Object.entries(LABELS)
    .filter(([key]) => contact[key])
    .map(([key, toHref]) => ({ key, value: contact[key], href: toHref(contact[key]) }));

  return (
    <div>
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">
        Want to work together or have a question? Reach out below — or ask my AI twin in the corner.
      </p>
      <ul className="mt-6 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.key}>
            <a
              href={l.href}
              target={l.key === "Email" ? undefined : "_blank"}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <span className="text-zinc-500 dark:text-zinc-400">{l.key}</span>
              <span>{l.key === "Email" ? l.value : l.value.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
