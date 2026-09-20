import type { MetadataRoute } from "next";
import { library, occasions, site } from "@/lib/content";
import { locales } from "@/lib/i18n";

/**
 * Every public page, in both languages, cross-linked with hreflang.
 *
 * Portal routes are deliberately absent — they are per-devotee and marked
 * noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number; changeFrequency: Change }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/shri-gajanan-maharaj", priority: 0.8, changeFrequency: "yearly" },
    { path: "/about/trustees", priority: 0.5, changeFrequency: "yearly" },
    { path: "/about/transparency", priority: 0.7, changeFrequency: "monthly" },
    { path: "/visit", priority: 0.9, changeFrequency: "monthly" },
    { path: "/daily-seva", priority: 0.9, changeFrequency: "weekly" },
    { path: "/daily-seva/upasana", priority: 0.7, changeFrequency: "monthly" },
    { path: "/daily-seva/nam-jaap", priority: 0.7, changeFrequency: "monthly" },
    { path: "/occasions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/library", priority: 0.8, changeFrequency: "weekly" },
    { path: "/library/texts", priority: 0.7, changeFrequency: "monthly" },
    { path: "/library/audio", priority: 0.7, changeFrequency: "monthly" },
    { path: "/library/videos", priority: 0.6, changeFrequency: "monthly" },
    { path: "/library/newsletters", priority: 0.6, changeFrequency: "monthly" },
    { path: "/get-involved", priority: 0.8, changeFrequency: "monthly" },
    { path: "/get-involved/students", priority: 0.7, changeFrequency: "monthly" },
    { path: "/donate", priority: 0.9, changeFrequency: "monthly" },
    { path: "/connect", priority: 0.7, changeFrequency: "monthly" },
    { path: "/connect/newsletter", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/accessibility", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/privacy-choices", priority: 0.4, changeFrequency: "yearly" },
  ];

  const dynamicPaths: { path: string; priority: number; changeFrequency: Change }[] = [
    ...occasions.map((occasion) => ({
      path: `/occasions/${occasion.slug}`,
      priority: 0.7,
      changeFrequency: "weekly" as Change,
    })),
    ...library.map((item) => ({
      path: `/library/${item.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as Change,
    })),
  ];

  const now = new Date();

  return [...staticPaths, ...dynamicPaths].flatMap((entry) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${entry.path}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, `${site.url}/${other}${entry.path}`]),
        ),
      },
    })),
  );
}

type Change = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
