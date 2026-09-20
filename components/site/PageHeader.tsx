import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Container, GoldRule } from "@/components/ui";

export type Crumb = { name: string; href: string };

/**
 * The band at the top of every inner page: breadcrumb, title, standfirst.
 * Kept consistent across the site so a visitor always knows where they are —
 * the old site gave no such signal.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
  breadcrumbLabel = "Breadcrumb",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  breadcrumbLabel?: string;
}) {
  return (
    <div className="festive-wash border-b border-hairline">
      <Container>
        <div className="py-10 sm:py-14">
          {crumbs?.length ? (
            <nav aria-label={breadcrumbLabel} className="mb-5">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
                {crumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center gap-1">
                    {index > 0 ? (
                      <Icon.ChevronRight className="h-3.5 w-3.5 text-ink-400" />
                    ) : null}
                    {index === crumbs.length - 1 ? (
                      <span aria-current="page" className="font-semibold text-heading">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-accent hover:underline">
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {eyebrow ? (
            <p className="mb-2 text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl">{title}</h1>
              {description ? (
                <p className="mt-4 text-lg text-muted sm:text-xl">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
          </div>

          <GoldRule className="mt-8 max-w-xs" />
        </div>
      </Container>
    </div>
  );
}
