import { SiteHeader, type ResolvedNavItem } from "@/components/site/SiteHeader";
import { site } from "@/lib/content";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";
import { lookup, primaryNav } from "@/lib/nav";
import { isOpenToday, weeklyHours } from "@/lib/schedule";

/**
 * Server half of the header: resolves nav labels and the open/closed state so
 * the client component receives plain strings and never has to load a
 * dictionary or the content layer into the browser bundle.
 */
export function HeaderShell({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const nav: ResolvedNavItem[] = primaryNav.map((item) => ({
    href: localePath(locale, item.href),
    label: lookup(dict, item.labelKey),
    children: item.children?.map((child) => ({
      href: localePath(locale, child.href),
      label: lookup(dict, child.labelKey),
    })),
  }));

  const openDays = weeklyHours().map((entry) => shortDay(dict, entry.day));

  return (
    <SiteHeader
      locale={locale}
      nav={nav}
      labels={{
        siteName: t(site.displayName, locale),
        tagline: t(site.tagline, locale),
        donate: dict.nav.donate,
        portal: dict.nav.portal,
        menu: dict.nav.menu,
        openMenu: dict.nav.openMenu,
        closeMenu: dict.nav.closeMenu,
        skipToContent: dict.nav.skipToContent,
        language: dict.common.language,
        theme: dict.common.theme,
        themeLight: dict.common.themeLight,
        themeDark: dict.common.themeDark,
        themeSystem: dict.common.themeSystem,
        openToday: dict.visit.openToday,
        closedToday: dict.visit.closedToday,
      }}
      phone={site.contact.phone}
      phoneE164={site.contact.phoneE164}
      hoursSummary={openDays.join(" · ")}
      isOpenNow={isOpenToday()}
    />
  );
}

function shortDay(dict: ReturnType<typeof getDictionary>, day: number) {
  const names = [
    dict.days.sunday,
    dict.days.monday,
    dict.days.tuesday,
    dict.days.wednesday,
    dict.days.thursday,
    dict.days.friday,
    dict.days.saturday,
  ];
  return names[day];
}
