import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/lib/site-config";

/** Default Open Graph / Twitter image (under `public/`). */
export const DEFAULT_OG_IMAGE_PATH = "/Image/hero_bg_1.jpg";

export type BuildPageMetadataInput = {
  /** URL path only, e.g. `/contact` or `/` */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  /** Path under `public/`, leading slash optional */
  ogImagePath?: string;
  robots?: Metadata["robots"];
  /** Merged over default Open Graph (e.g. `type: "profile"` for agent pages) */
  openGraphOverrides?: Partial<NonNullable<Metadata["openGraph"]>>;
};

/**
 * Per-route Metadata with canonical URL, Open Graph, and Twitter cards.
 * Uses `siteConfig.url` / `siteUrl()` for absolute URLs (GSC / social).
 */
export function buildPageMetadata({
  path,
  title,
  description,
  keywords,
  ogImagePath = DEFAULT_OG_IMAGE_PATH,
  robots,
  openGraphOverrides,
}: BuildPageMetadataInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = siteUrl(normalizedPath === "/" ? "/" : normalizedPath);
  const imgPath = ogImagePath.startsWith("/") ? ogImagePath : `/${ogImagePath}`;
  const ogImageUrl = siteUrl(imgPath);

  const base: Metadata = {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    ...(robots !== undefined ? { robots } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: `${siteConfig.name} | ${siteConfig.brandLine}`,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImageUrl, alt: `${siteConfig.name} — Las Vegas real estate` }],
      ...openGraphOverrides,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };

  return base;
}
