"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icon } from "@/components/icons";
import { cx } from "@/components/ui";
import { locales, localeNames, type Locale } from "@/lib/i18n";

/**
 * Swaps the locale segment of the current URL, so the visitor stays on the
 * page they were reading instead of being dropped back on the home page.
 *
 * The choice is remembered in a cookie that middleware reads, so a later
 * visit to a bare URL lands in the right language straight away.
 */
export function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `sgs_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    const segments = pathname.split("/");
    segments[1] = next;
    startTransition(() => router.push(segments.join("/") || "/"));
  }

  return (
    <div
      className={cx("inline-flex items-center gap-1", pending && "opacity-60")}
      role="group"
      aria-label={label}
    >
      <Icon.Globe className="mr-0.5 h-4 w-4 text-muted" />
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => switchTo(code)}
          aria-current={code === locale ? "true" : undefined}
          className={cx(
            "rounded-full px-2.5 py-1 text-sm font-semibold transition-colors",
            code === locale
              ? "bg-brand-soft text-brand"
              : "text-muted hover:bg-surface-raised hover:text-heading",
          )}
        >
          {localeNames[code]}
        </button>
      ))}
    </div>
  );
}
