import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonLink, Card, Container, GoldRule, Section } from "@/components/ui";
import { getFund, givingMethods, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { crumbs, resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.donate.onlineUnavailable,
    description: dict.donate.onlineUnavailableBody,
    // Nothing to index until a processor is connected.
    robots: { index: false, follow: true },
  };
}

/**
 * The payment step.
 *
 * No processor is connected, so rather than a broken checkout this page tells
 * the donor plainly what has happened, carries their selection through, and
 * hands them a zero-fee route with the amount already filled in. When a
 * processor is wired up, the Checkout redirect replaces the body of this page
 * and every link into it keeps working unchanged.
 */
export default async function DonateOnlinePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await resolveLocale(params);
  const query = await searchParams;
  const dict = getDictionary(locale);

  const read = (key: string) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const fund = getFund(read("fund") ?? "general");
  const amount = Number(read("amount") ?? 0);
  const frequency = read("frequency") ?? "one-time";
  const hasSelection = Number.isFinite(amount) && amount > 0;

  const frequencyLabel =
    frequency === "monthly"
      ? dict.donate.monthly
      : frequency === "quarterly"
        ? dict.donate.quarterly
        : frequency === "annual"
          ? dict.donate.annual
          : dict.donate.oneTime;

  const subject = `Donation — ${fund ? t(fund.title, locale) : "general"}${hasSelection ? ` — $${amount}` : ""}`;
  const mailBody = [
    "I would like to make a donation.",
    "",
    fund ? `Fund: ${t(fund.title, locale)}` : null,
    hasSelection ? `Amount: $${amount}` : null,
    `Frequency: ${frequencyLabel}`,
    "",
    "Please send me the details for Zelle / check.",
  ]
    .filter(Boolean)
    .join("\n");

  const zeroFee = givingMethods.filter((method) => method.recommended);

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.donate}
        title={dict.donate.onlineUnavailable}
        description={dict.donate.onlineUnavailableBody}
        crumbs={crumbs(
          locale,
          ["nav.donate", "/donate"],
          [dict.donate.continueToPayment, "/donate/online"],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
      />

      <Container width="narrow">
        <div className="py-14">
          {/* What they chose */}
          {hasSelection && fund ? (
            <Card className="p-7">
              <h2 className="text-lg">Your gift</h2>
              <GoldRule className="mt-3 mb-5 max-w-24" />
              <dl className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
                  <dt className="text-muted">{dict.donate.chooseFund}</dt>
                  <dd className="font-semibold text-heading">{t(fund.title, locale)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
                  <dt className="text-muted">{dict.donate.frequency}</dt>
                  <dd className="font-semibold text-heading">{frequencyLabel}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">{dict.donate.chooseAmount}</dt>
                  <dd className="font-display text-2xl text-heading">${amount}</dd>
                </div>
              </dl>
              <p className="mt-5 text-sm text-muted">
                Nothing has been charged. This selection is only being carried across so you do
                not have to type it again.
              </p>
            </Card>
          ) : null}

          {/* The honest part */}
          <Card className="mt-6 border-gold-400 bg-accent-soft p-7">
            <h2 className="flex items-center gap-2 text-xl">
              <Icon.Info className="h-6 w-6 text-accent" />
              Card and ACH giving is not live yet
            </h2>
            <p className="mt-4 text-body">
              Shri Gajanan Seva has not yet completed setup with a payment processor, so there is
              no card form to show you. We would rather say that plainly than present a checkout
              that cannot take your gift.
            </p>
            <p className="mt-3 text-body">
              In the meantime Zelle and check reach the seva with{" "}
              <strong>no processing fee at all</strong> — which means more of your gift arrives
              than a card would have delivered anyway.
            </p>
          </Card>

          {/* Zero-fee routes */}
          <div className="mt-10">
            <h2 className="text-2xl">{dict.donate.otherWays}</h2>
            <GoldRule className="mt-3 mb-6 max-w-32" />

            <div className="grid gap-5 sm:grid-cols-2">
              {zeroFee.map((method) => (
                <Card key={method.id} className="p-6">
                  <h3 className="text-lg">{t(method.title, locale)}</h3>
                  {method.handle ? (
                    <p className="mt-2">
                      <span className="block text-sm font-semibold tracking-wide text-muted uppercase">
                        {t(method.handleLabel, locale)}
                      </span>
                      <span className="mt-0.5 block font-display text-xl text-heading">
                        {method.handle}
                      </span>
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm text-muted">{t(method.instructions, locale)}</p>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink
                href={`mailto:${site.contact.charityEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`}
                size="lg"
              >
                <Icon.Mail className="h-5 w-5" />
                Email the treasurer
              </ButtonLink>
              <ButtonLink href={localePath(locale, "/donate")} variant="secondary" size="lg">
                Back to giving options
              </ButtonLink>
            </div>
          </div>

          {/* For whoever wires this up */}
          <Section tone="canvas" className="mt-4 px-0 py-0">
            <details className="rounded-card border border-dashed border-hairline p-6">
              <summary className="cursor-pointer font-semibold text-heading">
                For the developer connecting a processor
              </summary>
              <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
                <p>
                  This page already receives everything a checkout session needs, as query
                  parameters:{" "}
                  <code className="rounded bg-surface-raised px-1.5 py-0.5">fund</code>,{" "}
                  <code className="rounded bg-surface-raised px-1.5 py-0.5">amount</code>,{" "}
                  <code className="rounded bg-surface-raised px-1.5 py-0.5">frequency</code> and{" "}
                  <code className="rounded bg-surface-raised px-1.5 py-0.5">coverFees</code>.
                </p>
                <p>
                  To go live: add a checkout route that reads those four values, create the
                  session, and redirect. Replace the notice above with the redirect. Nothing else
                  on the site needs to change —{" "}
                  <code className="rounded bg-surface-raised px-1.5 py-0.5">DonationBuilder</code>{" "}
                  already computes the grossed-up total correctly for a 2.9% + $0.30 fee
                  structure.
                </p>
                <p>
                  Recurring frequencies map to subscription intervals; one-time maps to a single
                  payment. The fund slug should travel as metadata so the treasurer&apos;s ledger
                  can allocate it without manual matching.
                </p>
              </div>
            </details>
          </Section>
        </div>
      </Container>
    </>
  );
}
