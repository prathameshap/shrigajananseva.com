import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  GoldRule,
  Placeholder,
  Section,
  SectionHeader,
  Stat,
  Torana,
} from "@/components/ui";
import { TodayPanel } from "@/components/home/TodayPanel";
import { ConnectStrip } from "@/components/shared/ConnectStrip";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { LocalTime, Countdown } from "@/components/shared/LocalTime";
import { OccasionCard } from "@/components/shared/OccasionCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

import {
  dailySeva,
  featuredLibrary,
  funds,
  nextOccasion,
  site,
  upcomingOccasions,
  visit,
} from "@/lib/content";
import { getDictionary, isLocale, localePath, t, type Locale } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const next = nextOccasion();
  const upcoming = upcomingOccasions(new Date(), 3);
  const featured = featuredLibrary().slice(0, 3);
  const impact = visit.impact;
  const hasImpactNumbers = impact?.stats.some((stat) => stat.value != null);

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      {/*
        A full-bleed utsav photograph behind a dark scrim, with Maharaj's
        portrait alongside. The previous cream-on-cream hero carried no imagery
        at all, which is what made the page read as flat.
      */}
      <section className="relative isolate overflow-hidden bg-night-900 text-sandal-100">
        <Image
          src="/images/utsav-shrine.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-40"
        />
        {/* Scrim: keeps text contrast well clear of AA over a busy photograph. */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-night-900 via-night-900/95 to-night-900/70"
          aria-hidden="true"
        />

        <Container width="wide">
          <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
            <div className="lg:col-span-7">
              <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-marigold-300 uppercase">
                {dict.home.heroEyebrow}
              </p>

              <h1 className="font-deva text-5xl leading-tight text-sandal-50 sm:text-6xl lg:text-7xl">
                {dailySeva.namJaap.mantra}
              </h1>
              <p className="mt-3 font-display text-2xl text-marigold-300 italic">
                {dailySeva.namJaap.transliteration}
              </p>

              <GoldRule className="mt-7 max-w-40" />

              <p className="mt-7 max-w-xl text-xl text-sandal-200">{dict.home.heroSubtitle}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href={localePath(locale, "/visit")} size="lg">
                  {dict.home.heroPrimaryCta}
                  <Icon.ArrowRight className="h-5 w-5" />
                </ButtonLink>
                <ButtonLink
                  href={localePath(locale, "/daily-seva")}
                  size="lg"
                  variant="secondary"
                  className="border-sandal-400/40 bg-transparent text-sandal-50 hover:border-marigold-300 hover:bg-night-700 hover:text-sandal-50"
                >
                  {dict.home.heroSecondaryCta}
                </ButtonLink>
              </div>
            </div>

            {/* Maharaj */}
            <div className="lg:col-span-5">
              <figure className="relative mx-auto max-w-sm">
                <div className="overflow-hidden rounded-card border-4 border-gold-400 shadow-lift">
                  <Image
                    src="/images/shri-gajanan-maharaj.jpg"
                    alt="Shri Gajanan Maharaj of Shegaon"
                    width={701}
                    height={1000}
                    priority
                    sizes="(max-width: 1024px) 24rem, 24rem"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-4 text-center font-display text-lg text-marigold-300 italic">
                  Shri Gajanan Maharaj, Shegaon
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ next occasion */}
      <Section tone="canvas" className="py-12 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {next ? (
                <Card className="h-full p-7 shadow-lift">
                  <Torana className="mb-5 -mt-1" />
                  <p className="text-sm font-bold tracking-[0.16em] text-accent uppercase">
                    {dict.home.nextOccasion}
                  </p>
                  <h2 className="mt-2 text-2xl">{t(next.title, locale)}</h2>

                  <p className="mt-3 flex flex-wrap items-center gap-2 font-semibold text-heading">
                    <Icon.Calendar className="h-5 w-5 text-gold-500" />
                    <LocalTime
                      iso={next.start}
                      locale={locale}
                      serverZone={site.timezone}
                      mode="datetime"
                    />
                  </p>
                  <Countdown
                    iso={next.start}
                    locale={locale}
                    className="mt-1 block text-accent"
                  />
                  {!next.dateConfirmed ? (
                    <p className="mt-2 text-sm text-muted italic">
                      Date to be confirmed — see the occasion page for details.
                    </p>
                  ) : null}

                  <p className="mt-4 text-muted">{t(next.summary, locale)}</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={localePath(locale, `/occasions/${next.slug}`)}>
                      {next.rsvpOpen ? dict.occasions.rsvp : dict.common.learnMore}
                    </ButtonLink>
                    <ButtonLink
                      href={localePath(locale, "/occasions")}
                      variant="ghost"
                    >
                      {dict.common.viewAll}
                    </ButtonLink>
                  </div>
                </Card>
              ) : null}
          </div>

          {/* Today / live now, beside the next occasion rather than below it */}
          <div className="lg:col-span-7">
            <TodayPanel
          locale={locale}
          mandirTimezone={site.timezone}
          zoomUrl={site.zoom.joinUrl}
          scheduleHref={localePath(locale, "/daily-seva")}
          slots={dailySeva.schedule.map((slot) => ({
            slug: slot.slug,
            time: slot.time,
            durationMinutes: slot.durationMinutes,
            title: t(slot.title, locale),
            mode: slot.mode,
          }))}
          labels={{
            todayTitle: dict.home.todaySchedule,
            liveNow: dict.home.liveNow,
            liveNowBody: dict.home.liveNowBody,
            joinZoom: dict.dailySeva.joinZoom,
            nextUp: dict.dailySeva.nextUp,
            inProgress: dict.dailySeva.inProgress,
            concluded: dict.dailySeva.concluded,
            online: dict.dailySeva.online,
            inPerson: dict.dailySeva.inPerson,
            timezoneNote: dict.common.timezoneNote,
            viewFullSchedule: dict.dailySeva.scheduleTitle,
              zoomUnavailable: "Zoom link available on request",
              }}
            />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ upcoming */}
      <Section tone="raised">
        <SectionHeader
          eyebrow={dict.nav.occasions}
          title={dict.home.upcomingTitle}
          description={dict.home.upcomingBody}
          action={
            <ButtonLink href={localePath(locale, "/occasions")} variant="secondary">
              {dict.common.viewAll}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {upcoming.map((occasion) => (
            <OccasionCard key={occasion.slug} occasion={occasion} locale={locale} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------- first visit */}
      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.nav.visit}
              title={dict.home.welcomeTitle}
              description={dict.home.welcomeBody}
            />
            <p className="-mt-4 text-muted">{t(visit.firstVisit.intro, locale)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={localePath(locale, "/visit")}>
                {dict.visit.firstVisit}
              </ButtonLink>
              <ButtonLink href={localePath(locale, "/visit#accessibility")} variant="secondary">
                {dict.visit.accessibility}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="flex flex-col gap-4">
              {visit.firstVisit.steps.slice(0, 4).map((step, index) => (
                <li key={step.title.en}>
                  <Card className="flex gap-5 p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-saffron-600 font-display text-lg text-sandal-50">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-semibold text-heading">
                        {t(step.title, locale)}
                      </span>
                      <span className="mt-1 block text-muted">{t(step.body, locale)}</span>
                    </span>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ nam jaap */}
      <Section tone="brand">
        <div className="mx-auto max-w-3xl text-center">
          <Icon.Sparkle className="mx-auto h-8 w-8 text-marigold-300" />
          <h2 className="mt-5 font-deva text-4xl text-sandal-50 sm:text-5xl">
            {dailySeva.namJaap.mantra}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sandal-200">
            {t(dailySeva.namJaap.guidance, locale)}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={localePath(locale, "/daily-seva/nam-jaap")} variant="onbrand">
              {dict.dailySeva.jaapTitle}
            </ButtonLink>
            <ButtonLink
              href={localePath(locale, "/library/audio")}
              variant="secondary"
              className="border-sandal-400/40 bg-transparent text-sandal-100 hover:bg-night-700"
            >
              {dict.navGroups.audio}
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- donate */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.nav.donate}
          title={dict.home.donateTitle}
          description={dict.home.donateBody}
          action={
            <ButtonLink href={localePath(locale, "/donate")} size="lg">
              <Icon.Heart className="h-5 w-5" />
              {dict.nav.donate}
            </ButtonLink>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {funds.slice(0, 4).map((fund) => (
            <Card key={fund.slug} interactive className="p-6">
              <Link href={localePath(locale, `/donate?fund=${fund.slug}`)} className="block">
                <h3 className="text-lg">{t(fund.title, locale)}</h3>
                <p className="mt-2 text-sm text-muted">{t(fund.description, locale)}</p>
                {fund.suggested[0] ? (
                  <p className="mt-4 text-sm font-semibold text-accent">
                    ${fund.suggested[0].amount} — {t(fund.suggested[0].impact, locale)}
                  </p>
                ) : null}
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------- impact */}
      {impact ? (
        <Section tone="raised">
          <SectionHeader
            align="center"
            eyebrow={t(impact.periodLabel, locale)}
            title={dict.home.impactTitle}
          />
          {hasImpactNumbers ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {impact.stats
                .filter((stat) => stat.value != null)
                .map((stat) => (
                  <Stat
                    key={stat.label.en}
                    value={stat.value?.toLocaleString(locale === "mr" ? "mr-IN" : "en-US")}
                    label={t(stat.label, locale)}
                    note={stat.verified ? undefined : "approximate"}
                  />
                ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <Placeholder
                title="Seva figures are being compiled"
                contact={site.contact.charityEmail}
              >
                <p>
                  Meals served, blankets distributed and volunteer hours for the last twelve
                  months will be published here once the trustees have finalised them. Enter the
                  numbers in{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                    content/data/visit.json
                  </code>{" "}
                  under <code className="rounded bg-surface px-1.5 py-0.5 text-sm">impact</code>.
                </p>
              </Placeholder>
            </div>
          )}
        </Section>
      ) : null}

      {/* ------------------------------------------------- library */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.nav.library}
          title={dict.library.title}
          description={dict.library.intro}
          action={
            <ButtonLink href={localePath(locale, "/library")} variant="secondary">
              {dict.common.viewAll}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((item) => (
            <LibraryCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------- connect */}
      <Section tone="raised">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow={dict.nav.connect}
              title={dict.home.connectTitle}
              description={dict.home.connectBody}
            />
            <ConnectStrip locale={locale} />
          </div>

          <div className="lg:col-span-5">
            <Card className="p-7">
              <Badge tone="accent">
                <Icon.Mail className="h-3.5 w-3.5" />
                {dict.navGroups.newsletter}
              </Badge>
              <h2 className="mt-4 text-2xl">{dict.connect.newsletterTitle}</h2>
              <p className="mt-2 text-muted">{dict.connect.newsletterBody}</p>
              <div className="mt-6">
                <NewsletterForm locale={locale} />
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
