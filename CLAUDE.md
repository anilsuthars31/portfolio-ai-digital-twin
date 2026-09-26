# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal portfolio website for Anil with an **AI Digital Twin**: a chatbot that answers visitors' questions (skills, projects, education, experience) in Anil's voice, grounded only in a profile knowledge file.

See `SPEC.md` for features, plugin components, and done/pending status. Update the status table in `SPEC.md` whenever a feature is completed.

## Tech stack

- **Next.js (App Router) + TypeScript** — frontend and API routes
- **Tailwind CSS** — styling
- **LLM providers (`lib/llm.ts`)** — Claude via `@anthropic-ai/sdk` (`claude-sonnet-5`) when `ANTHROPIC_API_KEY` is set; otherwise Google Gemini's free tier via `@google/genai` (`GEMINI_API_KEY`, default model `gemini-3.8-flash`)
- **GitHub Pages** — deployment as a static export (`next build` with `output: "export"`, published by a GitHub Actions workflow). Pages serves static files only: no API routes or server code run there, so the chat endpoint must be hosted separately (see SPEC.md §5).

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (must pass before commit)
npm run lint       # ESLint
npm run format     # Prettier
npm run test:twin  # ask the running twin sample questions (see /test-twin)
```

Next.js 16 differs from older versions — see `AGENTS.md` and `node_modules/next/dist/docs/` before using unfamiliar Next APIs.

## Project structure

```
app/
  layout.tsx            # navbar, theme script, ChatWidget on every page
  page.tsx              # portfolio home (hero, projects, skills, timeline, contact)
  api/chat/route.ts     # chatbot endpoint -> Claude API (streaming, validation, caps)
components/             # UI components, one per file (Navbar, ProjectCard, ChatWidget, ...)
data/
  profile.md            # single source of truth about Anil (format: update-profile skill)
lib/
  profile.ts            # parses data/profile.md for the site
  prompt.ts             # builds the twin's system prompt from data/profile.md
  llm.ts                # streams replies from Claude (paid) or Gemini (free tier)
  chat-limits.ts        # message length / history caps shared by route and widget
scripts/test-twin.mjs   # sends twin-questions.json to /api/chat
.claude/
  skills/  commands/  hooks/  settings.json
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

- The site is published as public static files: never put API keys in client code, `NEXT_PUBLIC_*` variables, or anything bundled into the static export.

- `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` live in `.env.local` only; never commit them, never log them, never expose them to client components (read them only in server code: `lib/llm.ts`, used by `app/api/**`).
- Validate and length-limit user messages in the API route.

## Workflow

- Plan before large changes; keep commits small with clear messages.
- Run `npm run lint` and `npm run build` before committing.
- Do not push to GitHub unless asked.
