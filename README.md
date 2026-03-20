# thelakesvegas.com

Next.js 15 (App Router) site ported from **heyberkshire.com** (same BHHS / Dr. Jan Duffy patterns: layout, RealScout, Calendly, neighborhoods, lead + Claude APIs). **Branding** is localized in `src/lib/site-config.ts` (`https://www.thelakesvegas.com`, “The Lakes Las Vegas”).

## Search Console checklist

Official reference: [Google Search Central — Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start).

1. **Deploy** the site on your production domain (e.g. Vercel). Set environment variables in **Vercel → Project → Settings → Environment Variables** (Production at minimum):
   - `NEXT_PUBLIC_SITE_URL` — canonical origin, **no trailing slash**. **Primary host is `www`:** `https://www.thelakesvegas.com`. This drives `metadataBase`, sitemap/robots absolute URLs, and JSON-LD base URLs in [`src/config/site.ts`](src/config/site.ts).
   - `GOOGLE_SITE_VERIFICATION` — paste **only the `content` value** from Search Console → *HTML tag* verification (not the full `<meta>` tag). Redeploy after saving so [`src/app/layout.tsx`](src/app/layout.tsx) emits the verification meta via Next.js [`metadata.verification.google`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

2. **Add a property** in [Google Search Console](https://search.google.com/search-console). For this site, a **URL-prefix** property for `https://www.thelakesvegas.com/` matches how the app sets canonicals and metadata. (A **Domain** property for `thelakesvegas.com` is optional and can cover all subdomains; apex still redirects to `www` via [`src/middleware.ts`](src/middleware.ts).)

3. **Verify** with the **HTML tag** method after the env var is live on production. Use **URL Inspection** on `https://www.thelakesvegas.com/` to confirm Google can fetch the page.

4. **Submit the sitemap** in GSC → **Sitemaps**:  
   `https://www.thelakesvegas.com/sitemap.xml`  
   Static marketing URLs are listed in [`src/app/sitemap.ts`](src/app/sitemap.ts); `/listings/[id]` URLs are omitted on purpose (IDX).  
   **Robots:** `https://www.thelakesvegas.com/robots.txt` — from [`src/app/robots.ts`](src/app/robots.ts); allows crawling and references the sitemap; `/api/` is disallowed.  
   **If GSC shows one error per sitemap row:** open the live `sitemap.xml` and check `<loc>` — every URL must use **`https://www.thelakesvegas.com`**, not `*.vercel.app`. That usually means the build used `VERCEL_URL` for a non-preview deploy; set **`NEXT_PUBLIC_SITE_URL`** in Vercel Production and redeploy. [`getSiteUrl()`](src/config/site.ts) uses `siteConfig.url` (`www`) for production and local builds, and **`VERCEL_URL` only when `VERCEL_ENV` is `preview`**.

5. **Post-launch monitoring** — In GSC, watch **Pages** (indexing), **Sitemaps** (success/errors), and **Experience** / **Core Web Vitals** as traffic grows. Use **URL Inspection** on key URLs after large content or template changes.

6. **Primary query focus** — On-page copy, metadata, FAQ (visible + `FAQPage` JSON-LD), and `RealEstateAgent` / `areaServed` emphasize **The Lakes Las Vegas**. Source of truth: [`src/lib/the-lakes-aeo.ts`](src/lib/the-lakes-aeo.ts). Re-inspect important URLs in GSC after substantive SEO edits.

Copy `.env.example` to `.env.local` for local development.

## Lighthouse / CSP and third-party embeds

- **Content Security Policy** lives in [`next.config.ts`](next.config.ts). **RealScout** pulls **Google Fonts** (`fonts.googleapis.com` CSS + `fonts.gstatic.com` font files); both are allowlisted so the widget does not trip `style-src` / `font-src` in DevTools. After deploy, open a page with RealScout (e.g. `/listings`) and confirm the console has **no** CSP error for `fonts.googleapis.com`.
- **Instagram** on the homepage uses **click-to-load** when [`theLakesInstagram.embedClickToLoad`](src/lib/site-config.ts) is `true` ([`InstagramProfileEmbed.tsx`](src/components/social/InstagramProfileEmbed.tsx)) so third-party cookies and `embed.js` load only after the user opts in. Set `embedClickToLoad: false` for immediate embed (worse for cookie audits).
- **Google Maps** iframes ([`contact/page.tsx`](src/app/contact/page.tsx), [`page.tsx`](src/app/page.tsx), optional My Maps in `openHouseWeekend`) load Google’s viewer (`gstatic.com` / `gmeviewer`). Lighthouse may report **deprecated `unload` listeners** — that code is **Google’s**, not ours. To remove it from audits, replace the iframe with a **static map image** + “Open in Google Maps” link (e.g. Maps Static API or a hosted screenshot).
- **COOP / Trusted Types:** not enabled here; strict policies often break Calendly, Instagram, Maps, and RealScout without a dedicated hardening pass.

## Cursor / AI-assisted coding

- **[`AGENTS.md`](AGENTS.md)** — project context for tools and collaborators (stack, critical paths, CI commands, IDX/RealScout/NAP guardrails).
- **[`.cursor/rules/`](.cursor/rules/)** — Cursor **project rules** (`.mdc`): **`thelakesvegas.mdc`** always on; **`next-app-router`**, **`api-route-handlers`**, **`seo-schema-local`** apply when you work under matching paths.
- See also **[CONTRIBUTING.md — Coding in Cursor](CONTRIBUTING.md#coding-in-cursor)**.

## Version control (Git)

- **Remote:** [github.com/DrJanDuffy/thelakesvegas.com](https://github.com/DrJanDuffy/thelakesvegas.com) — default branch **`main`** (production deploys on Vercel use this branch once the project is linked).
- **Workflow:** short-lived **feature branches** → **pull request** → merge to `main`. Previews deploy from non-`main` branches when Vercel Git integration is enabled.
- **Ignored / never commit:** `.env`, `.env*.local`, `.vercel/`, `node_modules/`, `.next/` — see [`.gitignore`](.gitignore). Secrets belong in Vercel **Environment Variables** or local `.env.local` only.
- **Line endings:** [`.gitattributes`](.gitattributes) sets `text=auto` and `eol=lf` for text files to reduce noisy diffs across Windows and macOS.
- **Contributors:** see [CONTRIBUTING.md](CONTRIBUTING.md) and the [PR template](.github/pull_request_template.md).
- **CI:** [GitHub Actions](.github/workflows/ci.yml) runs **lint**, **`npm run type-check`**, and **`next build`** on pushes and PRs to `main` (build uses a dummy `NEXT_PUBLIC_SITE_URL` so it does not need your secrets).

```bash
git status
git pull origin main
git checkout -b feat/your-change
# … edit, then …
git add -A && git commit -m "feat: describe change" && git push -u origin feat/your-change
```

## Commands

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build   # or: vercel build (Vercel CLI)
```

## Hosting on Vercel

This app targets **Vercel** as the host: Next.js 15 App Router, middleware (apex → `www`), security headers and CSP in [`next.config.ts`](next.config.ts), and [`@vercel/analytics`](https://vercel.com/docs/analytics) in [`src/app/layout.tsx`](src/app/layout.tsx).

1. **Import the repo** — [vercel.com/new](https://vercel.com/new) → connect **GitHub** → select `DrJanDuffy/thelakesvegas.com`. Set **Production Branch** to `main` (Project → Settings → Git).
2. **Build settings** — [`vercel.json`](vercel.json) sets `framework: nextjs`, `installCommand` / `buildCommand` so installs and builds match local `npm` + `next build`. [`package.json`](package.json) `engines.node` is `>=20.9.0` (aligned with Next 15 on Vercel).
3. **Environment variables** — In the Vercel project, add variables from [`.env.example`](.env.example) for **Production** (and **Preview** where you need them). At minimum for the live domain:

   | Variable | Production | Preview |
   |----------|------------|---------|
   | `NEXT_PUBLIC_SITE_URL` | `https://www.thelakesvegas.com` (no trailing slash) | Optional — omit to let `getSiteUrl()` use `VERCEL_URL` for correct preview sitemaps |
   | `GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag value | Optional |
   | Optional API keys | Redis, FUB, OpenRouter, Anthropic, etc. | Same if you test integrations on previews |

   System variables (`VERCEL`, `VERCEL_URL`, …) are [injected by Vercel](https://vercel.com/docs/projects/environment-variables/system-environment-variables) automatically.

4. **Custom domains** — Add **`www.thelakesvegas.com`** and **`thelakesvegas.com`** under Project → Settings → Domains; point DNS at Vercel per the dashboard. With **Cloudflare**, keep records **DNS only** (gray cloud) so SSL terminates at Vercel and you avoid [proxy conflicts](https://vercel.com/docs/domains/working-with-cloudflare).
5. **Smoke test after deploy** — `/`, `/robots.txt`, `/sitemap.xml`, and a few key routes; confirm middleware redirects apex → `www` on production.

Local parity: `npx vercel link` then `npx vercel env pull` (see below).

## Vercel environments

Vercel uses **Local**, **Preview**, and **Production** by default; Pro/Enterprise can add **custom** environments (e.g. staging). Each environment can have its own variables. Official overview: [Environments](https://vercel.com/docs/deployments/environments).

| Environment | When | This repo |
|-------------|------|-----------|
| **Local** | Develop on your machine | Copy `.env.example` → `.env.local`, or after `vercel link`: `vercel env pull` to sync dashboard vars into `.env.local`. |
| **Preview** | Push a non-`main` branch, open a PR, or `vercel` (no `--prod`) | `getSiteUrl()` uses `VERCEL_URL` when `VERCEL_ENV` is `preview` so sitemap/robots match the `*.vercel.app` host. |
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

**This repo:** On previews (`VERCEL_ENV=preview`), `getSiteUrl()` uses `VERCEL_URL` so `sitemap.xml` / `robots.txt` match the preview host. Production uses `siteConfig.url` (`www`) when `NEXT_PUBLIC_SITE_URL` is unset; setting `NEXT_PUBLIC_SITE_URL` in Production is still recommended for explicit canonical control.

## Project layout

- [`.gitattributes`](.gitattributes) — Git EOL normalization for cross-platform clones.
- [`.editorconfig`](.editorconfig) — shared editor defaults (indent, UTF-8, LF) alongside `.gitattributes`.
- [CONTRIBUTING.md](CONTRIBUTING.md) — branch/PR workflow; [`.github/pull_request_template.md`](.github/pull_request_template.md) — merge checklist.
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — CI: ESLint, TypeScript, production build.
- [`.github/dependabot.yml`](.github/dependabot.yml) — weekly npm + monthly GitHub Actions dependency PRs.
- [SECURITY.md](SECURITY.md) — how to report security issues; secrets hygiene.
- [`AGENTS.md`](AGENTS.md), [`.cursor/rules/`](.cursor/rules/) (`*.mdc`), [`.cursorignore`](.cursorignore) — Cursor / agent context and lean indexing.
- `vercel.json` — Vercel project defaults: **Next.js** framework, `npm install` + `next build` (see [Project Configuration](https://vercel.com/docs/project-configuration)).
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
| GitHub Actions | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint / type-check / build (not a Vercel deploy) |
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
