# Portfolio + AI Digital Twin

Personal portfolio for Anil Suthar S with an **AI digital twin**: a chat widget that answers visitors' questions about my skills, projects, and education in my voice, grounded only in [`data/profile.md`](data/profile.md).

Built with Next.js (App Router) + TypeScript, Tailwind CSS, and an LLM: Google Gemini's **free tier** by default, or the Claude API (`claude-sonnet-5`) if you add an Anthropic key. See [`SPEC.md`](SPEC.md) for features and status.

## Run locally

```bash
npm install
cp .env.example .env.local   # then add a free GEMINI_API_KEY (or ANTHROPIC_API_KEY)
npm run dev                  # http://localhost:3000
```

Get a free Gemini key at https://aistudio.google.com/apikey (no credit card). Without any key the site works normally; the chat replies that the twin is unavailable.

## Editing content

Everything personal lives in `data/profile.md` — the site and the twin both read it. Follow the format in `.claude/skills/update-profile/SKILL.md` (or run `/add-project` in Claude Code). HTML comments in the file are hidden from both.

## How the twin works

`components/ChatWidget.tsx` → `POST /api/chat` → `lib/prompt.ts` builds the system prompt from the profile → `lib/llm.ts` streams the reply from Claude or Gemini back as plain text.

Guardrails: answers only from the profile (says "I don't know" otherwise), declines off-topic requests, 1000-char message limit, last 12 messages of history, 1024 max output tokens, API key server-side only.

## Claude Code setup (`.claude/`)

| Kind | Name | What it does |
|---|---|---|
| Skill | `update-profile` | Format contract for `data/profile.md` |
| Skill | `twin-persona` | Voice, grounding, and scope rules for the twin |
| Command | `/add-project` | Adds a project to the profile (site + twin) |
| Command | `/test-twin` | Runs `scripts/test-twin.mjs` and grades answers for grounding |
| Command | `/deploy-check` | Lint, build, and secret checks before deploy |
| Hook | `protect-secrets` (PreToolUse) | Blocks touching `.env*` files and committing API keys |
| Hook | `auto-format` (PostToolUse) | Prettier + ESLint `--fix` on edited files |
| Hook | `lint-on-stop` (Stop) | Runs `npm run lint` before a session ends |

## Deploy (GitHub Pages)

The site is planned to deploy to GitHub Pages as a static export. GitHub Pages can't run the `/api/chat` route, so the chat backend will be hosted separately (see SPEC.md). Run `/deploy-check` first.
