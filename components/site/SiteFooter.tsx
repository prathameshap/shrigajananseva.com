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
              <span className="grid h-11 w-11 place-items-center rounded-full bg-kumkum-700 text-sandal-50">
                <Icon.Lotus className="h-6 w-6" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl text-heading">
                  {t(site.displayName, locale)}
                </span>
                <span className="block text-xs tracking-[0.12em] text-muted uppercase">
                  {t(site.tagline, locale)}
                </span>
              </span>
            </div>

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
              </div>
            ) : null}
          </div>

          {/* Nav columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {footerNav.map((group) => (
              <div key={group.headingKey}>
                <h2 className="mb-3 text-sm font-bold tracking-[0.14em] text-heading uppercase">
                  {lookup(dict, group.headingKey)}
                </h2>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localePath(locale, item.href)}
                        className="text-muted hover:text-accent hover:underline hover:underline-offset-4"
                      >
                        {lookup(dict, item.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
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
