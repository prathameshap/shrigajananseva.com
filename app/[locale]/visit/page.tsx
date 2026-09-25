import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  Eyebrow,
  NumberedStep,
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
import { site, visit } from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { faqJsonLd, JsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/meta";
import { slotsForWeekday, weeklyHours } from "@/lib/schedule";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.visit.title,
    description: dict.visit.intro,
    path: "/visit",
  });
}

/** A fixed date, used only to turn "06:50" into "6.50 am" in the reader's language. */
const CLOCK_REFERENCE = "2026-01-01";

export default async function VisitPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  const clock = (time: string) =>
    formatTime(zonedToInstant(CLOCK_REFERENCE, time, site.timezone), locale, site.timezone);

  const weekdayName = (day: number) =>
    new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2024, 0, 7 + day)));

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    site.address.mapQuery,
  )}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    site.address.mapQuery,
  )}`;

  return (
    <>
      <JsonLd
        data={faqJsonLd(
          visit.faq.map((item) => ({
            question: t(item.q, locale),
            answer: t(item.a, locale),
          })),
        )}
      />

      <PageHero
        eyebrow={dict.nav.visit}
        title={dict.visit.title}
        description={dict.visit.intro}
        crumbs={crumbs(locale, ["nav.visit", "/visit"])}
        aside={
          <Card tone="gold" className="p-6">
            <Eyebrow>{dict.footer.hoursHeading}</Eyebrow>
            <dl className="mt-4 flex flex-col gap-2">
              {weeklyHours().map((entry) => (
                <div
                  key={entry.day}
                  className="flex justify-between gap-4 border-b border-gold-400/40 pb-2 last:border-0"
                >
                  <dt className="font-semibold text-heading">{weekdayName(entry.day)}</dt>
                  <dd className="text-right tabular-nums text-muted">
                    {clock(entry.opens)} – {clock(entry.closes)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">{t(site.hoursNote, locale)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ButtonLink href={directionsHref} external size="sm">
                <Icon.MapPin className="h-4 w-4" />
                {dict.visit.getDirections}
              </ButtonLink>
              <ButtonLink
                href={`tel:${site.contact.phoneE164}`}
                variant="secondary"
                size="sm"
              >
                <Icon.Phone className="h-4 w-4" />
                {site.contact.phone}
              </ButtonLink>
            </div>
          </Card>
        }
      />

      {/* ───────────────────────────────────────────── address and map ─── */}
      <Section tone="canvas" id="location">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow={dict.nav.visit} title={dict.visit.addressTitle} />
            <address className="text-lg not-italic">
              <p className="font-semibold text-heading">{site.legalName}</p>
              <p className="mt-1 text-muted">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </p>
            </address>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${site.contact.phoneE164}`}
                className="flex items-center gap-3 font-semibold text-accent hover:underline"
              >
                <Icon.Phone className="h-5 w-5" />
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-3 font-semibold text-accent hover:underline"
              >
                <Icon.Mail className="h-5 w-5" />
                {site.contact.email}
              </a>
            </div>

            {/* -------------------------------------------------- parking */}
            <div className="mt-10" id="parking">
              <h2 className="text-2xl">{dict.visit.parkingTitle}</h2>
              <p className="mt-3 text-muted">{t(visit.parking.summary, locale)}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {visit.parking.notes.map((note) => (
                  <li key={note.en} className="flex gap-2.5 text-muted">
                    <Icon.Check className="mt-1 h-4 w-4 shrink-0 text-tulsi-500" />
                    {t(note, locale)}
                  </li>
                ))}
              </ul>
              {visit.parking.overflowNote ? (
                <div className="mt-5">
                  <Alert tone="warning">
                    <p>{t(visit.parking.overflowNote, locale)}</p>
                  </Alert>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-7">
            {/*
              A plain Google Maps embed, no API key and no cookie set until the
              reader interacts with it. The full address and phone number are
              given as text alongside, so nothing on this page depends on the
              iframe loading at all.
            */}
            <div className="overflow-hidden rounded-panel border border-hairline shadow-soft">
              <iframe
                src={mapSrc}
                title={dict.visit.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-96 w-full border-0 lg:h-[34rem]"
              />
            </div>
            <ButtonLink href={directionsHref} external variant="secondary" className="mt-4">
              <Icon.External className="h-5 w-5" />
              {dict.visit.openInMaps}
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ──────────────────────────────────────────── the week at a glance ─── */}
      <Section tone="tint" id="weekly">
        <SectionHeader
          eyebrow={dict.nav.dailySeva}
          title={dict.visit.weeklyTitle}
          description={dict.dailySeva.weeklyNote}
          action={
            <ButtonLink href={localePath(locale, "/daily-seva")} variant="secondary">
              {dict.dailySeva.scheduleTitle}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[4, 6, 0].map((day) => {
            const slots = slotsForWeekday(day);
            const hours = weeklyHours().find((entry) => entry.day === day);
            return (
              <Card key={day} className="flex flex-col p-6">
                <h3 className="text-xl">{weekdayName(day)}</h3>
                {hours ? (
                  <p className="mt-1 text-sm font-semibold text-accent tabular-nums">
                    {clock(hours.opens)} – {clock(hours.closes)}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted">{dict.visit.closedDay}</p>
                )}
                <ol className="mt-4 flex flex-1 flex-col">
                  {slots.map((slot) => (
                    <li
                      key={slot.slug}
                      className="flex items-baseline gap-3 border-b border-hairline py-2 last:border-0"
                    >
                      <span className="w-20 shrink-0 text-sm font-semibold tabular-nums text-heading">
                        {clock(slot.time)}
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span>{t(slot.title, locale)}</span>
                        {slot.mode !== "in-person" ? (
                          <Badge tone="accent" className="px-2 py-0 text-xs">
                            <Icon.Video className="h-3 w-3" />
                            {dict.dailySeva.online}
                          </Badge>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* ───────────────────────────────────────────────── first visit ─── */}
      <Section tone="canvas" id="first-visit">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.nav.visit}
              title={dict.visit.firstVisitTitle}
              description={t(visit.firstVisit.intro, locale)}
            />
            <Card tone="gold" className="p-6">
              <h3 className="text-lg">{dict.visit.offeringTitle}</h3>
              <p className="mt-2 text-muted">{t(visit.firstVisit.offering, locale)}</p>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <ol className="flex flex-col gap-4">
              {visit.firstVisit.steps.map((step, index) => (
                <NumberedStep key={step.title.en} index={index + 1} title={t(step.title, locale)}>
                  {t(step.body, locale)}
                </NumberedStep>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ──────────────────────────────────────────────────── etiquette ─── */}
      <Section tone="raised" id="etiquette">
        <SectionHeader
          eyebrow={dict.nav.visit}
          title={dict.visit.etiquetteTitle}
          description={dict.visit.etiquetteIntro}
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {visit.firstVisit.etiquette.map((item) => (
            <Card as="li" key={item.en} className="flex gap-3 p-5">
              <Icon.Lotus className="mt-0.5 h-5 w-5 shrink-0 text-kumkum-500" />
              <span className="text-body">{t(item, locale)}</span>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ────────────────────────────────────────────────── accessibility ─── */}
      <Section tone="tint" id="accessibility">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.visit.accessibility}
              title={dict.visit.accessibilityTitle}
              description={t(visit.accessibility.summary, locale)}
            />
            <Alert tone="info">
              <p>{t(visit.accessibility.contactNote, locale)}</p>
            </Alert>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={`tel:${site.contact.phoneE164}`}>
                <Icon.Phone className="h-5 w-5" />
                {dict.visit.callAhead}
              </ButtonLink>
              <ButtonLink
                href={localePath(locale, "/legal/accessibility")}
                variant="secondary"
              >
                {dict.legal.accessibility}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="flex flex-col gap-2.5">
              {visit.accessibility.features.map((feature) => (
                <li
                  key={feature.en}
                  className="flex items-start gap-3 rounded-card border border-hairline bg-surface p-4"
                >
                  {feature.available ? (
                    <Icon.Check className="mt-0.5 h-5 w-5 shrink-0 text-tulsi-500" />
                  ) : (
                    <Icon.Close className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
                  )}
                  <span className={feature.available ? "text-body" : "text-muted"}>
                    {t(feature, locale)}
                    {!feature.available ? (
                      <span className="ml-2 text-sm italic">
                        ({t({ en: "not yet", mr: "अद्याप नाही" }, locale)})
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ──────────────────────────────────────────────────────── faq ─── */}
      <Section tone="canvas" width="narrow" id="faq">
        <SectionHeader eyebrow={dict.navGroups.contact} title={dict.visit.faqTitle} />
        <div className="flex flex-col gap-3">
          {visit.faq.map((item) => (
            <details
              key={item.q.en}
              className="group rounded-card border border-hairline bg-surface p-5 open:shadow-soft"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 font-semibold text-heading marker:content-['']">
                {t(item.q, locale)}
                <Icon.ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-muted">{t(item.a, locale)}</p>
            </details>
          ))}
        </div>

        {visit.impact ? null : (
          <div className="mt-10">
            <Placeholder
              title={t(
                { en: "Still have a question?", mr: "आणखी प्रश्न आहे का?" },
                locale,
              )}
              contact={site.contact.email}
            >
              <p>
                Anything not answered here, ask. Nobody minds a question about how any of it
                works, and it is better than not coming.
              </p>
            </Placeholder>
          </div>
        )}
      </Section>
    </>
  );
}
