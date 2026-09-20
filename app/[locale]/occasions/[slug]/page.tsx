import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LocalTime, Countdown, TimeZoneNote } from "@/components/shared/LocalTime";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  GoldRule,
  Placeholder,
  Section,
} from "@/components/ui";
import { JsonLd, occasionJsonLd } from "@/lib/seo";
import {
  capacityState,
  getFund,
  getOccasion,
  occasions,
  placesLeft,
  site,
} from "@/lib/content";
import { getDictionary, locales, localePath, t, type Locale } from "@/lib/i18n";
import { crumbs, resolveLocale } from "@/lib/route";

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    occasions.map((occasion) => ({ locale, slug: occasion.slug })),
  );
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) return {};
  const locale = (locales as readonly string[]).includes(raw) ? (raw as Locale) : "en";

  return {
    title: t(occasion.title, locale),
    description: t(occasion.summary, locale),
    alternates: { canonical: `/${locale}/occasions/${slug}` },
    openGraph: {
      type: "article",
      title: t(occasion.title, locale),
      description: t(occasion.summary, locale),
    },
  };
}

export default async function OccasionDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await resolveLocale(
    params as unknown as Promise<{ locale: string }>,
  );
  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const dict = getDictionary(locale);
  const isPast = new Date(occasion.end) < new Date();
  const state = capacityState(occasion);
  const left = placesLeft(occasion);
  const fund = occasion.fundSlug ? getFund(occasion.fundSlug) : undefined;

  const capacityBadge = {
    open: { tone: "success" as const, label: dict.occasions.capacityOpen },
    filling: { tone: "warning" as const, label: dict.occasions.capacityFilling },
    waitlist: { tone: "warning" as const, label: dict.occasions.capacityWaitlist },
    full: { tone: "neutral" as const, label: dict.occasions.capacityFull },
    uncapped: null,
  }[state];

  return (
    <>
      <JsonLd data={occasionJsonLd(occasion, locale)} />

      <PageHeader
        eyebrow={
          occasion.type === "utsav"
            ? locale === "mr"
              ? "उत्सव"
              : "Utsav"
            : occasion.type === "upasana"
              ? locale === "mr"
                ? "उपासना"
                : "Upasana"
              : locale === "mr"
                ? "सेवा उपक्रम"
                : "Seva drive"
        }
        title={t(occasion.title, locale)}
        description={t(occasion.summary, locale)}
        crumbs={crumbs(
          locale,
          ["nav.occasions", "/occasions"],
          [t(occasion.title, locale), `/occasions/${occasion.slug}`],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <>
            <ButtonLink href={`/api/calendar/${occasion.slug}?locale=${locale}`}>
              <Icon.Calendar className="h-5 w-5" />
              {dict.occasions.addToCalendar}
            </ButtonLink>
            {!isPast && occasion.rsvpOpen ? (
              <ButtonLink
                href={localePath(locale, `/portal/rsvp/${occasion.slug}`)}
                variant="secondary"
              >
                {dict.occasions.rsvp}
              </ButtonLink>
            ) : null}
          </>
        }
      />

      <Container>
        <div className="grid gap-12 py-14 lg:grid-cols-12">
          {/* Main column */}
          <div className="lg:col-span-8">
            {/* Schedule */}
            <section>
              <h2 className="text-2xl">{dict.occasions.schedule}</h2>
              <GoldRule className="mt-3 mb-6 max-w-32" />

              {occasion.schedule.length ? (
                <ol className="flex flex-col">
                  {occasion.schedule.map((item) => (
                    <li
                      key={`${item.time}-${item.label.en}`}
                      className="flex gap-5 border-b border-hairline py-4 last:border-0"
                    >
                      <span className="w-20 shrink-0 font-semibold tabular-nums text-accent">
                        {displayHour(item.time)}
                      </span>
                      <span className="text-body">{t(item.label, locale)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted">
                  The detailed programme for this occasion has not been published yet.
                </p>
              )}

              <TimeZoneNote
                locale={locale}
                serverZone={site.timezone}
                template={`Programme times are local to the mandir. ${dict.common.timezoneNote}`}
                className="mt-5 text-sm text-muted"
              />
            </section>

            {/* Significance */}
            <section className="mt-12">
              <h2 className="text-2xl">{dict.occasions.significance}</h2>
              <GoldRule className="mt-3 mb-6 max-w-32" />
              <p className="text-lg leading-relaxed text-body">
                {t(occasion.significance, locale)}
              </p>
            </section>

            {/* What to bring */}
            {occasion.whatToBring.length ? (
              <section className="mt-12">
                <h2 className="text-2xl">{dict.occasions.whatToBring}</h2>
                <GoldRule className="mt-3 mb-6 max-w-32" />
                <ul className="flex flex-col gap-3">
                  {occasion.whatToBring.map((item) => (
                    <li key={item.en} className="flex gap-3 text-body">
                      <Icon.Check className="mt-1.5 h-4 w-4 shrink-0 text-tulsi-500" />
                      {t(item, locale)}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Volunteers */}
            {occasion.volunteerNeeds.length && !isPast ? (
              <section className="mt-12">
                <h2 className="text-2xl">{dict.occasions.volunteerNeeds}</h2>
                <GoldRule className="mt-3 mb-6 max-w-32" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {occasion.volunteerNeeds.map((need) => (
                    <Card key={need.en} className="flex items-start gap-3 p-5">
                      <Icon.Users className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                      <span className="text-body">{t(need, locale)}</span>
                    </Card>
                  ))}
                </div>
                <ButtonLink
                  href={localePath(locale, "/get-involved")}
                  variant="secondary"
                  className="mt-6"
                >
                  {dict.getInvolved.title}
                  <Icon.ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-5 lg:sticky lg:top-32">
              <Card className="p-6">
                <div className="flex flex-wrap gap-2">
                  {isPast ? (
                    <Badge tone="neutral">{dict.occasions.past}</Badge>
                  ) : (
                    <Badge tone="accent">{dict.occasions.upcoming}</Badge>
                  )}
                  {occasion.onlineJoin ? (
                    <Badge tone="neutral">
                      <Icon.Video className="h-3.5 w-3.5" />
                      {dict.dailySeva.online}
                    </Badge>
                  ) : null}
                  {capacityBadge && !isPast ? (
                    <Badge tone={capacityBadge.tone}>{capacityBadge.label}</Badge>
                  ) : null}
                </div>

                <dl className="mt-5 flex flex-col gap-4">
                  <div>
                    <dt className="text-sm font-semibold tracking-wide text-muted uppercase">
                      {dict.common.today === "Today" ? "Date" : "दिनांक"}
                    </dt>
                    <dd className="mt-1 font-semibold text-heading">
                      <LocalTime
                        iso={occasion.start}
                        locale={locale}
                        serverZone={site.timezone}
                        mode="datetime"
                      />
                      {!isPast ? (
                        <Countdown
                          iso={occasion.start}
                          locale={locale}
                          className="mt-0.5 block font-normal text-accent"
                        />
                      ) : null}
                    </dd>
                  </div>

                  {!occasion.dateConfirmed ? (
                    <div className="rounded-xl bg-accent-soft p-3 text-sm text-accent">
                      <strong className="block font-semibold">Date not yet confirmed</strong>
                      {occasion.dateNote
                        ? t(occasion.dateNote, locale)
                        : "The final date is confirmed closer to the day. Check before travelling."}
                    </div>
                  ) : null}

                  {occasion.recurrence ? (
                    <div>
                      <dt className="text-sm font-semibold tracking-wide text-muted uppercase">
                        Repeats
                      </dt>
                      <dd className="mt-1 text-body">{t(occasion.recurrence, locale)}</dd>
                    </div>
                  ) : null}

                  <div>
                    <dt className="text-sm font-semibold tracking-wide text-muted uppercase">
                      {dict.visit.address}
                    </dt>
                    <dd className="mt-1 text-body">
                      {occasion.locationName}
                      <br />
                      <span className="text-muted">
                        {site.address.street}, {site.address.locality}
                      </span>
                    </dd>
                  </div>

                  {occasion.capacity != null && !isPast ? (
                    <div>
                      <dt className="text-sm font-semibold tracking-wide text-muted uppercase">
                        Capacity
                      </dt>
                      <dd className="mt-1 text-body">
                        {left} of {occasion.capacity} places available
                        <div
                          className="mt-2 h-2 overflow-hidden rounded-full bg-surface-raised"
                          role="progressbar"
                          aria-valuenow={occasion.rsvpCount}
                          aria-valuemin={0}
                          aria-valuemax={occasion.capacity}
                          aria-label="Places taken"
                        >
                          <div
                            className="h-full rounded-full bg-marigold-400"
                            style={{
                              width: `${Math.min(100, (occasion.rsvpCount / occasion.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-6 flex flex-col gap-3">
                  {!isPast && occasion.rsvpOpen ? (
                    <>
                      <ButtonLink
                        href={localePath(locale, `/portal/rsvp/${occasion.slug}`)}
                        className="w-full"
                      >
                        {state === "full" || state === "waitlist"
                          ? "Join the waitlist"
                          : dict.occasions.rsvp}
                      </ButtonLink>
                      <p className="text-center text-sm text-muted">{dict.occasions.rsvpNote}</p>
                    </>
                  ) : null}

                  {!isPast && !occasion.rsvpOpen ? (
                    <p className="rounded-xl bg-surface-raised p-4 text-center text-sm text-muted">
                      {occasion.rsvpOpensOn
                        ? `Registration opens ${new Intl.DateTimeFormat(
                            locale === "mr" ? "mr-IN" : "en-US",
                            { dateStyle: "long", timeZone: site.timezone },
                          ).format(new Date(occasion.rsvpOpensOn))}.`
                        : dict.occasions.registrationClosed}
                    </p>
                  ) : null}

                  <ButtonLink
                    href={`/api/calendar/${occasion.slug}?locale=${locale}`}
                    variant="secondary"
                    className="w-full"
                  >
                    <Icon.Calendar className="h-4 w-4" />
                    {dict.occasions.addToCalendar}
                  </ButtonLink>
                </div>
              </Card>

              {fund ? (
                <Card className="bg-surface-raised p-6">
                  <h2 className="text-lg">Support this seva</h2>
                  <p className="mt-2 text-muted">{t(fund.description, locale)}</p>
                  <ButtonLink
                    href={localePath(locale, `/donate?fund=${fund.slug}`)}
                    className="mt-5 w-full"
                  >
                    <Icon.Heart className="h-4 w-4" />
                    {dict.nav.donate}
                  </ButtonLink>
                </Card>
              ) : null}

              {isPast ? (
                <Placeholder title="Photographs from this occasion">
                  <p>
                    A consent-aware gallery is planned for a later phase. Recordings of past
                    utsav are on our YouTube channel in the meantime.
                  </p>
                </Placeholder>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

function displayHour(value: string) {
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute} ${suffix}`;
}
