/**
 * Long-form page copy, written as Markdown.
 *
 * Structured records live in `content/data/*.json`; prose lives here, in
 * `content/pages/<slug>.<locale>.md`. A trustee editing the About page should
 * be editing something that looks like a document, not a JSON string with
 * escaped newlines in it.
 *
 * A missing `<slug>.mr.md` silently falls back to `<slug>.en.md`, so Marathi
 * can be added one page at a time.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { defaultLocale, type Locale } from "@/lib/i18n";

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export type PageDoc = {
  slug: string;
  locale: Locale;
  /** True when this is the English fallback shown to a Marathi reader. */
  fallback: boolean;
  title: string;
  description?: string;
  eyebrow?: string;
  updated?: string;
  html: string;
};

marked.setOptions({ gfm: true, breaks: false });

function readFileFor(slug: string, locale: Locale): { raw: string; fallback: boolean } | null {
  const localised = path.join(PAGES_DIR, `${slug}.${locale}.md`);
  if (fs.existsSync(localised)) {
    return { raw: fs.readFileSync(localised, "utf8"), fallback: false };
  }
  const fallbackPath = path.join(PAGES_DIR, `${slug}.${defaultLocale}.md`);
  if (fs.existsSync(fallbackPath)) {
    return { raw: fs.readFileSync(fallbackPath, "utf8"), fallback: locale !== defaultLocale };
  }
  return null;
}

export function getPage(slug: string, locale: Locale): PageDoc | null {
  const file = readFileFor(slug, locale);
  if (!file) return null;

  const { data, content } = matter(file.raw);
  return {
    slug,
    locale,
    fallback: file.fallback,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : undefined,
    eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : undefined,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    html: marked.parse(content, { async: false }),
  };
}

/** Throws rather than rendering an empty page — a missing file is a build bug. */
export function requirePage(slug: string, locale: Locale): PageDoc {
  const page = getPage(slug, locale);
  if (!page) {
    throw new Error(
      `Missing page content: content/pages/${slug}.${defaultLocale}.md. ` +
        `Create it, or remove the route that reads it.`,
    );
  }
  return page;
}

export function listPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(PAGES_DIR)) {
    const match = /^(.+)\.(en|mr)\.md$/.exec(file);
    if (match) slugs.add(match[1]);
  }
  return [...slugs].sort();
}
