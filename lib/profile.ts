import "server-only";
import fs from "node:fs";
import path from "node:path";

const PROFILE_PATH = path.join(process.cwd(), "data", "profile.md");

export type Entry = {
  title: string;
  fields: Record<string, string>;
  description: string;
};

export type Profile = {
  name: string;
  tagline: string;
  bio: string;
  contact: Record<string, string>;
  skills: { group: string; items: string[] }[];
  projects: Entry[];
  education: Entry[];
  experience: Entry[];
};

/** Raw profile markdown with HTML comments (authoring notes, TODOs) removed. */
export function readProfileMarkdown(): string {
  const raw = fs.readFileSync(PROFILE_PATH, "utf8");
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const FIELD_RE = /^- ([A-Za-z][\w &]*):\s*(.+)$/;

function parseBlock(lines: string[]): Omit<Entry, "title"> {
  const fields: Record<string, string> = {};
  const text: string[] = [];
  for (const line of lines) {
    const m = line.match(FIELD_RE);
    if (m) fields[m[1].trim()] = m[2].trim();
    else if (line.trim()) text.push(line.trim());
  }
  return { fields, description: text.join(" ") };
}

function splitBy(lines: string[], prefix: string): { title: string; lines: string[] }[] {
  const parts: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } = { title: "", lines: [] };
  for (const line of lines) {
    if (line.startsWith(prefix)) {
      parts.push(current);
      current = { title: line.slice(prefix.length).trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  parts.push(current);
  return parts;
}

function entries(lines: string[]): Entry[] {
  return splitBy(lines, "### ")
    .filter((p) => p.title)
    .map((p) => ({ title: p.title, ...parseBlock(p.lines) }));
}

export function getProfile(): Profile {
  const lines = readProfileMarkdown().split(/\r?\n/);
  const [head, ...sections] = splitBy(lines, "## ");
  const name =
    head.lines
      .find((l) => l.startsWith("# "))
      ?.slice(2)
      .trim() ?? "";
  const section = (title: string) => sections.find((s) => s.title === title)?.lines ?? [];

  const about = parseBlock(section("About"));

  return {
    name,
    tagline: about.fields.Tagline ?? "",
    bio: about.description,
    contact: parseBlock(section("Contact")).fields,
    skills: entries(section("Skills")).map((e) => ({
      group: e.title,
      items: (e.fields.Items ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })),
    projects: entries(section("Projects")),
    education: entries(section("Education")),
    experience: entries(section("Experience")),
  };
}
