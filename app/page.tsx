import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import { getProfile } from "@/lib/profile";

export default function Home() {
  const profile = getProfile();
  const journey = [
    ...profile.experience.map((entry) => ({ kind: "Experience" as const, entry })),
    ...profile.education.map((entry) => ({ kind: "Education" as const, entry })),
  ];

  return (
    <main className="flex-1">
      <Hero
        name={profile.name}
        tagline={profile.tagline}
        bio={profile.bio}
        photo={profile.contact.Photo}
        resume={profile.contact.Resume}
      />
      <Section id="projects" title="Projects">
        <div className="grid gap-5 sm:grid-cols-2">
          {profile.projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </Section>
      <Section id="skills" title="Skills">
        <Skills skills={profile.skills} />
      </Section>
      <Section id="journey" title="Education & Experience">
        <Timeline items={journey} />
      </Section>
      <Section id="contact" title="Get in touch">
        <Contact contact={profile.contact} />
      </Section>
      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </main>
  );
}
