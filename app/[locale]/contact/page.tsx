import type { Metadata } from "next";
<<<<<<< HEAD

import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Card,
  DefinitionRow,
  Eyebrow,
  Section,
  SectionHeader,
  SpinedCard,
} from "@/components/ui";
import { site } from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { weeklyHours } from "@/lib/schedule";
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { Badge, ButtonLink, Card, Container, GoldRule } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { isOpenToday, weeklyHours } from "@/lib/schedule";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

<<<<<<< HEAD
/** A Sunday, so the weekday arithmetic below needs no offset juggling. */
const CLOCK_REFERENCE = "2026-01-04";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.contact.title,
    description: dict.contact.intro,
    path: "/contact",
  });
=======
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.navGroups.contact,
    description: `Contact Shri Gajanan Seva — ${site.address.street}, ${site.address.locality}, ${site.address.region}. Phone ${site.contact.phone}.`,
  };
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
<<<<<<< HEAD

  const clock = (time: string) =>
    formatTime(zonedToInstant(CLOCK_REFERENCE, time, site.timezone), locale, site.timezone);

  const weekdayName = (day: number) =>
    new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2024, 0, 7 + day)));

  /**
   * Three addresses, each with a stated owner. A single info@ inbox is where
   * volunteer-run organisations lose messages; saying which one to use, and how
   * long a reply takes, is the whole point of this page.
   */
  const desks = [
    {
      key: "general",
      spine: "saffron" as const,
      title: dict.contact.generalTitle,
      body: dict.contact.generalBody,
      email: site.contact.email,
      icon: Icon.Mail,
    },
    {
      key: "charity",
      spine: "tulsi" as const,
      title: dict.contact.charityTitle,
      body: dict.contact.charityBody,
      email: site.contact.charityEmail,
      icon: Icon.Heart,
    },
    {
      key: "privacy",
      spine: "peacock" as const,
      title: dict.contact.privacyTitle,
      body: dict.contact.privacyBody,
      email: site.contact.privacyEmail,
      icon: Icon.Shield,
    },
=======
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

  const emails = [
    { address: site.contact.email, label: "General enquiries" },
    { address: site.contact.charityEmail, label: "Donations, receipts and finance" },
    { address: site.contact.newsletterEmail, label: "Newsletter" },
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  ];

  return (
    <>
<<<<<<< HEAD
      <PageHero
        eyebrow={dict.navGroups.contact}
        title={dict.contact.title}
        description={dict.contact.intro}
        crumbs={crumbs(locale, ["navGroups.contact", "/contact"])}
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

            <dl className="mt-5 border-t border-gold-400/40 pt-4">
              <DefinitionRow term={dict.contact.phoneLabel}>
                <a
                  className="font-semibold text-accent underline underline-offset-2"
                  href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                >
                  {site.contact.phone}
                </a>
              </DefinitionRow>
              <DefinitionRow term={dict.contact.addressLabel}>
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </DefinitionRow>
              <DefinitionRow term={dict.contact.responseLabel}>
                {dict.contact.responseBody}
              </DefinitionRow>
            </dl>

            <a
              className="mt-4 inline-flex items-center gap-1.5 font-semibold text-accent"
              href={localePath(locale, "/visit")}
            >
              <Icon.MapPin className="h-4 w-4" />
              {dict.visit.title}
            </a>
          </Card>
        }
      />

      {/* ──────────────────────────────────────────────── which address ─── */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.navGroups.contact}
          title={dict.contact.whoToWriteTo}
          description={dict.contact.desksNote}
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {desks.map((desk) => {
            const Glyph = desk.icon;
            return (
              <SpinedCard as="li" key={desk.key} spine={desk.spine}>
                <div className="flex h-full flex-col p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent">
                    <Glyph className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg">{desk.title}</h3>
                  <p className="mt-2 flex-1 text-muted">{desk.body}</p>
                  <a
                    className="mt-4 font-semibold break-all text-accent underline underline-offset-2"
                    href={`mailto:${desk.email}`}
                  >
                    {desk.email}
                  </a>
                </div>
              </SpinedCard>
            );
          })}
        </ul>
      </Section>

      {/* ───────────────────────────────────────────────────────── form ─── */}
      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.navGroups.contact}
              title={dict.contact.formTitle}
              description={t(
                {
                  en: "Pick a subject and the message is routed to the right volunteer for you. Everything except the phone number is needed.",
                  mr: "विषय निवडा, म्हणजे संदेश योग्य स्वयंसेवकाकडे पोहोचवला जाईल. दूरध्वनी वगळता सर्व माहिती आवश्यक आहे.",
                },
                locale,
              )}
            />
          </div>
          <div className="lg:col-span-7">
            <Card tone="gold" className="p-7">
              <ContactForm
                labels={{
                  nameLabel: dict.contact.nameLabel,
                  emailLabel: dict.contact.emailLabel,
                  phoneLabel: dict.contact.phoneLabel,
                  subjectLabel: dict.contact.subjectLabel,
                  messageLabel: dict.contact.messageLabel,
                  send: dict.contact.send,
                  sending: dict.contact.sending,
                  sentTitle: dict.contact.sentTitle,
                  sentBody: dict.contact.sentBody,
                  failedTitle: dict.contact.failedTitle,
                  failedBody: dict.contact.failedBody,
                  mailtoFallback: dict.contact.mailtoFallback,
                  required: dict.forms.required,
                  invalidEmail: dict.forms.invalidEmail,
                  tooShort: dict.forms.tooShort,
                  honeypotLabel: dict.forms.honeypotLabel,
                  optional: dict.common.optional,
                  privacyNote: dict.forms.privacyNote,
                  subjects: Object.entries(dict.contact.subjectOptions).map(
                    ([value, label]) => ({ value, label }),
                  ),
                }}
                fallbackEmail={site.contact.email}
              />
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
=======
      <PageHeader
        eyebrow={dict.nav.connect}
        title={dict.navGroups.contact}
        description="Send a message, call during darshan hours, or simply come by on a Thursday, Saturday or Sunday."
        crumbs={crumbs(locale, ["navGroups.contact", "/contact"])}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={`tel:${site.contact.phoneE164}`}>
            <Icon.Phone className="h-5 w-5" />
            {site.contact.phone}
          </ButtonLink>
        }
      />

      <Container>
        <div className="grid gap-12 py-14 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl">{dict.connect.contactTitle}</h2>
            <GoldRule className="mt-3 mb-6 max-w-32" />
            <p className="mb-7 text-muted">
              We read everything that comes in. Replies usually take a day or two — the mandir is
              run entirely by volunteers around their jobs.
            </p>
            <Card className="p-6 sm:p-8">
              <ContactForm locale={locale} />
            </Card>
          </div>

          {/* Details */}
          <aside className="lg:col-span-5">
            <div className="flex flex-col gap-5">
              <Card className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg">{dict.visit.hours}</h2>
                  <Badge tone={openNow ? "success" : "neutral"}>
                    {openNow ? dict.visit.openToday : dict.visit.closedToday}
                  </Badge>
                </div>
                <ul className="mt-4 flex flex-col">
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
                <p className="mt-4 text-sm text-muted">{t(site.hoursNote, locale)}</p>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg">{dict.visit.address}</h2>
                <address className="mt-3 flex flex-col gap-3 text-muted not-italic">
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
                </address>

                <GoldRule className="my-5" />

                <h3 className="font-semibold text-heading">Email</h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {emails.map((entry) => (
                    <li key={entry.address}>
                      <a
                        className="font-semibold text-accent hover:underline hover:underline-offset-4"
                        href={`mailto:${entry.address}`}
                      >
                        {entry.address}
                      </a>
                      <span className="block text-sm text-muted">{entry.label}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-surface-raised p-6">
                <h2 className="text-lg">First time visiting?</h2>
                <p className="mt-2 text-muted">
                  What to expect, what to wear, where to park, and what happens when you walk in.
                </p>
                <ButtonLink
                  href={localePath(locale, "/visit")}
                  variant="secondary"
                  className="mt-5 w-full"
                >
                  {dict.visit.firstVisit}
                </ButtonLink>
              </Card>
            </div>
          </aside>
        </div>

        <div className="pb-16">
          <MapEmbed locale={locale} />
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
