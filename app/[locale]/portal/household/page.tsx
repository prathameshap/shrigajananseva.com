import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { Badge, ButtonLink, Card, GoldRule, Placeholder } from "@/components/ui";
import { getDictionary, localePath } from "@/lib/i18n";
import { portal, getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.household, robots: { index: false, follow: false } };
}

const AGE_BAND_LABEL = {
  child: "Child",
  teen: "Teen",
  adult: "Adult",
  senior: "Senior",
} as const;

export default async function HouseholdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const household = await portal.getHousehold(session.householdId);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">{dict.portal.household}</h1>
        <GoldRule className="mt-4 max-w-24" />
        <p className="mt-5 text-muted">
          Household members are what make family attendance counts work — one RSVP covers
          everyone, and the kitchen knows how much prasad to prepare.
        </p>
      </header>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-hairline bg-surface-raised px-6 py-4">
          <h2 className="text-lg">Members</h2>
          <Badge tone="neutral">{household?.members.length ?? 0}</Badge>
        </div>

        <ul className="divide-y divide-hairline">
          {household?.members.map((member) => (
            <li key={member.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon.Users className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-heading">{member.name}</span>
                <span className="block text-sm text-muted">{member.relation}</span>
              </span>
              <span className="flex shrink-0 gap-2">
                <Badge tone="neutral">{AGE_BAND_LABEL[member.ageBand]}</Badge>
                {member.isMinor ? <Badge tone="warning">Guardian consent</Badge> : null}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Placeholder title="Editing is not connected yet">
        <p>
          Adding, editing and removing household members needs somewhere to write to. The screen,
          the shape of the data and the age bands are all in place; the database is the missing
          piece.
        </p>
        <p className="mt-2 text-sm">
          Implement{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">PortalRepository</code> against
          Postgres in{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">lib/portal/</code> and swap the
          export in{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">lib/portal/session.ts</code>.
        </p>
      </Placeholder>

      <Card className="bg-surface-raised p-6">
        <h2 className="text-lg">{dict.portal.preferences}</h2>
        <p className="mt-2 text-muted">
          Contact details, language and how you would like to hear from us.
        </p>
        <ButtonLink
          href={localePath(locale, "/portal/preferences")}
          variant="secondary"
          className="mt-5"
        >
          {dict.portal.preferences}
          <Icon.ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </Card>
    </div>
  );
}
