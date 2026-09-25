<<<<<<< HEAD
import Link from "next/link";

import { Icon } from "@/components/icons";
import { LotusMark } from "@/components/decor";
import { buttonClass, Container } from "@/components/ui";
import { LocaleSwitch } from "@/components/site/LocaleSwitch";
import { OpenStatus } from "@/components/site/OpenStatus";
import { SiteNav, type NavNode } from "@/components/site/SiteNav";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { site } from "@/lib/content";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";
import { lookup, primaryNav } from "@/lib/nav";

/**
 * The site header.
 *
 * Two bars. The narrow indigo one carries the facts somebody arrives looking
 * for — are you open, what is the phone number, which language, which theme.
 * The white one carries navigation and the donate call to action.
 *
 * Everything that needs the current minute or the current path is delegated to
 * a small client component; this shell stays a server component so the
 * dictionary and the content layer never reach the browser.
 */
export async function HeaderShell({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const items: NavNode[] = primaryNav.map((item) => ({
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
    href: localePath(locale, item.href),
    label: lookup(dict, item.labelKey),
    children: item.children?.map((child) => ({
      href: localePath(locale, child.href),
      label: lookup(dict, child.labelKey),
    })),
  }));

<<<<<<< HEAD
  return (
    <header className="sticky top-0 z-40">
      <a href="#main" className="skip-link">
        {dict.common.skipToContent}
      </a>

      {/* ----------------------------------------------------- utility bar */}
      <div className="bg-night-900 text-sandal-200">
        <Container width="wide">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
            <div className="flex items-center gap-5">
              <OpenStatus
                hours={site.hours.map(({ day, opens, closes }) => ({ day, opens, closes }))}
                timezone={site.timezone}
                locale={locale}
                labels={{
                  open: dict.header.openNow,
                  closed: dict.header.closedNow,
                  closesAt: dict.header.closesAt,
                  opensAt: dict.header.opensAt,
                }}
              />
              <a
                href={`tel:${site.contact.phoneE164}`}
                className="hidden items-center gap-2 text-sm transition-colors hover:text-marigold-300 sm:flex"
              >
                <Icon.Phone className="h-4 w-4" />
                {site.contact.phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <LocaleSwitch current={locale} label={dict.language.label} />
              <ThemeToggle
                labels={{
                  label: dict.theme.label,
                  light: dict.theme.light,
                  dark: dict.theme.dark,
                }}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* -------------------------------------------------------- main bar */}
      <div className="border-b border-hairline bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80">
        <Container width="wide">
          <div className="flex min-h-18 items-center justify-between gap-4 py-2.5">
            <Link
              href={localePath(locale, "/")}
              className="flex items-center gap-3 rounded-xl"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-500 via-kumkum-500 to-kumkum-700 text-sandal-50 shadow-soft">
                <LotusMark className="h-6 w-6" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-semibold text-heading sm:text-xl">
                  {t(site.displayName, locale)}
                </span>
                <span className="block text-xs tracking-[0.12em] text-muted uppercase">
                  {t(site.tagline, locale)}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <SiteNav
                items={items}
                donate={{ href: localePath(locale, "/donate"), label: dict.nav.donate }}
                labels={{ menu: dict.common.menu, close: dict.common.close }}
              />
              <Link
                href={localePath(locale, "/donate")}
                className={`${buttonClass("primary", "md")} hidden lg:inline-flex`}
              >
                <Icon.Heart className="h-5 w-5" />
                {dict.nav.donate}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
