# Agent / Cursor context — thelakesvegas.com

Use this file and **Cursor project rules** under [`.cursor/rules/`](.cursor/rules/) so AI-assisted edits stay aligned with this repo.

| Rule file | When it applies |
|-----------|-----------------|
| [`thelakesvegas.mdc`](.cursor/rules/thelakesvegas.mdc) | Always (core stack, IDX, RealScout, CSP, NAP, deploy) |
| [`next-app-router.mdc`](.cursor/rules/next-app-router.mdc) | When editing `src/app/**` |
| [`api-route-handlers.mdc`](.cursor/rules/api-route-handlers.mdc) | When editing `src/app/api/**` |
| [`seo-schema-local.mdc`](.cursor/rules/seo-schema-local.mdc) | When editing `site-config`, `the-lakes-aeo`, or `schema.ts` |

## Stack

- **Next.js 15** App Router, **React 19**, **TypeScript**, **Tailwind CSS**
- **Path alias:** `@/*` → [`src/*`](src/)
- **ESLint:** flat config [`eslint.config.mjs`](eslint.config.mjs) (`next/core-web-vitals`, `next/typescript`)

## Commands (match CI)

```bash
npm run dev          # local dev (Turbopack)
npm run lint
npm run type-check   # tsc --noEmit; *.test.ts(x) excluded from tsconfig
npm run build
```

GitHub Actions runs the same lint / type-check / build on `main` — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Where things live

| Area | Location |
|------|----------|
| Site name, URL, NAP-style fields, open house block | [`src/lib/site-config.ts`](src/lib/site-config.ts) |
| The Lakes FAQ / geo copy (keep in sync with visible FAQ + JSON-LD) | [`src/lib/the-lakes-aeo.ts`](src/lib/the-lakes-aeo.ts) |
| Canonical URL helper | [`src/config/site.ts`](src/config/site.ts) |
| Global layout, scripts (RealScout, analytics, verification meta) | [`src/app/layout.tsx`](src/app/layout.tsx) |
| CSP / security headers | [`next.config.ts`](next.config.ts) |
| Apex → `www` redirect | [`src/middleware.ts`](src/middleware.ts) |

## Hard constraints

1. **Secrets:** Never commit `.env`, `.env.local`, or API keys. Use [`.env.example`](.env.example) as the variable checklist; real values in Vercel or local `.env.local`.
2. **IDX/MLS:** Do **not** change **`src/components/idx/*`** unless there is explicit MLS/IDX approval.
3. **RealScout:** Load the vendor script **once** in root layout; widgets use `dangerouslySetInnerHTML` as elsewhere. CSP must allow both **`em.realscout.com`** and **`www.realscout.com`** for scripts and connections (keep [`next.config.ts`](next.config.ts) in sync if you add domains).
4. **SEO / local:** Visible **NAP** and **LocalBusiness** (and related) JSON-LD should stay consistent with the Google Business Profile when you touch agent/office copy.
5. **Scope:** Prefer minimal diffs; match patterns in neighboring files rather than introducing new architectural style.

## Product notes

- **Dr. Jan Duffy** (not “Janet”), Berkshire Hathaway HomeServices Nevada Properties — license and phone in [`site-config`](src/lib/site-config.ts) when editing NAP.
- Primary public host is **`www`** (see middleware and `NEXT_PUBLIC_SITE_URL`).

## Optional: user-level Cursor rules

Personal preferences (global) can live in Cursor **User Rules**; this repo’s **Project Rules** are the `.mdc` files in [`.cursor/rules/`](.cursor/rules/) (scoped rules attach when you open matching files).
