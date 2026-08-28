import type { Metadata } from "next";

/**
 * Canonical origin for absolute URLs (og:image, sitemap, canonical links).
 * Crawlers cannot resolve relative paths, so this has to be a real origin —
 * set NEXT_PUBLIC_SITE_URL to the production domain before launch.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "BOXDLE";

/**
 * Page-level metadata helper. Sets the canonical URL alongside the title and
 * description so query-string variants (?item=, filter params) don't get
 * indexed as separate pages.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
