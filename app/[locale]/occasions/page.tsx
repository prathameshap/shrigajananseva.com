import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { OccasionCard } from "@/components/shared/OccasionCard";
import { OccasionFilters } from "@/components/occasions/OccasionFilters";
import { ButtonLink, Card, Section } from "@/components/ui";
import { occasions, occasionYears } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

/**
 * Revalidated hourly so "upcoming" does not silently become "past" and sit
 * there until the next deploy.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return { title: dict.occasions.title, description: dict.occasions.intro };
}

export default async function OccasionsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const now = new Date();

  // Upcoming first, then past most-recent-first — the order someone scanning
  // the page actually wants.
  const ordered = [
    ...occasions.filter((occasion) => new Date(occasion.end) >= now),
    ...occasions.filter((occasion) => new Date(occasion.end) < now).reverse(),
  ];

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.occasions}
        title={dict.occasions.title}
        description={dict.occasions.intro}
        crumbs={crumbs(locale, ["nav.occasions", "/occasions"])}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={`/api/calendar?locale=${locale}`} variant="secondary">
            <Icon.Calendar className="h-5 w-5" />
            {dict.occasions.subscribeFeed}
          </ButtonLink>
        }
      />

      <Section tone="canvas">
        <OccasionFilters
          years={occasionYears()}
          occasions={ordered.map((occasion) => ({
            slug: occasion.slug,
            type: occasion.type,
            year: new Date(occasion.start).getUTCFullYear(),
            isPast: new Date(occasion.end) < now,
          }))}
          labels={{
            filterByType: dict.occasions.filterByType,
            filterByYear: dict.occasions.filterByYear,
            allTypes: dict.occasions.allTypes,
            allYears: dict.occasions.allYears,
            upcoming: dict.occasions.upcoming,
            past: dict.occasions.past,
            noResults: dict.occasions.noResults,
            clearFilters: dict.occasions.clearFilters,
            typeLabels: {
              utsav: locale === "mr" ? "उत्सव" : "Utsav",
              upasana: locale === "mr" ? "उपासना" : "Upasana",
              "seva-drive": locale === "mr" ? "सेवा उपक्रम" : "Seva drive",
            },
          }}
        >
          {ordered.map((occasion) => (
            <OccasionCard key={occasion.slug} occasion={occasion} locale={locale} />
          ))}
        </OccasionFilters>
      </Section>

      <Section tone="raised">
        <Card className="p-7 sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl">Never miss a utsav date again</h2>
              <p className="mt-3 text-muted">
                Subscribe once and every occasion — including dates confirmed later in the year —
                appears in your own calendar automatically. Unconfirmed dates are published as
                tentative, so you can see at a glance which are settled.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href={`/api/calendar?locale=${locale}`}>
                <Icon.Calendar className="h-5 w-5" />
                {dict.occasions.subscribeFeed}
              </ButtonLink>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
