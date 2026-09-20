"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";

/** Sidebar nav for the portal, with the current section marked. */
export function PortalNav({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items.map((item) => {
          // The dashboard root must match exactly, or it stays highlighted on
          // every child page.
          const isRoot = item.href.endsWith("/portal");
          const active = isRoot
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "block rounded-full px-4 py-2.5 font-medium whitespace-nowrap transition-colors lg:rounded-xl",
                  active
                    ? "bg-saffron-600 text-sandal-50"
                    : "text-body hover:bg-surface hover:text-brand",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
