import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin is auth-gated; /quote is a form with nothing to index and its
      // query variants would only dilute the crawl budget.
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
