type Props = {
  name: string;
  tagline: string;
  bio: string;
  photo?: string;
  resume?: string;
};

export default function Hero({ name, tagline, bio, photo, resume }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <section
      id="top"
      className="mx-auto flex w-full max-w-5xl flex-col-reverse items-start gap-10 px-4 pt-16 pb-8 sm:px-6 md:flex-row md:items-center md:pt-24"
    >
      <div className="flex-1">
        <p className="mb-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">Hi, I&apos;m</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300">{tagline}</p>
        <p className="mt-6 max-w-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">{bio}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            See my projects
          </a>
          {resume && (
            <a
              href={resume}
              download
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Download resume
            </a>
          )}
        </div>
      </div>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- local path from profile.md, size unknown
        <img
          src={photo}
          alt={name}
          className="h-36 w-36 rounded-full object-cover ring-4 ring-indigo-100 sm:h-44 sm:w-44 dark:ring-indigo-900/50"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-4xl font-bold text-white ring-4 ring-indigo-100 sm:h-44 sm:w-44 dark:ring-indigo-900/50"
        >
          {initials}
        </div>
      )}
    </section>
  );
}
