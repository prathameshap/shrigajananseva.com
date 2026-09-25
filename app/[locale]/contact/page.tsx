import type { Metadata } from "next";

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
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

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
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

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
  ];

  return (
    <>
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
