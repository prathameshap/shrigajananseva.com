import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { Icon } from "@/components/icons";
import { LocalTime } from "@/components/shared/LocalTime";
import { Badge, Card, GoldRule, Placeholder } from "@/components/ui";
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
  return { title: dict.portal.myTickets, robots: { index: false, follow: false } };
}

/**
 * QR is rendered to an inline SVG on the server.
 *
 * No canvas, no client-side library, and it prints cleanly — which matters,
 * because a good number of devotees will bring a printed sheet to the gate
 * rather than a phone.
 */
async function qrSvg(value: string): Promise<string> {
  return QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 220,
    color: { dark: "#5c172a", light: "#ffffff" },
  });
}

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const [rsvps, household] = await Promise.all([
    portal.listRsvps(session.id),
    portal.getHousehold(session.householdId),
  ]);

  const active = rsvps.filter((rsvp) => rsvp.status !== "cancelled");
  const memberName = new Map(household?.members.map((m) => [m.id, m.name]) ?? []);

  const tickets = await Promise.all(
    active.map(async (rsvp) => ({
      rsvp,
      occasion: getOccasion(rsvp.occasionSlug),
      svg: await qrSvg(rsvp.ticketCode),
    })),
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">{dict.portal.myTickets}</h1>
        <GoldRule className="mt-4 max-w-24" />
        <p className="mt-5 text-muted">
          {dict.portal.showAtGate}. A volunteer scans it and your whole party is checked in at
          once.
        </p>
      </header>

      {tickets.length ? (
        <div className="flex flex-col gap-6">
          {tickets.map(({ rsvp, occasion, svg }) =>
            occasion ? (
              <Card key={rsvp.id} className="overflow-hidden">
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                  <div
                    className="mx-auto shrink-0 rounded-xl bg-white p-3 shadow-soft sm:mx-0"
                    // Generated server-side by the qrcode package from an
                    // opaque ticket code — no user input reaches this.
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <Badge tone={rsvp.status === "confirmed" ? "success" : "warning"}>
                      {rsvp.status === "confirmed" ? "Confirmed" : "Waitlisted"}
                    </Badge>

                    <h2 className="mt-3 text-xl">{t(occasion.title, locale)}</h2>

                    <p className="mt-1 flex items-center justify-center gap-2 text-muted sm:justify-start">
                      <Icon.Calendar className="h-4 w-4 text-gold-500" />
                      <LocalTime
                        iso={occasion.start}
                        locale={locale}
                        serverZone={site.timezone}
                        mode="datetime"
                      />
                    </p>

                    <p className="mt-1 flex items-center justify-center gap-2 text-muted sm:justify-start">
                      <Icon.MapPin className="h-4 w-4 text-gold-500" />
                      {occasion.locationName}, {site.address.street}
                    </p>

                    <dl className="mt-4 border-t border-hairline pt-4 text-sm">
                      <div className="flex flex-wrap justify-center gap-x-3 sm:justify-start">
                        <dt className="font-semibold text-heading">{dict.portal.attendees}</dt>
                        <dd className="text-muted">
                          {rsvp.attendeeIds.map((id) => memberName.get(id) ?? id).join(", ")}
                        </dd>
                      </div>
                      <div className="mt-1.5 flex flex-wrap justify-center gap-x-3 sm:justify-start">
                        <dt className="font-semibold text-heading">Code</dt>
                        <dd className="font-mono text-muted">{rsvp.ticketCode}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <p className="border-t border-hairline bg-surface-raised px-6 py-3 text-sm text-muted">
                  PDF download arrives with the ticketing phase. In the meantime your browser&apos;s
                  print function produces a perfectly scannable sheet.
                </p>
              </Card>
            ) : null,
          )}
        </div>
      ) : (
        <Card className="p-10 text-center">
          <Icon.Ticket className="mx-auto h-10 w-10 text-ink-400" />
          <p className="mt-4 text-muted">{dict.portal.noRsvps}</p>
        </Card>
      )}

      <Placeholder title="Gate scanning is not live yet">
        <p>
          These codes are real and unique, but nothing scans them yet. Scoped scanner-role grants
          for gate volunteers and the live check-in dashboard are part of the admin console
          phase.
        </p>
      </Placeholder>
    </div>
  );
}
