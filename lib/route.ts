import { notFound } from "next/navigation";
import { getDictionary, isLocale, localePath, locales, type Locale } from "@/lib/i18n";
import { lookup } from "@/lib/nav";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Every page validates its locale segment the same way. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function localeStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Build a breadcrumb trail from dot-paths into the dictionary.
 *
 * `crumbs(locale, ["nav.about", "/about"], ["navGroups.trustees", "/about/trustees"])`
 */
export function crumbs(
  locale: Locale,
  ...trail: [labelKey: string, href: string][]
): { name: string; href: string }[] {
  const dict = getDictionary(locale);
  return [
    { name: dict.nav.home, href: localePath(locale, "/") },
    ...trail.map(([labelKey, href]) => ({
      name: lookup(dict, labelKey),
      href: localePath(locale, href),
    })),
  ];
}
