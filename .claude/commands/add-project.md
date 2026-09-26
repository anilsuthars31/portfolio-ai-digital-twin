---
description: Add a new project to the portfolio (site card + twin knowledge) via data/profile.md
argument-hint: [project name or GitHub URL]
---

Add a project to Anil's portfolio. Starting point from the user: $ARGUMENTS

1. Load the `update-profile` skill and follow its format contract.
2. If a GitHub URL or repo name was given, read the repo's README and file list with `gh` to draft the details.
3. Ask the user (in one message) for anything still missing: title, 1–3 sentence description in first person, tech stack, GitHub link, live link (optional). Do not invent any of these.
4. Insert the project at the top of `## Projects` in `data/profile.md`.
5. Run `npm run build`. The card renders from the profile automatically (`components/ProjectCard.tsx`), and the twin picks it up on its next request — no other files need editing.
6. Show the added block and suggest a commit message like `Add <project> to portfolio`.
