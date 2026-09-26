import type { Entry } from "@/lib/profile";

export default function ProjectCard({ project }: { project: Entry }) {
  const { title, description, fields } = project;
  const tech = (fields.Tech ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article className="flex flex-col rounded-xl border border-zinc-200 p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:hover:shadow-zinc-900">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
      {tech.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <li
              key={t}
              className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex gap-4 text-sm font-medium">
        {fields.GitHub && (
          <a
            href={fields.GitHub}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            GitHub →
          </a>
        )}
        {fields.Live && (
          <a
            href={fields.Live}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Live demo →
          </a>
        )}
      </div>
    </article>
  );
}
