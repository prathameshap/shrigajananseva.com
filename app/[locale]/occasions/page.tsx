import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import { OccasionCard } from "@/components/shared/OccasionCard";
import {
  ButtonLink,
  Card,
  cx,
  Section,
  SectionHeader,
} from "@/components/ui";
import { occasionYears, occasions, pastOccasions, upcomingOccasions } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; year?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.occasions.title,
    description: dict.occasions.intro,
    path: "/occasions",
  });
}

const TYPES = ["utsav", "upasana", "seva-drive"] as const;

/**
 * Filtering is done with plain links and read off the query string rather than
 * with client-side state.
 *
 * It costs no JavaScript, it works with the back button, a filtered view can be
 * shared as a URL, and it keeps working for someone on a connection where the
 * bundle never arrives.
 */
export default async function OccasionsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { type: rawType, year: rawYear } = await searchParams;

  const type = TYPES.includes(rawType as (typeof TYPES)[number]) ? rawType : undefined;
  const year = rawYear && /^\d{4}$/.test(rawYear) ? Number(rawYear) : undefined;

  const matches = (occasion: (typeof occasions)[number]) =>
    (!type || occasion.type === type) &&
    (!year || new Date(occasion.start).getUTCFullYear() === year);

  const upcoming = upcomingOccasions().filter(matches);
  const past = pastOccasions().filter(matches);

  const base = localePath(locale, "/occasions");
  const filterHref = (next: { type?: string; year?: number }) => {
    const query = new URLSearchParams();
    const nextType = "type" in next ? next.type : type;
    const nextYear = "year" in next ? next.year : year;
    if (nextType) query.set("type", nextType);
    if (nextYear) query.set("year", String(nextYear));
    const queryString = query.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const typeLabels: Record<string, string> = {
    utsav: dict.occasions.typeUtsav,
    upasana: dict.occasions.typeUpasana,
    "seva-drive": dict.occasions.typeSevaDrive,
  };

  const filtered = Boolean(type || year);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.occasions}
        title={dict.occasions.title}
        description={dict.occasions.intro}
        crumbs={crumbs(locale, ["nav.occasions", "/occasions"])}
        aside={
          <Card tone="gold" className="p-6">
            <h2 className="text-lg">{dict.occasions.subscribeCalendar}</h2>
            <p className="mt-2 text-muted">{dict.occasions.subscribeCalendarBody}</p>
            <ButtonLink href={`/api/calendar?locale=${locale}`} className="mt-5">
              <Icon.Download className="h-5 w-5" />
              {dict.occasions.addToCalendar}
            </ButtonLink>
          </Card>
        }
      />

      {/* ───────────────────────────────────────────────────────── filters ─── */}
      <Section tone="canvas" className="py-8 sm:py-10">
        <div className="flex flex-col gap-5">
          <FilterRow label={dict.occasions.filterType}>
            <FilterChip href={filterHref({ type: undefined })} active={!type}>
              {dict.occasions.allTypes}
            </FilterChip>
            {TYPES.map((value) => (
              <FilterChip
                key={value}
                href={filterHref({ type: value })}
                active={type === value}
              >
                {typeLabels[value]}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label={dict.occasions.filterYear}>
            <FilterChip href={filterHref({ year: undefined })} active={!year}>
              {dict.occasions.allYears}
            </FilterChip>
            {occasionYears().map((value) => (
              <FilterChip
                key={value}
                href={filterHref({ year: value })}
                active={year === value}
              >
                {value}
              </FilterChip>
            ))}
          </FilterRow>

          {filtered ? (
            <Link
              href={base}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              <Icon.Close className="h-4 w-4" />
              {dict.common.clearFilters}
            </Link>
          ) : null}
        </div>
      </Section>

      {/* ──────────────────────────────────────────────────────── upcoming ─── */}
      <Section tone="tint">
        <SectionHeader eyebrow={dict.nav.occasions} title={dict.occasions.upcomingTitle} />
        {upcoming.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((occasion) => (
              <OccasionCard key={occasion.slug} occasion={occasion} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted">
            {filtered ? dict.common.noResults : dict.occasions.noneUpcoming}
          </p>
        )}

        <div className="mt-8 rounded-card border border-hairline bg-surface p-6">
          <p className="flex items-start gap-3 text-muted">
            <Icon.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            {dict.occasions.rsvpNote}
          </p>
        </div>
      </Section>

      {/* ──────────────────────────────────────────────────────────── past ─── */}
      {past.length ? (
        <Section tone="canvas">
          <SectionHeader
            eyebrow={dict.nav.occasions}
            title={dict.occasions.pastTitle}
            description={t(
              {
                en: "Kept here so the record of what the sangha actually did is not lost each year.",
                mr: "संघाने प्रत्यक्षात काय केले याची नोंद दरवर्षी हरवू नये म्हणून येथे ठेवली आहे.",
              },
              locale,
            )}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((occasion) => (
              <OccasionCard key={occasion.slug} occasion={occasion} locale={locale} past />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cx(
        "inline-flex min-h-9 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
        active
          ? "border-saffron-600 bg-saffron-600 text-sandal-50"
          : "border-hairline-strong bg-surface text-heading hover:border-saffron-400 hover:bg-surface-raised",
      )}
    >
      {children}
    </Link>
  );
}
