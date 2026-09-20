import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { ButtonLink, Card, GoldRule, Placeholder } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.privacy, robots: { index: false, follow: false } };
}

export default async function PortalPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const held = [
    { label: "Account", detail: "Your email address, name and preferred language." },
    { label: "Household", detail: "Members, relationships and age bands you have added." },
    {
      label: "Attendance",
      detail: "Occasions you registered for, party sizes and any notes you gave us.",
    },
    {
      label: "Giving",
      detail: "Date, amount, fund and receipt number for each gift. Never card numbers.",
    },
    {
      label: "Preferences",
      detail: "Which channels and purposes you have consented to, with dates.",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">{dict.portal.privacy}</h1>
        <GoldRule className="mt-4 max-w-24" />
        <p className="mt-5 text-muted">
          It is your information. Asking about it is not a complaint, and it will never affect
          your standing in this community.
        </p>
      </header>

      <Card className="p-6">
        <h2 className="text-lg">What we hold on you</h2>
        <dl className="mt-4">
          {held.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-0.5 border-b border-hairline py-3 last:border-0 sm:flex-row sm:gap-6"
            >
              <dt className="w-36 shrink-0 font-semibold text-heading">{row.label}</dt>
              <dd className="text-muted">{row.detail}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="flex flex-col p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent">
            <Icon.Download className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg">{dict.portal.exportMyData}</h2>
          <p className="mt-2 flex-1 text-muted">
            A portable copy of everything above, in a machine-readable format.
          </p>
          <ButtonLink
            href={localePath(locale, "/legal/privacy-choices#request")}
            variant="secondary"
            className="mt-5"
          >
            Request an export
          </ButtonLink>
        </Card>

        <Card className="flex flex-col p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
            <Icon.Close className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg">{dict.portal.deleteMyData}</h2>
          <p className="mt-2 flex-1 text-muted">
            We will delete what we can. Donation records must be kept seven years by law, and we
            will tell you exactly what was retained and why.
          </p>
          <ButtonLink
            href={localePath(locale, "/legal/privacy-choices#request")}
            variant="secondary"
            className="mt-5"
          >
            Request deletion
          </ButtonLink>
        </Card>
      </div>

      <Placeholder title="Self-service export and deletion are not wired yet" contact={site.contact.privacyEmail}>
        <p>
          The rights-request form on the public site is live and routes to the trustee
          responsible, with the statutory clocks calculated automatically. One-click export from
          inside the account arrives with the database.
        </p>
      </Placeholder>

      <Card className="bg-surface-raised p-6">
        <h2 className="text-lg">Read the full policy</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href={localePath(locale, "/legal/privacy")} variant="secondary" size="sm">
            {dict.legal.privacy}
          </ButtonLink>
          <ButtonLink
            href={localePath(locale, "/legal/privacy-choices")}
            variant="secondary"
            size="sm"
          >
            {dict.legal.privacyChoices}
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
