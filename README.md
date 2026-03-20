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

Copy `.env.example` to `.env.local` for local development.

## Commands

```bash
npm install
npm run dev
npm run build   # or: vercel build (Vercel CLI)
```

## Project layout

- `src/middleware.ts` — **308 redirect** from apex `thelakesvegas.com` → `www.thelakesvegas.com` (skipped on `localhost` and `*.vercel.app`).
- `src/lib/site-config.ts` — site name, URL, NAP-style agent/office fields (keep aligned with GBP). Helpers: `siteUrl("/path")`, `isOwnedSiteHostname()` (lead referrer logic), `localSeo.googleReviewsUrl` (update when The Lakes GBP review link is ready).
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
