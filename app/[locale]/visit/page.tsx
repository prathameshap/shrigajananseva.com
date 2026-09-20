import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { MapEmbed } from "@/components/shared/MapEmbed";
import {
  Badge,
  ButtonLink,
  Card,
  GoldRule,
  Section,
  SectionHeader,
} from "@/components/ui";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { dailySeva, site, visit } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { isOpenToday, weeklyHours } from "@/lib/schedule";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.visit.title,
    description: `Darshan hours, directions, parking and accessibility for Shri Gajanan Seva at ${site.address.street}, ${site.address.locality}. Open Thursday, Saturday and Sunday.`,
  };
}

export default async function VisitPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const openNow = isOpenToday();

  const dayNames = [
    dict.days.sunday,
    dict.days.monday,
    dict.days.tuesday,
    dict.days.wednesday,
    dict.days.thursday,
    dict.days.friday,
    dict.days.saturday,
  ];

  return (
    <>
      <JsonLd
        data={faqJsonLd(
          visit.faq.map((entry) => ({
            question: t(entry.q, locale),
            answer: t(entry.a, locale),
          })),
        )}
      />

      <PageHeader
        eyebrow={dict.nav.visit}
        title={dict.visit.title}
        description={t(site.hoursNote, locale)}
        crumbs={crumbs(locale, ["nav.visit", "/visit"])}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.mapQuery)}`}
            external
          >
            <Icon.MapPin className="h-5 w-5" />
            {dict.visit.getDirections}
          </ButtonLink>
        }
      />

      {/* Hours, address, map */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Card className="p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl">
                  <Icon.Clock className="h-5 w-5 text-gold-500" />
                  {dict.visit.hours}
                </h2>
                <Badge tone={openNow ? "success" : "neutral"}>
                  {openNow ? dict.visit.openToday : dict.visit.closedToday}
                </Badge>
              </div>

              <ul className="mt-5 flex flex-col">
                {weeklyHours().map((entry) => (
                  <li
                    key={entry.day}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 last:border-0"
                  >
                    <span className="font-semibold text-heading">{dayNames[entry.day]}</span>
                    <span className="tabular-nums text-muted">
                      {displayHour(entry.opens)} – {displayHour(entry.closes)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-sm text-muted">{t(site.hoursNote, locale)}</p>

              <GoldRule className="my-6" />

              <h3 className="text-lg">{dict.visit.address}</h3>
              <address className="mt-3 flex flex-col gap-2.5 text-muted not-italic">
                <span className="flex gap-2.5">
                  <Icon.MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <span>
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region} {site.address.postalCode}
                  </span>
                </span>
                <a
                  className="flex items-center gap-2.5 hover:text-accent"
                  href={`tel:${site.contact.phoneE164}`}
                >
                  <Icon.Phone className="h-5 w-5 shrink-0 text-gold-500" />
                  {site.contact.phone}
                </a>
                <a
                  className="flex items-center gap-2.5 hover:text-accent"
                  href={`mailto:${site.contact.email}`}
                >
                  <Icon.Mail className="h-5 w-5 shrink-0 text-gold-500" />
                  {site.contact.email}
                </a>
              </address>
            </Card>

            <Card className="bg-surface-raised p-7">
              <h2 className="text-xl">{dict.visit.weeklySchedule}</h2>
              <p className="mt-2 text-muted">
                Aarti is offered every day of the year. On days the mandir is closed for darshan,
                the same seva continues on Zoom.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {dailySeva.schedule.map((slot) => (
                  <li key={slot.slug} className="flex items-baseline gap-4">
                    <span className="w-20 shrink-0 font-semibold tabular-nums text-heading">
                      {displayHour(slot.time)}
                    </span>
                    <span className="flex-1 text-muted">{t(slot.title, locale)}</span>
                    {slot.mode !== "in-person" ? (
                      <Icon.Video className="h-4 w-4 shrink-0 text-accent" />
                    ) : null}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={localePath(locale, "/daily-seva")}
                variant="secondary"
                className="mt-6 w-full"
              >
                {dict.dailySeva.title}
              </ButtonLink>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <MapEmbed locale={locale} />
          </div>
        </div>
      </Section>

      {/* First visit */}
      <Section tone="raised" id="first-visit">
        <SectionHeader
          eyebrow="Never been before?"
          title={dict.visit.firstVisit}
          description={t(visit.firstVisit.intro, locale)}
        />

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visit.firstVisit.steps.map((step, index) => (
            <li key={step.title.en}>
              <Card className="h-full p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-kumkum-700 font-display text-lg text-sandal-50">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg">{t(step.title, locale)}</h3>
                <p className="mt-2 text-muted">{t(step.body, locale)}</p>
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-7">
            <h3 className="text-lg">A few small things</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {visit.firstVisit.etiquette.map((line) => (
                <li key={line.en} className="flex gap-2.5 text-muted">
                  <Icon.Check className="mt-1 h-4 w-4 shrink-0 text-tulsi-500" />
                  {t(line, locale)}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-7">
            <h3 className="text-lg">If you would like to bring an offering</h3>
            <p className="mt-3 text-muted">{t(visit.firstVisit.offering, locale)}</p>
          </Card>
        </div>
      </Section>

      {/* Parking + accessibility */}
      <Section tone="canvas">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card id="parking" className="scroll-mt-32 p-7">
            <h2 className="flex items-center gap-2 text-xl">
              <Icon.MapPin className="h-5 w-5 text-gold-500" />
              {dict.visit.parking}
            </h2>
            <p className="mt-3 text-muted">{t(visit.parking.summary, locale)}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {visit.parking.notes.map((note) => (
                <li key={note.en} className="flex gap-2.5 text-muted">
                  <Icon.ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gold-500" />
                  {t(note, locale)}
                </li>
              ))}
            </ul>
          </Card>

          <Card id="accessibility" className="scroll-mt-32 p-7">
            <h2 className="flex items-center gap-2 text-xl">
              <Icon.Users className="h-5 w-5 text-gold-500" />
              {dict.visit.accessibility}
            </h2>
            <p className="mt-3 text-muted">{t(visit.accessibility.summary, locale)}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {visit.accessibility.features.map((feature) => (
                <li key={feature.en} className="flex gap-2.5">
                  {feature.available ? (
                    <Icon.Check className="mt-1 h-4 w-4 shrink-0 text-tulsi-500" />
                  ) : (
                    <Icon.Close className="mt-1 h-4 w-4 shrink-0 text-ink-400" />
                  )}
                  <span className={feature.available ? "text-muted" : "text-ink-400"}>
                    {t(feature, locale)}
                    {!feature.available ? (
                      <span className="ml-1.5 text-sm italic">(not available yet)</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-surface-raised p-4 text-sm text-muted">
              {t(visit.accessibility.contactNote, locale)}
            </p>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="raised">
        <SectionHeader
          align="center"
          eyebrow="Questions people actually ask"
          title="Before you come"
        />
        <div className="mx-auto max-w-3xl">
          {visit.faq.map((entry) => (
            <details
              key={entry.q.en}
              className="group border-b border-hairline py-5 last:border-0"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-heading">
                <span className="text-lg">{t(entry.q, locale)}</span>
                <Icon.ChevronDown className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-muted">{t(entry.a, locale)}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <ButtonLink href={localePath(locale, "/contact")} variant="secondary">
            {dict.connect.contactTitle}
          </ButtonLink>
        </div>
      </Section>
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
