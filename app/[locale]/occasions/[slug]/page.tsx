import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import { CapacityBadge, OccasionCard, typeLabel } from "@/components/shared/OccasionCard";
import { Countdown, LocalTime } from "@/components/shared/LocalTime";
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/ui";
import {
  getFund,
  getOccasion,
  occasions,
  site,
  upcomingOccasions,
} from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, isLocale, locales, localePath, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs } from "@/lib/route";
import { JsonLd, occasionJsonLd } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    occasions.map((occasion) => ({ locale, slug: occasion.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const occasion = getOccasion(slug);
  if (!occasion) return {};

  return pageMetadata({
    locale,
    title: t(occasion.title, locale),
    description: t(occasion.summary, locale),
    path: `/occasions/${slug}`,
  });
}

export default async function OccasionPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const past = new Date(occasion.end) < new Date();
  const fund = occasion.fundSlug ? getFund(occasion.fundSlug) : undefined;
  const related = upcomingOccasions()
    .filter((other) => other.slug !== occasion.slug)
    .slice(0, 3);

  // The order-of-day times are wall-clock at the mandir. They are rendered in
  // the mandir's own zone rather than the reader's: if you are standing in the
  // hall you want the time printed on the noticeboard, and the top of the page
  // already gives the start in the reader's zone.
  const dayKey = occasion.start.slice(0, 10);
  const clock = (time: string) =>
    formatTime(zonedToInstant(dayKey, time, site.timezone), locale, site.timezone);

  return (
    <>
      <JsonLd data={occasionJsonLd(occasion, locale)} />

      <PageHero
        eyebrow={typeLabel(occasion.type, locale)}
        title={t(occasion.title, locale)}
        description={t(occasion.summary, locale)}
        crumbs={[
          ...crumbs(locale, ["nav.occasions", "/occasions"]),
          { name: t(occasion.title, locale), href: localePath(locale, `/occasions/${slug}`) },
        ]}
        aside={
          <Card tone="gold" className="p-6">
            <Eyebrow>{past ? dict.occasions.pastTitle : dict.home.nextOccasion}</Eyebrow>
            <p className="mt-3 flex items-start gap-2 font-semibold text-heading">
              <Icon.Calendar className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
              <LocalTime
                iso={occasion.start}
                locale={locale}
                serverZone={site.timezone}
                mode="datetime"
              />
            </p>
            {!past ? (
              <Countdown
                iso={occasion.start}
                locale={locale}
                className="mt-1 block font-semibold text-accent"
              />
            ) : null}

            <dl className="mt-4">
              <DefinitionRow term={t({ en: "Where", mr: "कुठे" }, locale)}>
                {occasion.locationName}
                <br />
                {site.address.street}, {site.address.locality}
              </DefinitionRow>
              {occasion.capacity != null ? (
                <DefinitionRow term={t({ en: "Capacity", mr: "क्षमता" }, locale)}>
                  {past ? (
                    `${occasion.rsvpCount} / ${occasion.capacity}`
                  ) : (
                    <CapacityBadge occasion={occasion} locale={locale} />
                  )}
                </DefinitionRow>
              ) : (
                <DefinitionRow term={t({ en: "Capacity", mr: "क्षमता" }, locale)}>
                  {dict.occasions.capacityUncapped}
                </DefinitionRow>
              )}
              {occasion.onlineJoin ? (
                <DefinitionRow term={t({ en: "Online", mr: "ऑनलाइन" }, locale)}>
                  <Badge tone="accent">
                    <Icon.Video className="h-3.5 w-3.5" />
                    {dict.occasions.onlineJoin}
                  </Badge>
                </DefinitionRow>
              ) : null}
            </dl>

            <div className="mt-5 flex flex-col gap-2">
              <ButtonLink
                href={`/api/calendar/${occasion.slug}?locale=${locale}`}
                variant={past ? "secondary" : "primary"}
                className="w-full"
              >
                <Icon.Calendar className="h-5 w-5" />
                {dict.occasions.addToCalendar}
              </ButtonLink>
              {!past && occasion.rsvpOpen ? (
                <ButtonLink
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                    `RSVP — ${t(occasion.title, locale)}`,
                  )}&body=${encodeURIComponent(
                    "Name:\nNumber of people:\nAny dietary notes:\n",
                  )}`}
                  variant="accent"
                  className="w-full"
                >
                  <Icon.Users className="h-5 w-5" />
                  {dict.occasions.rsvp}
                </ButtonLink>
              ) : null}
            </div>
          </Card>
        }
      />

      {/* ──────────────────────────────────────────────── date + notices ─── */}
      {!occasion.dateConfirmed || occasion.dateNote || occasion.rsvpOpensOn ? (
        <Section tone="canvas" width="narrow" className="py-8 sm:py-10">
          <div className="flex flex-col gap-4">
            {!occasion.dateConfirmed ? (
              <Alert tone="warning" title={dict.occasions.dateToBeConfirmed}>
                <p>{dict.occasions.dateToBeConfirmedBody}</p>
              </Alert>
            ) : null}
            {occasion.dateNote ? (
              <Alert tone="info">
                <p>{t(occasion.dateNote, locale)}</p>
              </Alert>
            ) : null}
            {occasion.rsvpOpensOn && !occasion.rsvpOpen && !past ? (
              <Alert tone="info">
                <p>
                  {dict.occasions.rsvpOpensOn.replace(
                    "{date}",
                    new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
                      dateStyle: "long",
                      timeZone: site.timezone,
                    }).format(new Date(occasion.rsvpOpensOn)),
                  )}
                </p>
              </Alert>
            ) : null}
            {occasion.recurrence ? (
              <Alert tone="info">
                <p>{t(occasion.recurrence, locale)}</p>
              </Alert>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* ─────────────────────────────────────────── order of the day ─── */}
      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-12">
          {occasion.schedule.length ? (
            <div className="lg:col-span-7">
              <SectionHeader
                eyebrow={typeLabel(occasion.type, locale)}
                title={dict.occasions.scheduleTitle}
                description={`${dict.common.mandirTime} · ${site.address.locality}`}
              />
              <ol className="relative flex flex-col border-l-2 border-gold-400/50 pl-6">
                {occasion.schedule.map((item) => (
                  <li key={item.time} className="relative pb-6 last:pb-0">
                    <span
                      className="absolute -left-[1.9rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gold-400 bg-canvas"
                      aria-hidden="true"
                    />
                    <p className="font-display text-xl tabular-nums text-heading">
                      {clock(item.time)}
                    </p>
                    <p className="mt-0.5 text-body">{t(item.label, locale)}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className={occasion.schedule.length ? "lg:col-span-5" : "lg:col-span-12"}>
            <SectionHeader
              eyebrow={dict.nav.about}
              title={dict.occasions.significanceTitle}
            />
            <div className="prose-sgs max-w-none">
              <p>{t(occasion.significance, locale)}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ───────────────────────────────── what to bring + seva needed ─── */}
      {occasion.whatToBring.length || occasion.volunteerNeeds.length ? (
        <Section tone="canvas">
          <div className="grid gap-10 lg:grid-cols-2">
            {occasion.whatToBring.length ? (
              <div>
                <SectionHeader
                  eyebrow={dict.nav.visit}
                  title={dict.occasions.whatToBringTitle}
                />
                <ul className="flex flex-col gap-3">
                  {occasion.whatToBring.map((item) => (
                    <Card as="li" key={item.en} className="flex gap-3 p-5">
                      <Icon.Check className="mt-0.5 h-5 w-5 shrink-0 text-tulsi-500" />
                      <span className="text-body">{t(item, locale)}</span>
                    </Card>
                  ))}
                </ul>
              </div>
            ) : null}

            {occasion.volunteerNeeds.length ? (
              <div>
                <SectionHeader
                  eyebrow={dict.nav.getInvolved}
                  title={dict.occasions.volunteerNeedsTitle}
                  action={
                    <ButtonLink
                      href={localePath(locale, "/get-involved")}
                      variant="secondary"
                      size="sm"
                    >
                      {dict.navGroups.volunteer}
                    </ButtonLink>
                  }
                />
                <ul className="flex flex-col gap-3">
                  {occasion.volunteerNeeds.map((need) => (
                    <Card as="li" key={need.en} className="flex items-center gap-3 p-5">
                      <Icon.Users className="h-5 w-5 shrink-0 text-accent" />
                      <span className="flex-1 text-body">{t(need, locale)}</span>
                      {need.slots ? (
                        <Badge tone="neutral">
                          {need.slots} {t({ en: "needed", mr: "आवश्यक" }, locale)}
                        </Badge>
                      ) : null}
                    </Card>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* ────────────────────────────────────────────────── related fund ─── */}
      {fund && !past ? (
        <Section tone="raised" width="narrow">
          <Card tone="gold" className="p-8">
            <Eyebrow>{dict.occasions.relatedFund}</Eyebrow>
            <h2 className="mt-2 text-2xl">{t(fund.title, locale)}</h2>
            <p className="mt-3 text-muted">{t(fund.description, locale)}</p>
            {fund.suggested.length ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {fund.suggested.map((option) => (
                  <li key={option.amount}>
                    <Badge tone="gold">
                      ${option.amount} — {t(option.impact, locale)}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <ButtonLink
              href={localePath(locale, `/donate?fund=${fund.slug}`)}
              className="mt-6"
            >
              <Icon.Heart className="h-5 w-5" />
              {dict.nav.donate}
            </ButtonLink>
          </Card>
        </Section>
      ) : null}

      {/* ───────────────────────────────────────────────────── related ─── */}
      {related.length ? (
        <Section tone="canvas">
          <SectionHeader
            eyebrow={dict.nav.occasions}
            title={dict.occasions.upcomingTitle}
            action={
              <ButtonLink href={localePath(locale, "/occasions")} variant="secondary">
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((other) => (
              <OccasionCard key={other.slug} occasion={other} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
