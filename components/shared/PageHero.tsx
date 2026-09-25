import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "@/components/icons";
import { MandalaField, PetalDivider } from "@/components/decor";
import { Container, Eyebrow, GoldRule } from "@/components/ui";

/**
 * The band at the top of every inner page.
 *
 * One component rather than a bespoke header per route, because the previous
 * pages each invented their own and the result was a site where no two sections
 * agreed on where the title sat. The mandala and the petal seam are what stop a
 * flat tint band reading as an empty rectangle.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  aside,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: { name: string; href: string }[];
  /** Rendered to the right on wide screens — hours, a CTA, a fact box. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden border-b border-hairline bg-surface-raised festive-wash">
      <MandalaField className="-top-24 -right-24 h-96 w-96 text-gold-500 opacity-25" />

      <Container width="wide">
        <div className="relative py-10 sm:py-14">
          {crumbs?.length ? <Breadcrumbs trail={crumbs} /> : null}

          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
              {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
              <h1 className="text-4xl sm:text-5xl">{title}</h1>
              <GoldRule className="mt-5 max-w-32" />
              {description ? (
                <p className="mt-5 max-w-2xl text-lg text-muted">{description}</p>
              ) : null}
              {children ? <div className="mt-6">{children}</div> : null}
            </div>
            {aside ? <div className="lg:col-span-5">{aside}</div> : null}
          </div>
        </div>
      </Container>

      <PetalDivider className="absolute inset-x-0 bottom-0 text-gold-400" />
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 ? (
                <Icon.ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
              ) : null}
              {last ? (
                <span aria-current="page" className="font-semibold text-heading">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-accent hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
