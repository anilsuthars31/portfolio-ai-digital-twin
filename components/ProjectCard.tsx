import type { Entry } from "@/lib/profile";
import GitHubIcon from "./GitHubIcon";

export default function ProjectCard({ project }: { project: Entry }) {
  const { title, description, fields } = project;
  const tech = (fields.Tech ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const highlights = (fields.Highlights ?? "")
    .split("·")
    .map((h) => h.trim())
    .filter(Boolean);

  return (
    <article className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-800 dark:hover:shadow-zinc-900">
      <div className="flex items-start justify-between gap-3">
        {fields.Category && (
          <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
            {fields.Category}
          </span>
        )}
        {fields.GitHub && (
          <a
            href={fields.GitHub}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} on GitHub`}
            className="ml-auto text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        )}
      </div>

      <h3 className="mt-2 text-lg leading-snug font-semibold">{title}</h3>

      {highlights.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {highlights.map((h) => (
            <li key={h} className="flex items-center gap-1">
              <span aria-hidden>✦</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>

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

      {(fields.GitHub || fields.Live) && (
        <div className="mt-4 flex gap-4 border-t border-zinc-100 pt-4 text-sm font-medium dark:border-zinc-800">
          {fields.GitHub && (
            <a
              href={fields.GitHub}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
            >
              <GitHubIcon className="h-4 w-4" />
              View code
            </a>
          )}
          {fields.Live && (
            <a
              href={fields.Live}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
            >
              Live demo →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
