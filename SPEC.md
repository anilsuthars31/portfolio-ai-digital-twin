# SPEC — Portfolio + AI Digital Twin

## 1. Overview

A personal portfolio website with an embedded **AI Digital Twin** — a chatbot that represents me and answers recruiters', classmates', and visitors' questions about my skills, projects, and background, using the Claude API grounded in a profile file I write.

**Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, Anthropic Claude API, Vercel.

## 2. Core features

### Portfolio
1. **Hero / About** — name, tagline, short bio, photo, resume download.
2. **Projects** — cards with title, description, tech stack, GitHub/live links (rendered from `data/`).
3. **Skills** — grouped list (languages, frameworks, tools).
4. **Education & Experience** — timeline.
5. **Contact** — email, GitHub, LinkedIn links.
6. **Responsive design** + dark mode.

### AI Digital Twin
1. **Chat widget** — floating button that opens a chat panel on every page.
2. **Grounded answers** — system prompt built from `data/profile.md`; answers in first person as me.
3. **Honest fallback** — says "I don't know" for anything not in the profile and suggests contacting me.
4. **Streaming responses** from `app/api/chat/route.ts`.
5. **Suggested questions** — e.g. "What projects have you built?", "What are your strongest skills?".
6. **Guardrails** — off-topic refusal, input length limit, capped history/tokens, API key server-side only.

## 3. Architecture

```
Browser (ChatWidget) --POST /api/chat {messages}--> Next.js API route
                                                     |- lib/prompt.ts reads data/profile.md
                                                     |- Anthropic SDK -> Claude (streaming)
                     <------------ streamed text ----|
```

## 4. Claude Code plugin components

Plugin components that support developing and maintaining this project, stored in `.claude/`.

### Skills (`.claude/skills/`)
| Skill | Purpose |
|---|---|
| `update-profile` | Adds/edits a project, skill, or experience in `data/profile.md` in the correct format so both the site and the twin pick it up. |
| `twin-persona` | Rules for the twin's voice, tone, and grounding; used when editing `lib/prompt.ts`. |

### Commands (`.claude/commands/`)
| Command | Purpose |
|---|---|
| `/add-project` | Asks for project details and adds a project card + profile entry. |
| `/test-twin` | Runs a set of sample questions (in-scope, out-of-scope, unknown facts) against `/api/chat` and checks the answers stay grounded. |
| `/deploy-check` | Runs lint + build and checks no secrets are staged before deploying. |

### Hooks (`.claude/settings.json`)
| Hook | Event | Purpose |
|---|---|---|
| Protect secrets | `PreToolUse` (Edit/Write/Bash) | Blocks reading/editing `.env*` files and committing API keys. |
| Auto-format | `PostToolUse` (Edit/Write) | Runs Prettier/ESLint on changed files. |
| Build check | `Stop` | Runs `npm run lint` so the session ends with a clean tree. |

## 5. Status

| Item | Status |
|---|---|
| CLAUDE.md | Done |
| SPEC.md (this doc) | Done |
| GitHub repo created | Done |
| Next.js + Tailwind project setup | Done |
| `data/profile.md` (my info) | Done (email, LinkedIn, resume, photo, experience still TODO) |
| Portfolio sections (hero, projects, skills, timeline, contact) | Done |
| Chat API route with Claude + streaming | Done |
| Chat widget UI | Done |
| Guardrails (grounding, off-topic, limits) | Done |
| Skills: `update-profile`, `twin-persona` | Done |
| Commands: `/add-project`, `/test-twin`, `/deploy-check` | Done |
| Hooks: protect secrets, auto-format, build check | Done |
| Deploy to Vercel | Pending |

## 6. Out of scope (for now)

- RAG / vector database (profile fits in the prompt)
- User accounts or saving chat history
- Voice chat
