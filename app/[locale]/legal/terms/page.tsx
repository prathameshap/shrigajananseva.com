import type { Metadata } from "next";
import { MarkdownPage, markdownMetadata } from "@/components/site/MarkdownPage";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return markdownMetadata("legal-terms", await resolveLocale(params));
}

export default async function TermsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return (
    <MarkdownPage
      slug="legal-terms"
      locale={locale}
      crumbs={crumbs(locale, ["legal.terms", "/legal/terms"])}
    />
  );
}
