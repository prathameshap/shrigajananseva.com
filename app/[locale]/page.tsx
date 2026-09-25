import Link from "next/link";

import { Icon } from "@/components/icons";
import { MandalaField, ShrineNiche, ToranaArch } from "@/components/decor";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  GoldRule,
  NumberedStep,
  Section,
  SectionHeader,
  SpinedCard,
} from "@/components/ui";
import { TodayPanel } from "@/components/home/TodayPanel";
import { ConnectStrip } from "@/components/shared/ConnectStrip";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { Countdown, LocalTime } from "@/components/shared/LocalTime";
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
import { getDictionary, localePath, t } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/route";

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  const next = nextOccasion();
  const upcoming = upcomingOccasions(new Date(), 3);
  const featured = featuredLibrary().slice(0, 3);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ hero ══ */}
      {/*
        An indigo band with a gold-lit shrine niche drawn in SVG.

        The previous hero reached for two photographs that were never in the
        repository, so it rendered as an empty dark rectangle with text on it —
        which is most of what made the page read as dull. Vector art costs
        nothing on a cellular connection and does not wait on the trustees.
      */}
      <section className="relative isolate overflow-hidden bg-night-900 text-sandal-100 night-wash">
        <MandalaField className="-top-40 -left-32 h-[34rem] w-[34rem] text-gold-400 opacity-20" />
        <MandalaField className="-right-40 -bottom-56 h-[38rem] w-[38rem] text-peacock-300 opacity-15" />

        <Container width="wide">
          <div className="grid items-center gap-12 py-14 sm:py-18 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <Eyebrow tone="onbrand" className="mb-4">
                {dict.home.heroEyebrow}
              </Eyebrow>

              <h1 className="text-4xl leading-[1.1] text-sandal-50 sm:text-5xl lg:text-6xl">
                {t(site.displayName, locale)}
              </h1>

              <p className="mt-4 font-deva text-2xl text-marigold-300 sm:text-3xl">
                {dailySeva.namJaap.mantra}
              </p>

              <GoldRule className="mt-7 max-w-40" />

              <p className="mt-7 max-w-xl text-xl text-sandal-200">{dict.home.heroSubtitle}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href={localePath(locale, "/visit")} size="lg">
                  <Icon.MapPin className="h-5 w-5" />
                  {dict.home.heroPrimaryCta}
                </ButtonLink>
                <ButtonLink
                  href={localePath(locale, "/daily-seva")}
                  size="lg"
                  variant="outline"
                >
                  <Icon.Clock className="h-5 w-5" />
                  {dict.home.heroSecondaryCta}
                </ButtonLink>
              </div>

              {/* The three facts people actually arrive looking for. */}
              <dl className="mt-10 grid gap-4 border-t border-night-600 pt-7 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-marigold-300 uppercase">
                    {dict.visit.addressTitle}
                  </dt>
                  <dd className="mt-1 text-sm text-sandal-200">
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-marigold-300 uppercase">
                    {dict.footer.hoursHeading}
                  </dt>
                  <dd className="mt-1 text-sm text-sandal-200">
                    {t(
                      {
                        en: "Thu 6.45am – 9pm",
                        mr: "गुरु ६.४५ – रात्री ९",
                      },
                      locale,
                    )}
                    <br />
                    {t({ en: "Sat & Sun 10am – 6pm", mr: "शनि व रवि १० – ६" }, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-marigold-300 uppercase">
                    {dict.header.callUs}
                  </dt>
                  <dd className="mt-1 text-sm">
                    <a
                      href={`tel:${site.contact.phoneE164}`}
                      className="text-sandal-200 transition-colors hover:text-marigold-300"
                    >
                      {site.contact.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm">
                <ShrineNiche>
                  <div>
                    <p className="font-deva text-2xl leading-snug text-marigold-200 sm:text-3xl">
                      {dailySeva.namJaap.mantra}
                    </p>
                    <p className="mt-3 font-display text-base text-sandal-300 italic">
                      {dailySeva.namJaap.transliteration}
                    </p>
                  </div>
                </ShrineNiche>
                <p className="mt-5 text-center font-display text-lg text-marigold-300 italic">
                  {t(
                    {
                      en: "Shri Gajanan Maharaj, Shegaon",
                      mr: "श्री गजानन महाराज, शेगाव",
                    },
                    locale,
                  )}
                </p>
              </div>
            </div>
          </div>
        </Container>

        <ToranaArch className="h-14 opacity-90" />
      </section>

      {/* ══════════════════════════════════════════ next occasion + today ══ */}
      <Section tone="canvas" className="py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-12">
          {next ? (
            <div className="lg:col-span-5">
              <Card tone="gold" className="flex h-full flex-col p-7 shadow-lift">
                <Eyebrow>{dict.home.nextOccasion}</Eyebrow>
                <h2 className="mt-2 text-2xl">{t(next.title, locale)}</h2>

                <p className="mt-4 flex flex-wrap items-center gap-2 font-semibold text-heading">
                  <Icon.Calendar className="h-5 w-5 text-gold-600" />
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
                  className="mt-1 block font-semibold text-accent"
                />

                {!next.dateConfirmed ? (
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-marigold-800">
                    <Icon.Info className="mt-0.5 h-4 w-4 shrink-0" />
                    {dict.occasions.dateToBeConfirmedBody}
                  </p>
                ) : null}

                <p className="mt-4 flex-1 text-muted">{t(next.summary, locale)}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href={localePath(locale, `/occasions/${next.slug}`)}>
                    {next.rsvpOpen ? dict.occasions.rsvp : dict.common.learnMore}
                  </ButtonLink>
                  <ButtonLink href={localePath(locale, "/occasions")} variant="ghost">
                    {dict.common.viewAll}
                  </ButtonLink>
                </div>
              </Card>
            </div>
          ) : null}

          <div className={next ? "lg:col-span-7" : "lg:col-span-12"}>
            <TodayPanel
              locale={locale}
              mandirTimezone={site.timezone}
              zoomUrl={site.zoom.joinUrl}
              scheduleHref={localePath(locale, "/daily-seva")}
              slots={dailySeva.schedule.map((slot) => ({
                slug: slot.slug,
                time: slot.time,
                durationMinutes: slot.durationMinutes,
                days: slot.days,
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
                both: dict.dailySeva.both,
                timezoneNote: dict.common.timezoneNote,
                viewFullSchedule: dict.dailySeva.scheduleTitle,
                zoomUnavailable: t(
                  {
                    en: "Zoom link available on request — email us",
                    mr: "झूम दुवा विनंतीवरून — आम्हाला ईमेल करा",
                  },
                  locale,
                ),
                noSlotsLeft: dict.dailySeva.noSlotsLeft,
              }}
            />
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════ upcoming ══ */}
      <Section tone="tint">
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
        {upcoming.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {upcoming.map((occasion) => (
              <OccasionCard key={occasion.slug} occasion={occasion} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted">{dict.occasions.noneUpcoming}</p>
        )}

        <Card className="mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-muted">
            <Icon.Calendar className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            {dict.occasions.subscribeCalendarBody}
          </p>
          <ButtonLink
            href={`/api/calendar?locale=${locale}`}
            variant="secondary"
            className="shrink-0"
          >
            <Icon.Download className="h-5 w-5" />
            {dict.occasions.subscribeCalendar}
          </ButtonLink>
        </Card>
      </Section>

      {/* ════════════════════════════════════════════════════ first visit ══ */}
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
              <ButtonLink
                href={localePath(locale, "/visit#accessibility")}
                variant="secondary"
              >
                {dict.visit.accessibility}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="flex flex-col gap-4">
              {visit.firstVisit.steps.slice(0, 4).map((step, index) => (
                <NumberedStep key={step.title.en} index={index + 1} title={t(step.title, locale)}>
                  {t(step.body, locale)}
                </NumberedStep>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ═════════════════════════════════════════════════════════ jaap ══ */}
      <Section tone="brand" className="relative isolate overflow-hidden">
        <MandalaField className="top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 text-marigold-300 opacity-20" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Icon.Sparkle className="mx-auto h-8 w-8 text-marigold-300" />
          <Eyebrow tone="onbrand" className="mt-4">
            {dict.home.mantraTitle}
          </Eyebrow>
          <h2 className="mt-4 font-deva text-4xl text-sandal-50 sm:text-5xl">
            {dailySeva.namJaap.mantra}
          </h2>
          <p className="mt-3 font-display text-xl text-marigold-300 italic">
            {dailySeva.namJaap.transliteration}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-sandal-200">
            {t(dailySeva.namJaap.guidance, locale)}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={localePath(locale, "/daily-seva/nam-jaap")} variant="onbrand">
              {dict.dailySeva.jaapTitle}
            </ButtonLink>
            <ButtonLink href={localePath(locale, "/library/audio")} variant="outline">
              <Icon.Audio className="h-5 w-5" />
              {dict.navGroups.audio}
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════ give ══ */}
      <Section tone="raised">
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
            <SpinedCard key={fund.slug} spine="saffron" interactive>
              <Link
                href={localePath(locale, `/donate?fund=${fund.slug}`)}
                className="block p-6"
              >
                <h3 className="text-lg">{t(fund.title, locale)}</h3>
                <p className="mt-2 text-sm text-muted">{t(fund.description, locale)}</p>
                {fund.suggested[0] ? (
                  <p className="mt-4 text-sm font-semibold text-accent">
                    ${fund.suggested[0].amount} — {t(fund.suggested[0].impact, locale)}
                  </p>
                ) : null}
              </Link>
            </SpinedCard>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ library ══ */}
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

      {/* ════════════════════════════════════════════════════════ connect ══ */}
      <Section tone="tint">
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
                <NewsletterForm
                  fallbackEmail={site.contact.newsletterEmail}
                  labels={{
                    emailLabel: dict.connect.newsletterEmailLabel,
                    nameLabel: dict.connect.newsletterNameLabel,
                    consent: dict.connect.newsletterConsent,
                    consentNote: dict.connect.newsletterConsentNote,
                    cta: dict.connect.newsletterCta,
                    sending: dict.contact.sending,
                    thanksTitle: dict.connect.newsletterThanksTitle,
                    thanksBody: dict.connect.newsletterThanksBody,
                    required: dict.forms.required,
                    invalidEmail: dict.forms.invalidEmail,
                    genericError: dict.forms.genericError,
                    honeypotLabel: dict.forms.honeypotLabel,
                    optional: dict.common.optional,
                    mailtoFallback: dict.contact.mailtoFallback,
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
