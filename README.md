# Brainstorm — Digital Bookshelf

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

## Google & GitHub sign-in

Social login uses Auth.js. Add these in `.env.local` (local) and Vercel → Settings → Environment Variables (production):

| Variable | Where to get it |
| --- | --- |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers) |

Callback URLs:

- Google: `https://YOUR_DOMAIN/api/auth/callback/google`
- GitHub: `https://YOUR_DOMAIN/api/auth/callback/github`

Also allow `http://localhost:3000/api/auth/callback/...` while developing.

Until those keys are set, the Google/GitHub buttons stay visible but explain that setup is needed. Email sign-up and guest mode still work.
