# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal portfolio website for Anil with an **AI Digital Twin**: a chatbot that answers visitors' questions (skills, projects, education, experience) in Anil's voice, grounded only in a profile knowledge file.

See `SPEC.md` for features, plugin components, and done/pending status. Update the status table in `SPEC.md` whenever a feature is completed.

## Tech stack

- **Next.js (App Router) + TypeScript** — frontend and API routes
- **Tailwind CSS** — styling
- **Anthropic SDK (`@anthropic-ai/sdk`)** — powers the twin; default model `claude-sonnet-5`
- **Vercel** — deployment

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (must pass before commit)
npm run lint       # ESLint
```

## Project structure (planned)

```
app/
  page.tsx              # portfolio home (hero, about, projects, skills, contact)
  api/chat/route.ts     # chatbot endpoint -> Claude API (streaming)
components/             # UI components (Navbar, ProjectCard, ChatWidget, ...)
data/
  profile.md            # single source of truth about Anil (bio, projects, skills)
lib/
  prompt.ts             # builds the twin's system prompt from data/profile.md
.claude/
  skills/  commands/  settings.json (hooks)
```

## Conventions

- TypeScript everywhere; functional React components; Tailwind utility classes (no separate CSS files unless unavoidable).
- Portfolio content (projects, skills, bio) lives in `data/` only — never hard-code personal facts inside components or the prompt. Both the site and the twin read from the same data.
- Keep components small; one component per file in `components/`.

## AI Digital Twin rules

- The system prompt is built in `lib/prompt.ts` from `data/profile.md`.
- The twin speaks in first person as Anil, stays friendly and concise.
- It must **only** answer from the profile. If something isn't in the profile, it says it doesn't know and suggests contacting Anil — no invented facts.
- Politely refuse off-topic requests (e.g. homework solving, code generation unrelated to Anil).
- Stream responses to the client; cap message history and `max_tokens` to control cost.

## Security

- `ANTHROPIC_API_KEY` lives in `.env.local` only; never commit it, never log it, never expose it to client components (only use it in `app/api/**`).
- Validate and length-limit user messages in the API route.

## Workflow

- Plan before large changes; keep commits small with clear messages.
- Run `npm run lint` and `npm run build` before committing.
- Do not push to GitHub unless asked.
