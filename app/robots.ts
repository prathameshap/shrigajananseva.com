import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Per-devotee pages. Also marked noindex in their own metadata —
        // robots.txt alone does not remove a page from an index.
        disallow: ["/en/portal", "/mr/portal", "/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
