import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { LocalTime, Countdown } from "@/components/shared/LocalTime";
import { Badge, ButtonLink, Card, GoldRule, Stat } from "@/components/ui";
import { getOccasion, site, upcomingOccasions } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { portal, getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.dashboard, robots: { index: false, follow: false } };
}

export default async function PortalDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const [rsvps, donations, household, attendance] = await Promise.all([
    portal.listRsvps(session.id),
    portal.listDonations(session.id),
    portal.getHousehold(session.householdId),
    portal.listAttendance(session.id),
  ]);

  const activeRsvps = rsvps.filter((rsvp) => rsvp.status !== "cancelled");
  const thisYear = new Date().getFullYear();
  const givenThisYear = donations
    .filter((donation) => new Date(donation.date).getFullYear() === thisYear)
    .reduce((sum, donation) => sum + donation.amount, 0);

  const nextOccasions = upcomingOccasions(new Date(), 2);
  const registeredSlugs = new Set(activeRsvps.map((rsvp) => rsvp.occasionSlug));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl sm:text-4xl">
          {dict.portal.welcomeBack.replace("{name}", session.name)}
        </h1>
        <GoldRule className="mt-4 max-w-24" />
      </header>

      {/* Summary */}
      <Card className="p-7">
        <div className="grid gap-8 sm:grid-cols-3">
          <Stat value={activeRsvps.length} label={dict.portal.myRsvps} />
          <Stat value={household?.members.length ?? 0} label={dict.portal.household} />
          <Stat
            value={`$${givenThisYear.toLocaleString("en-US")}`}
            label={dict.portal.giving}
            note={`in ${thisYear}`}
          />
        </div>
      </Card>

      {/* Upcoming registrations */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl">{dict.occasions.upcoming}</h2>
          <Link
            href={localePath(locale, "/portal/rsvps")}
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline hover:underline-offset-4"
          >
            {dict.common.viewAll}
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {activeRsvps.length ? (
          <div className="flex flex-col gap-4">
            {activeRsvps.map((rsvp) => {
              const occasion = getOccasion(rsvp.occasionSlug);
              if (!occasion) return null;
              return (
                <Card key={rsvp.id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={rsvp.status === "confirmed" ? "success" : "warning"}>
                          {rsvp.status === "confirmed" ? "Confirmed" : "Waitlisted"}
                        </Badge>
                        <Badge tone="neutral">
                          {rsvp.partySize} {rsvp.partySize === 1 ? "person" : "people"}
                        </Badge>
                      </div>
                      <h3 className="mt-3 text-xl">
                        <Link
                          href={localePath(locale, `/occasions/${occasion.slug}`)}
                          className="hover:text-brand hover:underline hover:underline-offset-4"
                        >
                          {t(occasion.title, locale)}
                        </Link>
                      </h3>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-muted">
                        <Icon.Calendar className="h-4 w-4 text-gold-500" />
                        <LocalTime
                          iso={occasion.start}
                          locale={locale}
                          serverZone={site.timezone}
                          mode="datetime"
                        />
                        <Countdown
                          iso={occasion.start}
                          locale={locale}
                          className="font-semibold text-accent"
                        />
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <ButtonLink
                        href={localePath(locale, "/portal/tickets")}
                        variant="secondary"
                        size="sm"
                      >
                        <Icon.Ticket className="h-4 w-4" />
                        {dict.portal.myTickets}
                      </ButtonLink>
                      <ButtonLink
                        href={localePath(locale, `/portal/rsvp/${occasion.slug}`)}
                        variant="ghost"
                        size="sm"
                      >
                        {dict.portal.editRsvp}
                      </ButtonLink>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-10 text-center">
            <p className="text-muted">{dict.portal.noRsvps}</p>
            <ButtonLink href={localePath(locale, "/occasions")} className="mt-5">
              {dict.occasions.title}
            </ButtonLink>
          </Card>
        )}
      </section>

      {/* Suggestions */}
      {nextOccasions.some((occasion) => !registeredSlugs.has(occasion.slug)) ? (
        <section>
          <h2 className="mb-4 text-2xl">Coming up that you have not registered for</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {nextOccasions
              .filter((occasion) => !registeredSlugs.has(occasion.slug))
              .map((occasion) => (
                <Card key={occasion.slug} className="flex flex-col p-6">
                  <h3 className="text-lg">{t(occasion.title, locale)}</h3>
                  <p className="mt-1 text-sm font-semibold text-accent">
                    <LocalTime
                      iso={occasion.start}
                      locale={locale}
                      serverZone={site.timezone}
                      mode="date"
                    />
                  </p>
                  <p className="mt-2 flex-1 text-muted">{t(occasion.summary, locale)}</p>
                  {occasion.rsvpOpen ? (
                    <ButtonLink
                      href={localePath(locale, `/portal/rsvp/${occasion.slug}`)}
                      className="mt-5"
                      size="sm"
                    >
                      {dict.occasions.rsvp}
                    </ButtonLink>
                  ) : (
                    <p className="mt-5 text-sm text-muted italic">
                      {dict.occasions.registrationClosed}
                    </p>
                  )}
                </Card>
              ))}
          </div>
        </section>
      ) : null}

      {/* Recent activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg">{dict.portal.giving}</h2>
            <Link
              href={localePath(locale, "/portal/giving")}
              className="text-sm font-semibold text-accent hover:underline"
            >
              {dict.common.viewAll}
            </Link>
          </div>
          <ul className="mt-4 flex flex-col">
            {donations.slice(0, 3).map((donation) => (
              <li
                key={donation.id}
                className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-0"
              >
                <span className="text-muted">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                    new Date(donation.date),
                  )}
                </span>
                <span className="font-semibold text-heading">${donation.amount}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg">{dict.portal.attendanceHistory}</h2>
          <ul className="mt-4 flex flex-col">
            {attendance.map((record) => {
              const occasion = getOccasion(record.occasionSlug);
              return (
                <li
                  key={record.occasionSlug}
                  className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-0"
                >
                  <span className="min-w-0 truncate text-muted">
                    {occasion ? t(occasion.title, locale) : record.occasionSlug}
                  </span>
                  <span className="shrink-0 font-semibold text-heading">
                    {record.partySize}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>
    </div>
  );
}
