import type { Metadata } from "next";

import { locales, type Locale } from "@/lib/i18n";

/**
 * Per-page metadata, with hreflang.
 *
 * The layout already sets `metadataBase` and the `%s · Shri Gajanan Seva` title
 * template, so a page supplies only its own title. `path` is locale-less — this
 * adds the prefix for the canonical and for every alternate, which is the part
 * that was easy to get wrong when each page hand-rolled it.
 */
export function pageMetadata({
  locale,
  title,
  description,
  path,
  noIndex,
}: {
  locale: Locale;
  title: string;
  description?: string;
  /** App-relative and locale-less, e.g. "/about/trustees". "" for home. */
  path: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = `/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}${path}`])),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
