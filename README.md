# Brainstorm Digital Bookshelf

A cozy scrapbook that happens to manage student projects.

## Feel

- Home is a bookshelf (each book = one project)
- Inside: Notes, Tasks, Files, Team, Progress as big scrapbook pages
- Sticky-note tasks, blank notes canvas, desk folders, meeting cards
- Stickers unlock as you finish work; confetti on milestones

## Dev

```bash
npm install
cp .env.example .env.local
# add AUTH_SECRET (openssl rand -base64 32)
# optional: AUTH_GOOGLE_* and AUTH_GITHUB_* for social login
npm run dev
```

Open http://localhost:3000

## Live site

Production: https://brainstorm-bookshelf.vercel.app

If the old link `https://abygails-first-repo.vercel.app` still opens, rename the Vercel project:
1. Open the project on [vercel.com](https://vercel.com) → **Settings** → **General**
2. Change **Project Name** to `brainstorm-bookshelf`
3. Save — the live URL becomes `https://brainstorm-bookshelf.vercel.app`

## Sign-in

Accounts use **email + password** (stored on this device). Forgot password sends a reset code to the in-app inbox for that email on this device.
