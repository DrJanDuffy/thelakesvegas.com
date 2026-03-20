# thelakesvegas.com

Next.js 15 (App Router) site ported from **heyberkshire.com** (same BHHS / Dr. Jan Duffy patterns: layout, RealScout, Calendly, neighborhoods, lead + Claude APIs). **Branding** is localized in `src/lib/site-config.ts` (`https://www.thelakesvegas.com`, “The Lakes Las Vegas”).

## Search Console checklist

1. **Deploy** the site on your production domain (e.g. Vercel). Set environment variables:
   - `NEXT_PUBLIC_SITE_URL` — canonical origin, no trailing slash. **Primary host is `www`** (e.g. `https://www.thelakesvegas.com`).
   - `GOOGLE_SITE_VERIFICATION` — value from Search Console → *HTML tag* verification (content only).

2. **Add property** in [Google Search Console](https://search.google.com/search-console) using the **`www`** URL prefix (e.g. `https://www.thelakesvegas.com/`). Apex `https://thelakesvegas.com/` redirects to `www` via middleware.

3. **Verify** using the *HTML tag* method. The verification meta tag is emitted from `src/app/layout.tsx` when `GOOGLE_SITE_VERIFICATION` is set.

4. **Submit sitemap**: `https://your-domain/sitemap.xml`  
   **Robots**: `https://your-domain/robots.txt` (includes the sitemap URL).

5. After launch, use **URL Inspection** on the homepage and request indexing if needed.

6. **Primary query focus** — On-page copy, metadata, FAQ (visible + `FAQPage` JSON-LD), and `RealEstateAgent` `areaServed` emphasize **The Lakes Las Vegas**. Source of truth for neighborhood FAQs/geo text: `src/lib/the-lakes-aeo.ts`. Re-inspect the homepage in GSC after substantive content changes.

Copy `.env.example` to `.env.local` for local development.

## Commands

```bash
npm install
npm run dev
npm run build   # or: vercel build (Vercel CLI)
```

## Vercel environments

Vercel uses **Local**, **Preview**, and **Production** by default; Pro/Enterprise can add **custom** environments (e.g. staging). Each environment can have its own variables. Official overview: [Environments](https://vercel.com/docs/deployments/environments).

| Environment | When | This repo |
|-------------|------|-----------|
| **Local** | Develop on your machine | Copy `.env.example` → `.env.local`, or after `vercel link`: `vercel env pull` to sync dashboard vars into `.env.local`. |
| **Preview** | Push a non-`main` branch, open a PR, or `vercel` (no `--prod`) | `getSiteUrl()` in `src/config/site.ts` uses `VERCEL_URL` so sitemap/robots match the preview host. |
| **Production** | Merge to `main` or `vercel --prod` | Set **`NEXT_PUBLIC_SITE_URL=https://www.thelakesvegas.com`** (no trailing slash) so canonical URLs stay `www` even if Vercel’s assigned URL differs. |

**CLI quick reference**

```bash
npm i -g vercel          # or: npx vercel
vercel link              # attach this directory to a Vercel project
vercel env pull          # write Production envs to .env.local (use flags for other envs if needed)
vercel --prod            # deploy to production explicitly
```

Custom environments (Pro+): e.g. `vercel deploy --target=staging`, `vercel pull --environment=staging` — see [custom environments](https://vercel.com/docs/deployments/environments#custom-environments).

### Generated deployment URLs

Each preview or production deployment gets a **unique URL** (until [retention](https://vercel.com/docs/deployments/deployment-retention) expires). URLs are **public by default**; use [deployment protection](https://vercel.com/docs/security/deployment-protection) to restrict access. Full reference: [Accessing Deployments through Generated URLs](https://vercel.com/docs/deployments/generated-urls).

**From Git** (typical for PRs):

| URL type | Pattern (conceptually) | Use |
|----------|------------------------|-----|
| **Commit** | `<project>-<hash>-<scope>.vercel.app` | Exact snapshot of that commit; share a fixed build. |
| **Branch** | `<project>-git-<branch>-<scope>.vercel.app` | Always the **latest** deploy on that branch; good for ongoing review. |

In GitHub PRs, use **View deployment** (commit) vs **Visit Preview** (branch) as Vercel comments indicate.

**From CLI** — after `vercel` / `vercel --prod`, the printed URL is often `<project>-<scope>.vercel.app` (production deploys resolve there). Teams may also get author-specific host patterns per [docs](https://vercel.com/docs/deployments/generated-urls).

**Other notes**

- Hostnames longer than **63** characters before `.vercel.app` are **truncated**.
- If the project name looks like a normal domain, Vercel may **shorten** it (anti-phishing).
- **Pro/Enterprise**: [Preview Deployment Suffix](https://vercel.com/docs/deployments/previews/preview-deployment-suffix) replaces `.vercel.app` with your own domain on previews.

**This repo:** On previews, `getSiteUrl()` prefers `VERCEL_URL` so `sitemap.xml` / `robots.txt` match the deployment you’re viewing. Production should still set `NEXT_PUBLIC_SITE_URL` to `https://www.thelakesvegas.com`.

## Project layout

- `src/middleware.ts` — **308 redirect** from apex `thelakesvegas.com` → `www.thelakesvegas.com` (skipped on `localhost` and `*.vercel.app`).
- `src/lib/site-config.ts` — site name, URL, NAP-style agent/office fields (keep aligned with GBP). Helpers: `siteUrl("/path")`, `isOwnedSiteHostname()` (lead referrer logic), `localSeo.googleReviewsUrl` (update when The Lakes GBP review link is ready). **`openHouseWeekend`** drives the homepage open house section + Event JSON-LD; set **`active: false`** after the event (and update dates/embed when you run the next one).
- `src/lib/the-lakes-aeo.ts` — shared **The Lakes Las Vegas** FAQ copy (homepage FAQ + matching JSON-LD) and geo constants.
- `src/app/sitemap.ts` / `src/app/robots.ts` — use `getSiteUrl()` from `src/config/site.ts`.
- `src/app/layout.tsx` — Geist, global JSON-LD, GA, RealScout + Calendly scripts, optional `GOOGLE_SITE_VERIFICATION`.
- `src/components/` — Navbar, Footer, Hero, RealScout widgets, FAQ, reviews, etc. (from heyberkshire baseline).

## Vercel audit: `git push` not deploying

**What was checked**

| Check | Result |
|--------|--------|
| Git remote | `origin` → `https://github.com/DrJanDuffy/thelakesvegas.com.git`, branch `main` |
| Local Vercel link | No `.vercel/project.json` (project not linked via CLI in this clone) |
| GitHub Actions | No `.github/workflows/*` (no CI deploy fallback) |
| Vercel CLI (`vercel whoami` / `vercel project ls`) | Logged in as **drjanduffy**, team **janet-duffys-projects** — **no project** whose name/URL matches *thelakes* / *thelakesvegas* in listed pages (this repo was never imported there, or it uses a non-obvious name) |

**Most likely cause:** There is **no Vercel project** connected to `DrJanDuffy/thelakesvegas.com`. Pushes do not deploy until you **import** the GitHub repo under the Vercel team you use (e.g. **janet-duffys-projects**) and grant the [Vercel GitHub app](https://vercel.com/docs/git/vercel-for-github) access to that repository.

**Fix (dashboard)**

1. Open [vercel.com/new](https://vercel.com/new) while logged into the **correct** Vercel team/account.
2. **Import** `DrJanDuffy/thelakesvegas.com` (Install/configure the GitHub app for the org/repo if prompted).
3. Confirm **Production Branch** is `main` (Project → Settings → Git).
4. Set env vars (`NEXT_PUBLIC_SITE_URL`, etc.) and redeploy.

**Fix (CLI, optional)**

```bash
npx vercel link
npx vercel git connect
```

(`vercel git connect` wires an existing Vercel project to the current Git remote — see [Vercel CLI Git](https://vercel.com/docs/cli/git).)

**If the project already exists elsewhere**

- In that project: **Settings → Git** — confirm the connected repository and branch.
- **Ignored Build Step**: if configured, a script that exits `0` with “don't build” will skip deployments ([docs](https://vercel.com/docs/project-configuration/project-settings#ignored-build-step)).
- **Git deployments disabled**: `vercel.json` with `git.deploymentEnabled: false` (or deprecated `github.enabled: false`) disables automatic deploys — this repo does **not** include that.

After the project is linked, each push to `main` should create a production deployment (and preview deployments for other branches).
