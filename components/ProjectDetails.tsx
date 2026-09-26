"use client";

import { useEffect, useRef } from "react";
import type { Entry } from "@/lib/profile";
import GitHubIcon from "./GitHubIcon";
import { splitList } from "./ProjectCard";

type Props = { project: Entry | null; onClose: () => void };

/** Modal with everything the profile says about one project. */
export default function ProjectDetails({ project, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const fields = project?.fields ?? {};
  const tech = splitList(fields.Tech, ",");
  const highlights = splitList(fields.Highlights, "·");

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="project-details-title"
      className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm dark:bg-zinc-900 dark:text-zinc-100"
    >
      {project && (
        <div className="max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {fields.Category && (
                <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                  {fields.Category}
                </p>
              )}
              <h3 id="project-details-title" className="mt-1 text-2xl font-bold tracking-tight">
                {project.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              ✕
            </button>
          </div>

          {highlights.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Highlights</h4>
              <ul className="mt-2 flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
            <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">About the project</h4>
            <p className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">{project.description}</p>
          </div>

          {tech.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Tech stack</h4>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            {fields.GitHub && (
              <a
                href={fields.GitHub}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <GitHubIcon className="h-4 w-4" />
                View code on GitHub
              </a>
            )}
            {fields.Live && (
              <a
                href={fields.Live}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Open live demo →
              </a>
            )}
            {!fields.GitHub && !fields.Live && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No public link for this project yet — ask my AI twin or contact me for details.
              </p>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
