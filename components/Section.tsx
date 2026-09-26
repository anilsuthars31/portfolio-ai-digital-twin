import type { ReactNode } from "react";

type Props = { id: string; title: string; children: ReactNode };

export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}
