<<<<<<< HEAD
import Link from "next/link";

import { Icon, socialIcon } from "@/components/icons";
import { LotusMark, PetalDivider } from "@/components/decor";
import { Container, GoldRule } from "@/components/ui";
import { liveSocial, site } from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";
import { footerNav, lookup } from "@/lib/nav";
import { weeklyHours } from "@/lib/schedule";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const channels = liveSocial();

  // A fixed reference date is used purely to turn "18:00" into "6.00pm" in the
  // reader's language. Only the clock time is rendered, never this date.
  const reference = "2026-01-01";
  const weekdayName = (day: number) =>
    new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2024, 0, 7 + day)));

  return (
    <footer className="bg-night-900 text-sandal-200">
      <PetalDivider className="rotate-180 text-gold-400" />

      <Container width="wide">
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
          {/* ------------------------------------------------- identity */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-500 via-kumkum-500 to-kumkum-700 text-sandal-50">
                <LotusMark className="h-7 w-7" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl text-sandal-50">
                  {t(site.displayName, locale)}
                </span>
                <span className="block text-xs tracking-[0.12em] text-marigold-300 uppercase">
=======
import Image from "next/image";
import Link from "next/link";
import { Icon, socialIcon } from "@/components/icons";
import { Container, GoldRule } from "@/components/ui";
import { liveSocial, site } from "@/lib/content";
import { footerNav, lookup } from "@/lib/nav";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";
import { weeklyHours } from "@/lib/schedule";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  const social = liveSocial();

  return (
    <footer className="mt-auto border-t border-hairline bg-surface-raised">
      <Container width="wide">
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-8">
          {/* Identity + newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt=""
                width={127}
                height={105}
                className="h-12 w-auto shrink-0"
              />
              <span className="leading-tight">
                <span className="block font-display text-xl text-heading">
                  {t(site.displayName, locale)}
                </span>
                <span className="block text-xs tracking-[0.12em] text-muted uppercase">
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
                  {t(site.tagline, locale)}
                </span>
              </span>
            </div>

<<<<<<< HEAD
            <GoldRule className="mt-6 max-w-32" />

            <p className="mt-5 text-sm leading-relaxed text-sandal-300">
              {dict.footer.nonprofitNote}
            </p>

            <address className="mt-6 flex flex-col gap-2.5 text-sm not-italic">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(site.address.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 transition-colors hover:text-marigold-300"
              >
                <Icon.MapPin className="mt-0.5 h-4 w-4 shrink-0 text-marigold-400" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.locality}, {site.address.region} {site.address.postalCode}
                </span>
              </a>
              <a
                href={`tel:${site.contact.phoneE164}`}
                className="flex items-center gap-2.5 transition-colors hover:text-marigold-300"
              >
                <Icon.Phone className="h-4 w-4 shrink-0 text-marigold-400" />
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-marigold-300"
              >
                <Icon.Mail className="h-4 w-4 shrink-0 text-marigold-400" />
                {site.contact.email}
              </a>
            </address>

            {channels.length ? (
              <div className="mt-7">
                <p className="text-xs font-semibold tracking-[0.16em] text-marigold-300 uppercase">
                  {dict.footer.followUs}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {channels.map((channel) => {
                    const Glyph = socialIcon(channel.id);
                    return (
                      <li key={channel.id}>
                        <a
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={channel.label}
                          className="grid h-11 w-11 place-items-center rounded-full border border-night-600 text-sandal-200 transition-colors hover:border-marigold-400 hover:bg-night-800 hover:text-marigold-300"
                        >
                          <Glyph className="h-5 w-5" />
                          <span className="sr-only">{channel.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
=======
            <p className="mt-5 max-w-sm text-muted">{dict.footer.nonprofitNote}</p>

            <div className="mt-6 max-w-sm">
              <p className="mb-2 font-semibold text-heading">{dict.connect.newsletterTitle}</p>
              <NewsletterForm locale={locale} compact />
            </div>

            {social.length ? (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {social.map((channel) => {
                  const ChannelIcon = socialIcon(channel.id);
                  return (
                    <a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-surface text-muted transition-colors hover:border-gold-400 hover:text-brand"
                    >
                      <ChannelIcon className="h-5 w-5" title={channel.label} />
                    </a>
                  );
                })}
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
              </div>
            ) : null}
          </div>

<<<<<<< HEAD
          {/* ---------------------------------------------- link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {footerNav.map((group) => (
              <nav key={group.headingKey} aria-label={lookup(dict, group.headingKey)}>
                <h2 className="text-xs font-semibold tracking-[0.16em] text-marigold-300 uppercase">
                  {lookup(dict, group.headingKey)}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
=======
          {/* Nav columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {footerNav.map((group) => (
              <div key={group.headingKey}>
                <h2 className="mb-3 text-sm font-bold tracking-[0.14em] text-heading uppercase">
                  {lookup(dict, group.headingKey)}
                </h2>
                <ul className="flex flex-col gap-2">
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localePath(locale, item.href)}
<<<<<<< HEAD
                        className="transition-colors hover:text-marigold-300"
=======
                        className="text-muted hover:text-accent hover:underline hover:underline-offset-4"
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
                      >
                        {lookup(dict, item.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
<<<<<<< HEAD
              </nav>
            ))}
          </div>

          {/* ---------------------------------------------------- hours */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-marigold-300 uppercase">
              {dict.footer.hoursHeading}
            </h2>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              {weeklyHours().map((entry) => (
                <div
                  key={entry.day}
                  className="flex justify-between gap-4 border-b border-night-700 pb-2 last:border-0"
                >
                  <dt className="font-semibold text-sandal-100">{weekdayName(entry.day)}</dt>
                  <dd className="text-right text-sandal-300">
                    {formatTime(
                      zonedToInstant(reference, entry.opens, site.timezone),
                      locale,
                      site.timezone,
                    )}
                    {" – "}
                    {formatTime(
                      zonedToInstant(reference, entry.closes, site.timezone),
                      locale,
                      site.timezone,
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-sandal-300">
              {t(
                {
                  en: "Online upasana runs at 7pm every day of the year.",
                  mr: "ऑनलाइन उपासना वर्षातील प्रत्येक दिवशी सायंकाळी ७ वाजता.",
                },
                locale,
              )}
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-night-700">
        <Container width="wide">
          <div className="flex flex-col gap-3 py-6 text-sm text-sandal-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {dict.footer.copyright}
            </p>
            <p className="font-deva text-base text-marigold-300">
              {t({ en: "॥ गण गण गणात बोते ॥", mr: "॥ गण गण गणात बोते ॥" }, locale)}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
=======
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-bold tracking-[0.14em] text-heading uppercase">
              {dict.footer.contactHeading}
            </h2>
            <address className="flex flex-col gap-3 text-muted not-italic">
              <span className="flex gap-2.5">
                <Icon.MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.locality}, {site.address.region} {site.address.postalCode}
                </span>
              </span>
              <a className="flex items-center gap-2.5 hover:text-accent" href={`tel:${site.contact.phoneE164}`}>
                <Icon.Phone className="h-5 w-5 shrink-0 text-gold-500" />
                {site.contact.phone}
              </a>
              <a className="flex items-center gap-2.5 hover:text-accent" href={`mailto:${site.contact.email}`}>
                <Icon.Mail className="h-5 w-5 shrink-0 text-gold-500" />
                {site.contact.email}
              </a>
            </address>

            <h3 className="mt-6 mb-2 text-sm font-bold tracking-[0.14em] text-heading uppercase">
              {dict.visit.hours}
            </h3>
            <ul className="flex flex-col gap-1 text-muted">
              {weeklyHours().map((entry) => (
                <li key={entry.day} className="flex justify-between gap-4">
                  <span>{dayName(dict, entry.day)}</span>
                  <span className="tabular-nums">
                    {formatHour(entry.opens)} – {formatHour(entry.closes)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <GoldRule />

        <div className="flex flex-col gap-3 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.footer.copyright.replace("{year}", String(year))}</p>
          <p className="font-display text-base text-heading italic">{dict.footer.builtNote}</p>
        </div>
      </Container>
    </footer>
  );
}

function dayName(dict: ReturnType<typeof getDictionary>, day: number) {
  const names = [
    dict.days.sunday,
    dict.days.monday,
    dict.days.tuesday,
    dict.days.wednesday,
    dict.days.thursday,
    dict.days.friday,
    dict.days.saturday,
  ];
  return names[day];
}

/** "07:00" → "7:00 am". Hours are fixed weekly, so no timezone maths needed. */
function formatHour(value: string) {
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute} ${suffix}`;
}
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
