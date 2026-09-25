import type { Metadata } from "next";
import { CollectionPage } from "@/components/library/CollectionPage";
import { getDictionary } from "@/lib/i18n";
import { localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return {
    title: dict.navGroups.newsletterArchive,
    description:
      "Every issue of the Shri Gajanan Seva monthly newsletter, sent on the last day of each month.",
  };
}

export default async function NewslettersPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return (
    <CollectionPage
      type="newsletter"
      locale={locale}
      titleKey={dict.navGroups.newsletterArchive}
      description="Sent on the last day of every month — seva reports, utsav news and upcoming dates. Devotees have kept this seva going without interruption for close to two years."
      href="/library/newsletters"
    />
  );
}
