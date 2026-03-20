import { siteConfig } from "@/lib/site-config";

const APEX_THELAKES = "thelakesvegas.com";
const WWW_THELAKES = "https://www.thelakesvegas.com";

function normalizeExplicitOrigin(raw: string): string {
  const trimmed = raw.replace(/\/$/, "");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const { hostname, origin } = new URL(withProto);
    if (hostname.toLowerCase() === APEX_THELAKES) {
      return WWW_THELAKES;
    }
    return origin.replace(/\/$/, "");
  } catch {
    return trimmed;
  }
}

/**
 * Canonical origin for sitemap, robots, and env overrides (Vercel previews).
 * Apex thelakesvegas.com in NEXT_PUBLIC_SITE_URL is normalized to https://www.thelakesvegas.com.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeExplicitOrigin(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return siteConfig.url.replace(/\/$/, "");
}
