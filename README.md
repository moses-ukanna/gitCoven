# GitCoven 🧙

> **From Newbie to Enterprise Pro** — by WiredHash

A gamified Git learning app with 28 phases, locked challenges, rank system, and login/profile.

---

## Project Structure

```
gitcoven/
├── index.html              ← App entry point
├── css/
│   └── styles.css          ← All styles (25KB)
├── js/
│   ├── phases.js           ← Phase array declaration
│   ├── phases/
│   │   ├── fundamentals.js       ← Phases 1-4:  VCS, Install, Three Areas, init/add/commit
│   │   ├── core-workflow.js      ← Phases 5-7:  Branching, Merging, Remote Repos
│   │   ├── recovery.js           ← Phases 8-9:  Undoing Changes, Stashing
│   │   ├── advanced-techniques.js ← Phases 10-14: Rebase, cherry-pick, Tags, .gitignore, Workflows
│   │   ├── professional.js       ← Phases 15-16: Code Review, Pro Tips & Cheat Sheet
│   │   ├── enterprise.js         ← Phases 17-25: Internals, Hooks, CI/CD, LFS, Monorepo, Security, Forensics, Maintenance, Enterprise Platforms
│   │   └── platforms.js          ← Phases 26-28: GitHub Setup, GitLab/Bitbucket, GitHub CLI
│   ├── state.js            ← App state, navigation, sidebar
│   ├── render.js           ← Render engine, challenge submission
│   ├── auth.js             ← Login/register, localStorage, profile panel
│   └── api.js              ← Backend API client (for cloud sync)
└── backend/
    ├── server.js           ← Express entry point
    ├── package.json
    ├── .env.example
    ├── prisma/
    │   └── schema.prisma   ← User, Progress, Visit tables
    ├── middleware/
    │   └── authenticate.js ← JWT guard
    └── routes/
        ├── auth.js         ← Register, Login, Me
        ├── progress.js     ← Save/Load/Reset
        └── profile.js      ← Stats, streak, rank
```

---

## Running Locally

1. Open the project folder in VS Code
2. Install **Live Server** extension
3. Click **Go Live** in the bottom status bar
4. Opens at `http://localhost:5500`

No build step. No bundler. No npm install. Just open and go.

---

## How the Phase Files Work

Each file in `js/phases/` pushes its phases to the global `phases` array:

```js
// fundamentals.js
phases.push(
  { title: "What is Version Control?", sub: "...", sections: [...], challenges: [...] },
  { title: "Installation", sub: "...", sections: [...], challenges: [...] },
  // ...
);
```

Script load order in index.html ensures phases are added sequentially.
To add a new phase: add it to the appropriate group file or create a new one.

---

## Backend Setup (Optional — for cloud sync)

### 1. Get Supabase (free)
- supabase.com → New project → Copy connection string

### 2. Configure
```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET
npm install
npm run db:push
npm run dev
```

### 3. Connect frontend
Update `API_BASE` in `js/api.js` to your backend URL.

---

## Deploying

```bash
# Push to GitHub
git add .
git commit -m "Deploy GitCoven v2"
git push

# Vercel auto-deploys from GitHub
# Make sure your file is named index.html
```

---

**GitCoven by WiredHash** 🧙
