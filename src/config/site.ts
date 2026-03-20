import { siteConfig } from "@/lib/site-config";

/**
 * Canonical origin for sitemap, robots, and env overrides (Vercel previews).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return siteConfig.url.replace(/\/$/, "");
}
