import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { Badge, ButtonLink, Card, GoldRule, Placeholder, Stat } from "@/components/ui";
import { getFund, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { portal, getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.giving, robots: { index: false, follow: false } };
}

const METHOD_LABEL = {
  zelle: "Zelle",
  check: "Check",
  venmo: "Venmo",
  card: "Card",
  cash: "Cash",
  "in-kind": "In kind",
} as const;

export default async function GivingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const [donations, recurring] = await Promise.all([
    portal.listDonations(session.id),
    portal.listRecurringGifts(session.id),
  ]);

  const years = [...new Set(donations.map((d) => new Date(d.date).getFullYear()))].sort(
    (a, b) => b - a,
  );
  const lifetime = donations.reduce((sum, d) => sum + d.amount, 0);
  const thisYear = new Date().getFullYear();
  const currentYearTotal = donations
    .filter((d) => new Date(d.date).getFullYear() === thisYear)
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">{dict.portal.giving}</h1>
        <GoldRule className="mt-4 max-w-24" />
      </header>

      <Card className="p-7">
        <div className="grid gap-8 sm:grid-cols-3">
          <Stat value={`$${currentYearTotal.toLocaleString("en-US")}`} label={`${thisYear}`} />
          <Stat value={`$${lifetime.toLocaleString("en-US")}`} label="Lifetime" />
          <Stat value={donations.length} label="Gifts recorded" />
        </div>
      </Card>

      {/* Recurring */}
      <section>
        <h2 className="mb-4 text-2xl">{dict.portal.recurringGifts}</h2>
        {recurring.length ? (
          <div className="flex flex-col gap-4">
            {recurring.map((gift) => {
              const fund = getFund(gift.fundSlug);
              return (
                <Card key={gift.id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={gift.active ? "success" : "neutral"}>
                          {gift.active ? "Active" : "Paused"}
                        </Badge>
                        <Badge tone="neutral">{gift.frequency}</Badge>
                      </div>
                      <p className="mt-3 font-display text-2xl text-heading">
                        ${gift.amount}
                        <span className="ml-1 font-sans text-base font-normal text-muted">
                          / {gift.frequency}
                        </span>
                      </p>
                      <p className="mt-1 text-muted">
                        {fund ? t(fund.title, locale) : gift.fundSlug} · next on{" "}
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
                          new Date(gift.nextChargeOn),
                        )}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-muted italic">
                      Managing recurring gifts needs a processor
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-muted">No recurring gifts set up.</Card>
        )}
      </section>

      {/* History */}
      <section>
        <h2 className="mb-4 text-2xl">History</h2>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <caption className="sr-only">Donation history with receipts</caption>
            <thead className="border-b border-hairline bg-surface-raised">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold text-heading">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-heading">
                  Fund
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-heading">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-right font-semibold text-heading">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-heading">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {donations.map((donation) => {
                const fund = getFund(donation.fundSlug);
                return (
                  <tr key={donation.id}>
                    <td className="px-6 py-3.5 whitespace-nowrap text-muted">
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                        new Date(donation.date),
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-body">
                      {fund ? t(fund.title, locale) : donation.fundSlug}
                    </td>
                    <td className="px-6 py-3.5 text-muted">{METHOD_LABEL[donation.method]}</td>
                    <td className="px-6 py-3.5 text-right font-semibold text-heading tabular-nums">
                      ${donation.amount}
                    </td>
                    <td className="px-6 py-3.5">
                      {donation.receiptUrl ? (
                        <a
                          className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
                          href={donation.receiptUrl}
                        >
                          <Icon.Download className="h-4 w-4" />
                          {donation.receiptNumber}
                        </a>
                      ) : (
                        <span className="font-mono text-sm text-muted">
                          {donation.receiptNumber}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </section>

      {/* Tax statement */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg">{dict.portal.annualStatement}</h2>
          <p className="mt-2 text-muted">
            A single consolidated statement per tax year, covering every gift in that year.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {years.map((year) => (
              <span
                key={year}
                className="rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-muted"
              >
                {year} — not generated yet
              </span>
            ))}
          </div>
        </Card>

        <Card className="bg-surface-raised p-6">
          <h2 className="text-lg">Make another gift</h2>
          <p className="mt-2 text-muted">
            Zelle and check reach the seva with no processing fee at all.
          </p>
          <ButtonLink href={localePath(locale, "/donate")} className="mt-5">
            <Icon.Heart className="h-4 w-4" />
            {dict.nav.donate}
          </ButtonLink>
        </Card>
      </section>

      <Placeholder title="Receipts and statements need the treasurer's ledger" contact={site.contact.charityEmail}>
        <p>
          Receipt PDFs and consolidated annual statements are generated from the donation ledger,
          which lives in the admin console phase. Until then, email the treasurer and a receipt
          will be issued manually.
        </p>
      </Placeholder>
    </div>
  );
}
