import type { Metadata } from "next";
import { CollectionPage } from "@/components/library/CollectionPage";
import { getDictionary } from "@/lib/i18n";
import { localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return {
    title: dict.navGroups.videos,
    description: "Recordings of utsav, aarti and community programmes.",
  };
}

export default async function VideosPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return (
    <CollectionPage
      type="video"
      locale={locale}
      titleKey={dict.navGroups.videos}
      description="Utsav, aarti and community programmes, recorded and published to our channel."
      href="/library/videos"
    />
  );
}
