---
name: update-profile
description: Add or edit a project, skill, education/experience entry, bio, or contact link in data/profile.md using the exact format the site parser and AI twin expect. Use whenever Anil's portfolio content changes.
---

# Update profile

`data/profile.md` is the single source of truth. `lib/profile.ts` parses it for the website and `lib/prompt.ts` feeds it (minus HTML comments) to the AI twin. Never put personal facts anywhere else.

## Format contract

The parser depends on these rules — breaking them silently drops content from the site.

- First line: `# Full Name`.
- `## ` sections, exact names: `About`, `Contact`, `Skills`, `Projects`, `Education`, `Experience`.
- `### ` headings start an entry inside Skills / Projects / Education / Experience.
- Structured fields are bullets `- Key: Value` (key starts with a letter; value on one line).
- Any other non-empty line is description text (joined into one paragraph).
- `<!-- ... -->` comments are authoring notes: hidden from the site and the twin.

### Fields per section

| Section    | Entry heading                    | Fields                                                                                         |
| ---------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| About      | (none)                           | `Tagline`; paragraph = bio                                                                     |
| Contact    | (none)                           | `Email`, `GitHub`, `LinkedIn`, `Resume` (path under `public/`), `Photo` (path under `public/`) |
| Skills     | group name, e.g. `### Languages` | `Items` — comma-separated                                                                      |
| Projects   | project title                    | `Tech` (comma-separated), `GitHub`, `Live`; paragraph = description                            |
| Education  | `Degree — Institution`           | `Period`, `Location`; paragraph = details                                                      |
| Experience | `Role — Organization`            | `Period`, `Location`; paragraph = details                                                      |

### Project template

```markdown
### Project Title

- Tech: Next.js, TypeScript
- GitHub: https://github.com/anilsuthars31/repo
- Live: https://example.vercel.app

One to three sentences: what it does, what I built, what I learned.
```

## Steps

1. Ask for any missing facts. **Never invent** dates, metrics, employers, or links — the twin repeats whatever is here as truth.
2. Edit `data/profile.md` following the contract above. Write descriptions in first person ("I built…").
3. Keep newest projects/roles first within their section.
4. Run `npm run build` to confirm the page still renders, and skim the section on `npm run dev`.
