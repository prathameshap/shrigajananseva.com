import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { Badge, ButtonLink, Card, Container, GoldRule } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { isOpenToday, weeklyHours } from "@/lib/schedule";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.navGroups.contact,
    description: `Contact Shri Gajanan Seva — ${site.address.street}, ${site.address.locality}, ${site.address.region}. Phone ${site.contact.phone}.`,
  };
}

export default async function ContactPage({ params }: LocaleParams) {
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

  const emails = [
    { address: site.contact.email, label: "General enquiries" },
    { address: site.contact.charityEmail, label: "Donations, receipts and finance" },
    { address: site.contact.newsletterEmail, label: "Newsletter" },
  ];

  return (
    <>
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
