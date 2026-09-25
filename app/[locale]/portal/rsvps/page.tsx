import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { LocalTime } from "@/components/shared/LocalTime";
import { Badge, ButtonLink, Card, GoldRule } from "@/components/ui";
import { getOccasion, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { portal, getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.myRsvps, robots: { index: false, follow: false } };
}

export default async function RsvpsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const [rsvps, household, attendance] = await Promise.all([
    portal.listRsvps(session.id),
    portal.getHousehold(session.householdId),
    portal.listAttendance(session.id),
  ]);

  const memberName = new Map(household?.members.map((m) => [m.id, m.name]) ?? []);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">{dict.portal.myRsvps}</h1>
        <GoldRule className="mt-4 max-w-24" />
      </header>

      {rsvps.length ? (
        <div className="flex flex-col gap-5">
          {rsvps.map((rsvp) => {
            const occasion = getOccasion(rsvp.occasionSlug);
            if (!occasion) return null;
            return (
              <Card key={rsvp.id} className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={rsvp.status === "confirmed" ? "success" : "warning"}>
                    {rsvp.status === "confirmed" ? "Confirmed" : "Waitlisted"}
                  </Badge>
                  <Badge tone="neutral">
                    {rsvp.partySize} {rsvp.partySize === 1 ? "person" : "people"}
                  </Badge>
                </div>

                <h2 className="mt-3 text-xl">
                  <Link
                    href={localePath(locale, `/occasions/${occasion.slug}`)}
                    className="hover:text-brand hover:underline hover:underline-offset-4"
                  >
                    {t(occasion.title, locale)}
                  </Link>
                </h2>

                <p className="mt-1 flex items-center gap-2 text-muted">
                  <Icon.Calendar className="h-4 w-4 text-gold-500" />
                  <LocalTime
                    iso={occasion.start}
                    locale={locale}
                    serverZone={site.timezone}
                    mode="datetime"
                  />
                </p>

                <dl className="mt-5 flex flex-col gap-3 border-t border-hairline pt-4 text-sm">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <dt className="w-32 shrink-0 font-semibold text-heading">
                      {dict.portal.attendees}
                    </dt>
                    <dd className="text-muted">
                      {rsvp.attendeeIds
                        .map((id) => memberName.get(id) ?? id)
                        .join(", ")}
                    </dd>
                  </div>
                  {rsvp.dietaryNotes ? (
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <dt className="w-32 shrink-0 font-semibold text-heading">
                        {dict.portal.dietaryNotes}
                      </dt>
                      <dd className="text-muted">{rsvp.dietaryNotes}</dd>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <dt className="w-32 shrink-0 font-semibold text-heading">Ticket</dt>
                    <dd className="font-mono text-muted">{rsvp.ticketCode}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
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

      {/* History */}
      <section>
        <h2 className="mb-4 text-2xl">{dict.portal.attendanceHistory}</h2>
        <Card className="overflow-hidden">
          <ul className="divide-y divide-hairline">
            {attendance.map((record) => {
              const occasion = getOccasion(record.occasionSlug);
              return (
                <li
                  key={record.occasionSlug}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-heading">
                      {occasion ? t(occasion.title, locale) : record.occasionSlug}
                    </span>
                    <span className="block text-sm text-muted">
                      {new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
                        dateStyle: "long",
                      }).format(new Date(record.attendedOn))}
                    </span>
                  </span>
                  <Badge tone="neutral">
                    {record.partySize} attended
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>
    </div>
  );
}
