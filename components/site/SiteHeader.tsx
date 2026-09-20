"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Container, cx } from "@/components/ui";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import type { Locale } from "@/lib/i18n";

export type ResolvedNavItem = {
  href: string;
  label: string;
  children?: ResolvedNavItem[];
};

export type HeaderLabels = {
  siteName: string;
  tagline: string;
  donate: string;
  portal: string;
  menu: string;
  openMenu: string;
  closeMenu: string;
  skipToContent: string;
  language: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  openToday: string;
  closedToday: string;
};

export function SiteHeader({
  locale,
  nav,
  labels,
  phone,
  phoneE164,
  hoursSummary,
  isOpenNow,
}: {
  locale: Locale;
  nav: ResolvedNavItem[];
  labels: HeaderLabels;
  phone: string;
  phoneE164: string;
  hoursSummary: string;
  isOpenNow: boolean;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close everything on navigation — otherwise the drawer stays open over the
  // page the visitor just asked for.
  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Escape closes whichever layer is open; a click outside closes dropdowns.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setDrawerOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  // Stop the page scrolling behind the open mobile drawer.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80">
      <a href="#main" className="skip-link">
        {labels.skipToContent}
      </a>

      {/* Utility bar — hours, phone, language, account */}
      <div className="hidden border-b border-hairline/70 bg-surface-raised lg:block">
        <Container width="wide">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2 text-muted">
                <span
                  className={cx(
                    "h-2 w-2 rounded-full",
                    isOpenNow ? "bg-tulsi-500" : "bg-ink-400",
                  )}
                  aria-hidden="true"
                />
                <span className="font-semibold text-heading">
                  {isOpenNow ? labels.openToday : labels.closedToday}
                </span>
                <span className="text-muted">· {hoursSummary}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                className="inline-flex items-center gap-1.5 text-muted hover:text-accent"
                href={`tel:${phoneE164}`}
              >
                <Icon.Phone className="h-4 w-4" />
                {phone}
              </a>
              <span className="h-4 w-px bg-hairline" aria-hidden="true" />
              <LanguageToggle locale={locale} label={labels.language} />
              <ThemeToggle
                label={labels.theme}
                lightLabel={labels.themeLight}
                darkLabel={labels.themeDark}
                systemLabel={labels.themeSystem}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <Container width="wide">
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3"
            aria-label={labels.siteName}
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={127}
              height={105}
              priority
              className="h-12 w-auto shrink-0"
            />
            <span className="leading-tight">
              <span className="block font-display text-xl text-heading sm:text-[1.35rem]">
                {labels.siteName}
              </span>
              <span className="block text-xs tracking-[0.12em] text-saffron-700 uppercase">
                {labels.tagline}
              </span>
            </span>
          </Link>

          <nav
            ref={navRef}
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {nav.map((item) => {
              const active = isActive(item.href);
              if (!item.children?.length) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "rounded-full px-3.5 py-2 font-medium transition-colors",
                      active ? "bg-brand-soft text-brand" : "text-body hover:bg-surface-raised",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }
              const expanded = openMenu === item.href;
              return (
                <div key={item.href} className="relative">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(expanded ? null : item.href)}
                    className={cx(
                      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 font-medium transition-colors",
                      active || expanded
                        ? "bg-brand-soft text-brand"
                        : "text-body hover:bg-surface-raised",
                    )}
                  >
                    {item.label}
                    <Icon.ChevronDown
                      className={cx(
                        "h-4 w-4 transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                  {expanded ? (
                    <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-card border border-hairline bg-surface p-2 shadow-lift">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 text-body hover:bg-surface-raised hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/portal`}
              className="hidden rounded-full border border-hairline px-4 py-2 font-medium text-heading hover:border-gold-400 hover:bg-surface-raised lg:inline-flex"
            >
              {labels.portal}
            </Link>
            <Link
              href={`/${locale}/donate`}
              className="inline-flex items-center gap-2 rounded-full bg-saffron-600 px-5 py-2.5 font-semibold text-sandal-50 shadow-soft hover:bg-saffron-700"
            >
              <Icon.Heart className="h-4 w-4" />
              {labels.donate}
            </Link>
            <button
              type="button"
              className="rounded-full border border-hairline p-2.5 text-heading lg:hidden"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              {drawerOpen ? (
                <Icon.Close className="h-6 w-6" title={labels.closeMenu} />
              ) : (
                <Icon.Menu className="h-6 w-6" title={labels.openMenu} />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h,4.5rem)] z-40 overflow-y-auto border-t border-hairline bg-canvas lg:hidden"
        >
          <Container>
            <nav aria-label="Primary mobile" className="flex flex-col gap-1 py-6">
              {nav.map((item) => (
                <div key={item.href} className="border-b border-hairline/70 pb-2">
                  <Link
                    href={item.href}
                    className="block py-3 text-lg font-semibold text-heading"
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <div className="flex flex-col pb-2 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="border-l-2 border-hairline py-2 pl-4 text-body hover:border-gold-400 hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              <Link
                href={`/${locale}/portal`}
                className="mt-4 rounded-full border border-hairline px-5 py-3 text-center font-semibold text-heading"
              >
                {labels.portal}
              </Link>

              <div className="mt-6 flex items-center justify-between border-t border-hairline pt-5">
                <LanguageToggle locale={locale} label={labels.language} />
                <ThemeToggle
                  label={labels.theme}
                  lightLabel={labels.themeLight}
                  darkLabel={labels.themeDark}
                  systemLabel={labels.themeSystem}
                />
              </div>
              <a
                className="mt-3 inline-flex items-center gap-2 py-2 text-muted"
                href={`tel:${phoneE164}`}
              >
                <Icon.Phone className="h-4 w-4" />
                {phone}
              </a>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
