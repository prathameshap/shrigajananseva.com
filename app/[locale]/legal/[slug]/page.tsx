import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProsePage } from "@/components/shared/ProsePage";
import { getPage } from "@/lib/pages";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs } from "@/lib/route";

/**
 * The policy pages. They are Markdown rather than JSX because they get edited
 * by whoever is dealing with the lawyer, and a stray bracket in a .tsx file
 * takes the whole site down with it.
 */
const SLUGS = ["privacy", "terms", "accessibility", "privacy-choices"] as const;

type Slug = (typeof SLUGS)[number];

const NAV_KEY: Record<Slug, string> = {
  privacy: "navGroups.privacy",
  terms: "navGroups.terms",
  accessibility: "navGroups.accessibility",
  "privacy-choices": "navGroups.privacyChoices",
};

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => SLUGS.map((slug) => ({ locale, slug })));
}

function isSlug(value: string): value is Slug {
  return (SLUGS as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw) || !isSlug(slug)) return {};
  const locale = raw as Locale;
  const page = getPage(slug, locale);
  if (!page) return {};

  return pageMetadata({
    locale,
    title: page.title,
    description: page.description,
    path: `/legal/${slug}`,
  });
}

export default async function LegalPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw) || !isSlug(slug)) notFound();
  const locale = raw as Locale;

  const page = getPage(slug, locale);
  if (!page) notFound();

  return (
    <ProsePage
      locale={locale}
      page={page}
      crumbs={crumbs(locale, [NAV_KEY[slug], `/legal/${slug}`])}
    />
  );
}
