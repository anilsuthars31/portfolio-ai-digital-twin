---
description: Pre-deploy checks — lint, build, and make sure no secrets are staged or tracked
---

Run the pre-deploy checklist and report each item as PASS/FAIL.

1. `npm run lint` — must exit 0.
2. `npm run build` — must exit 0 (run it without piping to `head`/`tail`, which can cut the build short).
3. Secrets:
   - `git ls-files -- '.env*' '**/.env*'` must list nothing except `.env.example`.
   - `git diff --cached` and `git grep -I -n -E 'sk-ant-[A-Za-z0-9_-]{10,}'` must find no API keys.
   - `grep -rn "ANTHROPIC_API_KEY" app components lib` must only show server-side use in `app/api/**` (never a `"use client"` file, never `NEXT_PUBLIC_`).
4. `git status` is clean or only has intended changes.
5. Remind the user that on Vercel `ANTHROPIC_API_KEY` must be set under Project → Settings → Environment Variables.

Do not deploy or push; only report.
