import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { LocalTime } from "@/components/shared/LocalTime";
import { Badge, ButtonLink, Card, GoldRule, Placeholder } from "@/components/ui";
import { capacityState, getOccasion, placesLeft, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { portal, getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  return {
    title: occasion ? `RSVP — ${occasion.title.en}` : "RSVP",
    robots: { index: false, follow: false },
  };
}

/**
 * The RSVP form.
 *
 * Fully rendered and pre-filled from the household, with capacity and waitlist
 * state resolved — but the submit is disabled, because there is nowhere to
 * write the registration. Showing the real form disabled is more useful than
 * hiding it: the trustees can review the exact flow before it goes live.
 */
export default async function RsvpPage({ params }: Params) {
  const { slug } = await params;
  const locale = await resolveLocale(params as unknown as Promise<{ locale: string }>);
  const dict = getDictionary(locale);

  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const [household, existing] = await Promise.all([
    portal.getHousehold(session.householdId),
    portal.getRsvp(session.id, slug),
  ]);

  const state = capacityState(occasion);
  const left = placesLeft(occasion);
  const isWaitlist = state === "full" || state === "waitlist";
  const attending = new Set(existing?.attendeeIds ?? []);

  const fieldClass =
    "w-full rounded-xl border border-hairline bg-surface px-4 py-2.5 text-body disabled:opacity-60";

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-sm font-semibold tracking-[0.16em] text-accent uppercase">
          {existing ? dict.portal.editRsvp : dict.occasions.rsvp}
        </p>
        <h1 className="mt-2 text-3xl">{t(occasion.title, locale)}</h1>
        <GoldRule className="mt-4 max-w-24" />
        <p className="mt-5 flex flex-wrap items-center gap-2 text-muted">
          <Icon.Calendar className="h-4 w-4 text-gold-500" />
          <LocalTime
            iso={occasion.start}
            locale={locale}
            serverZone={site.timezone}
            mode="datetime"
          />
          {!occasion.dateConfirmed ? (
            <span className="italic">(date to be confirmed)</span>
          ) : null}
        </p>
      </header>

      {/* Capacity */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {isWaitlist ? (
              <Badge tone="warning">{dict.occasions.capacityWaitlist}</Badge>
            ) : (
              <Badge tone="success">{dict.occasions.capacityOpen}</Badge>
            )}
            {existing ? <Badge tone="accent">You are registered</Badge> : null}
          </div>
          {left != null ? (
            <p className="text-muted">
              {dict.occasions.spotsLeft.replace("{count}", String(left))}
            </p>
          ) : null}
        </div>

        {occasion.capacity != null ? (
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-surface-raised"
            role="progressbar"
            aria-valuenow={occasion.rsvpCount}
            aria-valuemin={0}
            aria-valuemax={occasion.capacity}
            aria-label="Places taken"
          >
            <div
              className="h-full rounded-full bg-marigold-400"
              style={{
                width: `${Math.min(100, (occasion.rsvpCount / occasion.capacity) * 100)}%`,
              }}
            />
          </div>
        ) : null}
      </Card>

      {/* Form */}
      <Card className="p-6 sm:p-8">
        <form className="flex flex-col gap-6">
          <fieldset>
            <legend className="text-lg font-semibold text-heading">
              {dict.portal.attendees}
            </legend>
            <p className="mt-1 text-sm text-muted">
              Tick everyone who is coming. This is what the kitchen uses to plan prasad.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {household?.members.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-hairline p-4"
                >
                  <input
                    type="checkbox"
                    name="attendees"
                    value={member.id}
                    defaultChecked={attending.has(member.id)}
                    disabled
                    className="h-4 w-4 shrink-0 accent-[var(--sgs-brand)]"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold text-heading">{member.name}</span>
                    <span className="block text-sm text-muted">{member.relation}</span>
                  </span>
                  {member.isMinor ? <Badge tone="warning">Minor</Badge> : null}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-heading">{dict.portal.partySize}</span>
            <input
              type="number"
              min={1}
              max={20}
              defaultValue={existing?.partySize ?? 1}
              disabled
              className={`${fieldClass} max-w-32`}
            />
            <span className="text-sm text-muted">
              Include anyone coming with you who is not in your household.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-heading">{dict.portal.dietaryNotes}</span>
            <textarea
              rows={3}
              defaultValue={existing?.dietaryNotes ?? ""}
              disabled
              placeholder="Allergies, seating needs, anything that would help us look after you."
              className={fieldClass}
            />
          </label>

          <div className="flex flex-wrap gap-3 border-t border-hairline pt-6">
            <button
              type="submit"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-kumkum-700 px-7 py-3.5 text-lg font-semibold text-sandal-50 opacity-55"
            >
              {isWaitlist ? "Join the waitlist" : dict.occasions.rsvp}
            </button>
            <ButtonLink
              href={localePath(locale, `/occasions/${occasion.slug}`)}
              variant="secondary"
              size="lg"
            >
              {dict.common.back}
            </ButtonLink>
          </div>
        </form>
      </Card>

      <Placeholder title="Submitting an RSVP needs the database">
        <p>
          Everything above is real — your household, the capacity, the waitlist threshold — but
          there is nowhere yet to write the registration to, so the submit button is disabled
          rather than silently discarding what you entered.
        </p>
        <p className="mt-2 text-sm">
          Implement{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">PortalRepository</code> with write
          methods and a server action. Capacity logic already lives in{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">lib/content.ts</code> as{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">capacityState()</code>.
        </p>
      </Placeholder>
    </div>
  );
}
