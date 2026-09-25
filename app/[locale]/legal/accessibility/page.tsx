import type { Metadata } from "next";
import { MarkdownPage, markdownMetadata } from "@/components/site/MarkdownPage";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return markdownMetadata("legal-accessibility", await resolveLocale(params));
}

export default async function AccessibilityPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return (
    <MarkdownPage
      slug="legal-accessibility"
      locale={locale}
      crumbs={crumbs(locale, ["legal.accessibility", "/legal/accessibility"])}
    />
  );
}
