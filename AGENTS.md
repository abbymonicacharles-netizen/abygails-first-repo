# AGENTS.md

## Cursor Cloud specific instructions

This is a static personal website built with Next.js 15 (App Router), React 19, and Tailwind CSS 4. There is no backend, database, or external service — everything is prerendered as static content.

- Dev server: `npm run dev` (serves on http://localhost:3000).
- Lint / build / production start: see `scripts` in `package.json` (`npm run lint`, `npm run build`, `npm run start`).
- `npm run lint` uses `next lint`, which prints a deprecation notice under Next.js 15 but still works; ignore the notice.
- Page content lives in `src/components/*.tsx`; the site theme colours are defined in `src/app/globals.css`.
