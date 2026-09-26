import type { Profile } from "@/lib/profile";

export default function Skills({ skills }: { skills: Profile["skills"] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {skills.map((s) => (
        <div key={s.group}>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {s.group}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {s.items.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
