import type { Metadata } from "next";
import { CollectionPage } from "@/components/library/CollectionPage";
import { getDictionary } from "@/lib/i18n";
import { localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return {
    title: dict.navGroups.texts,
    description:
      "Upasana Booklet, Shri Gajanan Stotra, Shriram Vandana, Pradakshina and Prasad, Gajanan Vijay Grantha, Shejarati and Bhupali Aarti.",
  };
}

export default async function TextsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return (
    <CollectionPage
      type="text"
      locale={locale}
      titleKey={dict.navGroups.texts}
      description="The stotras, aartis and booklets recited at the mandir, in Devanagari with transliteration where available."
      href="/library/texts"
    />
  );
}
