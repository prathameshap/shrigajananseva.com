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
                  {t(site.tagline, locale)}
                </span>
              </span>
            </div>

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
              </div>
            ) : null}
          </div>

          {/* ---------------------------------------------- link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {footerNav.map((group) => (
              <nav key={group.headingKey} aria-label={lookup(dict, group.headingKey)}>
                <h2 className="text-xs font-semibold tracking-[0.16em] text-marigold-300 uppercase">
                  {lookup(dict, group.headingKey)}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localePath(locale, item.href)}
                        className="transition-colors hover:text-marigold-300"
                      >
                        {lookup(dict, item.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
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
