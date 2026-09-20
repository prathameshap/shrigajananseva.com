import type { Metadata } from "next";
import { MarkdownPage, markdownMetadata } from "@/components/site/MarkdownPage";
import { PrivacyRequestForm } from "@/components/forms/PrivacyRequestForm";
import { Card, GoldRule } from "@/components/ui";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return markdownMetadata("legal-privacy-choices", await resolveLocale(params));
}

export default async function PrivacyChoicesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <MarkdownPage
      slug="legal-privacy-choices"
      locale={locale}
      crumbs={crumbs(locale, ["legal.privacyChoices", "/legal/privacy-choices"])}
    >
      <div id="request" className="mt-14 scroll-mt-32">
        <GoldRule className="mb-10 max-w-xs" />
        <h2 className="text-2xl">Submit a request</h2>
        <p className="mt-2 text-muted">
          This form goes to the trustee responsible for privacy requests. You will be given a
          reference number.
        </p>
        <Card className="mt-6 p-6 sm:p-8">
          <PrivacyRequestForm locale={locale} />
        </Card>
      </div>
    </MarkdownPage>
  );
}
