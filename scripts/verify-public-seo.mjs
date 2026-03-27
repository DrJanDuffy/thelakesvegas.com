#!/usr/bin/env node
/**
 * Validates live production SEO signals (no Vercel token required):
 * - robots.txt declares Sitemap on https://www.thelakesvegas.com
 * - sitemap.xml <loc> entries use that same origin
 *
 * Run after deploy: npm run verify:public-seo
 * Confirms NEXT_PUBLIC_SITE_URL / build output match www in production (see .env.example).
 */

const ORIGIN = "https://www.thelakesvegas.com";
const SITEMAP_URL = `${ORIGIN}/sitemap.xml`;

async function main() {
  const robotsRes = await fetch(`${ORIGIN}/robots.txt`);
  if (!robotsRes.ok) {
    console.error(`robots.txt: HTTP ${robotsRes.status}`);
    process.exit(1);
  }
  const robots = await robotsRes.text();
  if (!robots.includes(SITEMAP_URL)) {
    console.error(`Expected robots.txt to reference Sitemap: ${SITEMAP_URL}`);
    console.error("Got:\n", robots);
    process.exit(1);
  }

  const smRes = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!smRes.ok) {
    console.error(`sitemap.xml: HTTP ${smRes.status}`);
    process.exit(1);
  }
  const sm = await smRes.text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (locs.length === 0) {
    console.error("No <loc> entries in sitemap.xml");
    process.exit(1);
  }

  const bad = locs.filter((u) => u !== ORIGIN && !u.startsWith(`${ORIGIN}/`));
  if (bad.length) {
    console.error("Sitemap URLs must use canonical origin", ORIGIN);
    console.error("Off-origin:", bad);
    process.exit(1);
  }

  console.log(`OK: robots.txt → ${SITEMAP_URL}; ${locs.length} sitemap URLs on ${ORIGIN}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
