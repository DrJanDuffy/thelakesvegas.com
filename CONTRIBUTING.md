# Contributing (Git workflow)

This repository is the source of truth for **thelakesvegas.com**. Development uses **Git** on **GitHub** with **Vercel** deployments from `main`.

## Clone and branch

```bash
git clone https://github.com/DrJanDuffy/thelakesvegas.com.git
cd thelakesvegas.com
git checkout -b feat/short-description
```

- **Production branch:** `main` (merge here triggers Vercel production when the project is connected).
- **Feature work:** use branches such as `feat/…`, `fix/…`, or `chore/…`, then open a **pull request** into `main`.

## Before you commit

1. Copy [`.env.example`](.env.example) to `.env.local` for local secrets — **never** commit `.env` or `.env.local`.
2. Run `npm run lint`, `npm run type-check`, and `npm run build` when you change app code (matches [CI](.github/workflows/ci.yml) on GitHub).
3. Do **not** modify **`src/components/idx/*`** without explicit MLS/IDX approval (see repo rules).

## Commits

Write clear messages (what + why). Optional prefix style used elsewhere in this org: `feat:`, `fix:`, `docs:`, `chore:`.

## Pull requests

Use the PR template checklist. Request review when working with a team.

## More context

- [README — Hosting on Vercel](README.md#hosting-on-vercel)
- [README — Vercel environments](README.md#vercel-environments)
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
