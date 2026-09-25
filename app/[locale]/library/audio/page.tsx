import type { Metadata } from "next";
import { CollectionPage } from "@/components/library/CollectionPage";
import { getDictionary } from "@/lib/i18n";
import { localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return {
    title: dict.navGroups.audio,
    description:
      "Gan Gan Ganat Bote nam jaap in 24-hour, 12-hour and 108-repetition recordings, plus Shri Gajanan Bavanni and Ashtak.",
  };
}

export default async function AudioPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return (
    <CollectionPage
      type="audio"
      locale={locale}
      titleKey={dict.navGroups.audio}
      description="Nam jaap for akhand sankalp, and a single mala for beginning. Play them in the house, or sit with them."
      href="/library/audio"
    />
  );
}
