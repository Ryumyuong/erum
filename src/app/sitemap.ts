import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getBlogPosts, getGlossaryTerms, getPortfolio } from "@/lib/db/queries";

/** Static routes, most important first. */
const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/portfolio", priority: 0.9, freq: "weekly" },
  { path: "/about", priority: 0.8, freq: "monthly" },
  { path: "/guide", priority: 0.8, freq: "monthly" },
  { path: "/quote", priority: 0.7, freq: "monthly" },
  { path: "/faq", priority: 0.6, freq: "monthly" },
  { path: "/glossary", priority: 0.6, freq: "monthly" },
  { path: "/blog", priority: 0.6, freq: "weekly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
  { path: "/terms", priority: 0.2, freq: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // A DB hiccup shouldn't take the whole sitemap down — fall back to the
  // static routes rather than returning a 500 to the crawler.
  const [portfolio, posts, terms] = await Promise.all([
    getPortfolio().catch(() => []),
    getBlogPosts().catch(() => []),
    getGlossaryTerms().catch(() => []),
  ]);

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${siteUrl}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...portfolio.map((p) => ({
      url: `${siteUrl}/portfolio/${encodeURIComponent(p.itemNo)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(p.slug)}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...terms.map((t) => ({
      url: `${siteUrl}/glossary/${encodeURIComponent(t.id)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
