"use client";

import { useState } from "react";
import type { Entry } from "@/lib/profile";
import GitHubIcon from "./GitHubIcon";
import ProjectCard from "./ProjectCard";

const ALL = "All";

export default function Projects({ projects, githubUrl }: { projects: Entry[]; githubUrl?: string }) {
  const [active, setActive] = useState(ALL);
  const categories = [ALL, ...new Set(projects.map((p) => p.fields.Category).filter(Boolean))];
  const shown = active === ALL ? projects : projects.filter((p) => p.fields.Category === active);

  return (
    <div>
      {categories.length > 2 && (
        <div role="tablist" aria-label="Filter projects" className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active === c
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>

      {githubUrl && (
        <div className="mt-8 text-center">
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <GitHubIcon className="h-4 w-4" />
            See all my work on GitHub
          </a>
        </div>
      )}
    </div>
  );
}
