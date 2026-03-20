# thelakesvegas.com

Next.js 15 (App Router) site scaffold with **Google Search Console–ready** routing.

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
- `src/app/sitemap.ts` — `MetadataRoute.Sitemap` for discoverable URLs.
- `src/app/robots.ts` — allows crawlers and points to the sitemap.
- `src/config/site.ts` — resolves canonical base URL from env (default `https://www.thelakesvegas.com`).
- `src/app/layout.tsx` — `metadataBase`, default SEO fields, optional Google verification.
