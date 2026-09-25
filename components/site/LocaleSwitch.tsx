"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";

/**
 * Swaps the locale segment of the current path, keeping the rest of it.
 *
 * Also writes the `sgs_locale` cookie that middleware reads, so a later visit
 * to a bare URL lands in the language the reader last chose rather than
 * whatever their browser happens to send in Accept-Language. Set from the
 * client because the switch is a link, not a form post.
 */
export function LocaleSwitch({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;

  function pathFor(locale: Locale) {
    const segments = pathname.split("/");
    // segments[0] is "" for a leading slash, segments[1] is the locale.
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return (
    <div className="flex items-center rounded-full border border-night-600 p-0.5">
      <span className="sr-only">{label}</span>
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={pathFor(locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.cookie = `sgs_locale=${locale}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={
              active
                ? "rounded-full bg-marigold-400 px-3 py-1 text-sm font-semibold text-ink-900"
                : "rounded-full px-3 py-1 text-sm font-semibold text-sandal-200 transition-colors hover:bg-night-700 hover:text-marigold-300"
            }
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}
