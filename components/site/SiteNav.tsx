"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { buttonClass, cx } from "@/components/ui";

export type NavNode = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

/**
 * The primary navigation, in both its desktop and mobile forms.
 *
 * Submenus open on click, never on hover. A hover-only menu is unusable by
 * keyboard, unreachable on touch, and hostile to anyone with a tremor — and a
 * meaningful share of this congregation is in at least one of those groups.
 * The top-level item is itself a real link, so "About" goes to /about whether
 * or not you ever open its submenu.
 */
export function SiteNav({
  items,
  donate,
  labels,
}: {
  items: NavNode[];
  donate: { href: string; label: string };
  labels: { menu: string; close: string };
}) {
  const pathname = usePathname() ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Any navigation closes the drawer. Without this it stays open over the new
  // page, because App Router transitions do not unmount the layout.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* ------------------------------------------------------- desktop */}
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              {item.children?.length ? (
                <DesktopMenu item={item} active={isActive(item.href)} />
              ) : (
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={topLinkClass(isActive(item.href))}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* --------------------------------------------------- mobile toggle */}
      <div className="flex items-center gap-2 lg:hidden">
        <Link href={donate.href} className={buttonClass("primary", "sm")}>
          <Icon.Heart className="h-4 w-4" />
          {donate.label}
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          className="grid h-11 w-11 place-items-center rounded-full border border-hairline-strong text-heading"
        >
          <Icon.Menu className="h-6 w-6" />
          <span className="sr-only">{labels.menu}</span>
        </button>
      </div>

      {/* --------------------------------------------------- mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={labels.close}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-night-950/60"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-canvas shadow-lift">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <span className="font-display text-lg text-heading">{labels.menu}</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-hairline-strong text-heading"
              >
                <Icon.Close className="h-6 w-6" />
                <span className="sr-only">{labels.close}</span>
              </button>
            </div>

            <nav aria-label="Primary" className="flex-1 px-3 py-4">
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cx(
                        "block rounded-xl px-4 py-3 font-semibold",
                        isActive(item.href)
                          ? "bg-brand-soft text-brand"
                          : "text-heading hover:bg-surface-raised",
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children?.length ? (
                      <ul className="mt-0.5 mb-2 ml-4 flex flex-col gap-0.5 border-l border-hairline pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={pathname === child.href ? "page" : undefined}
                              className={cx(
                                "block rounded-lg px-3 py-2.5",
                                pathname === child.href
                                  ? "font-semibold text-accent"
                                  : "text-muted hover:text-accent",
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

function topLinkClass(active: boolean) {
  return cx(
    "inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 font-semibold transition-colors",
    active ? "bg-brand-soft text-brand" : "text-heading hover:bg-surface-raised",
  );
}

function DesktopMenu({ item, active }: { item: NavNode; active: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      <span className={cx(topLinkClass(active), "pr-1.5")}>
        <Link href={item.href} className="rounded-full">
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid h-7 w-7 place-items-center rounded-full hover:bg-surface"
        >
          <Icon.ChevronDown
            className={cx("h-4 w-4 transition-transform", open && "rotate-180")}
          />
          <span className="sr-only">{item.label}</span>
        </button>
      </span>

      {open ? (
        <ul
          id={panelId}
          className="absolute left-0 top-full z-40 mt-1 w-72 overflow-hidden rounded-card border border-hairline bg-surface py-2 shadow-lift"
        >
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={pathname === child.href ? "page" : undefined}
                className={cx(
                  "flex items-center justify-between gap-2 px-4 py-2.5",
                  pathname === child.href
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-body hover:bg-surface-raised hover:text-accent",
                )}
              >
                {child.label}
                <Icon.ChevronRight className="h-4 w-4 opacity-40" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
