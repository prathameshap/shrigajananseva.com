"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, Card, cx } from "@/components/ui";

export type BuilderFund = {
  slug: string;
  title: string;
  description: string;
  suggested: { amount: number; impact: string }[];
};

export type BuilderLabels = {
  chooseFund: string;
  chooseAmount: string;
  otherAmount: string;
  frequency: string;
  oneTime: string;
  monthly: string;
  quarterly: string;
  annual: string;
  coverFees: string;
  coverFeesNote: string;
  continueToPayment: string;
  total: string;
};

type Frequency = "one-time" | "monthly" | "quarterly" | "annual";

/**
 * Typical US card processing: 2.9% of the charge plus 30c, and the fee is
 * charged on the grossed-up total, so recovering it in full means solving
 * for it rather than simply adding 2.9%.
 */
const FEE_RATE = 0.029;
const FEE_FIXED = 0.3;

function grossUp(amount: number): number {
  const total = (amount + FEE_FIXED) / (1 - FEE_RATE);
  return Math.round(total * 100) / 100;
}

/**
 * Builds the gift, then hands it to the payment page as query parameters.
 *
 * No processor is connected yet, so "continue" lands on an honest interim
 * page rather than a broken checkout. The selection is carried across intact,
 * so when a processor is wired up nothing here changes.
 */
export function DonationBuilder({
  funds,
  labels,
  continueHref,
}: {
  funds: BuilderFund[];
  labels: BuilderLabels;
  continueHref: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFund = searchParams.get("fund");
  const [fundSlug, setFundSlug] = useState(
    funds.some((fund) => fund.slug === initialFund) ? (initialFund as string) : funds[0].slug,
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [coverFees, setCoverFees] = useState(true);

  const fund = useMemo(
    () => funds.find((item) => item.slug === fundSlug) ?? funds[0],
    [funds, fundSlug],
  );

  // Selecting a different fund clears an amount that came from the previous
  // fund's suggestions — carrying it over would attach the wrong impact line.
  useEffect(() => {
    setAmount(null);
    setCustom("");
  }, [fundSlug]);

  const effective = amount ?? (custom ? Number(custom) : 0);
  const valid = Number.isFinite(effective) && effective >= 1;
  const total = valid && coverFees ? grossUp(effective) : effective;
  const feeAmount = Math.round((total - effective) * 100) / 100;

  function onContinue() {
    const query = new URLSearchParams({
      fund: fundSlug,
      amount: String(effective),
      frequency,
      coverFees: String(coverFees),
    });
    router.push(`${continueHref}?${query.toString()}`);
  }

  const frequencies: { value: Frequency; label: string }[] = [
    { value: "one-time", label: labels.oneTime },
    { value: "monthly", label: labels.monthly },
    { value: "quarterly", label: labels.quarterly },
    { value: "annual", label: labels.annual },
  ];

  return (
    <Card className="p-6 sm:p-8">
      {/* Fund */}
      <fieldset>
        <legend className="text-lg font-semibold text-heading">{labels.chooseFund}</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {funds.map((item) => (
            <label
              key={item.slug}
              className={cx(
                "cursor-pointer rounded-xl border p-4 transition-colors",
                item.slug === fundSlug
                  ? "border-kumkum-600 bg-brand-soft"
                  : "border-hairline hover:border-gold-400 hover:bg-surface-raised",
              )}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="fund"
                  value={item.slug}
                  checked={item.slug === fundSlug}
                  onChange={() => setFundSlug(item.slug)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--sgs-brand)]"
                />
                <span className="font-semibold text-heading">{item.title}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{fund.description}</p>
      </fieldset>

      {/* Frequency */}
      <fieldset className="mt-8">
        <legend className="text-lg font-semibold text-heading">{labels.frequency}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {frequencies.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFrequency(option.value)}
              aria-pressed={frequency === option.value}
              className={cx(
                "rounded-full border px-5 py-2.5 font-semibold transition-colors",
                frequency === option.value
                  ? "border-kumkum-700 bg-kumkum-700 text-sandal-50"
                  : "border-hairline text-body hover:border-gold-400 hover:bg-surface-raised",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Amount */}
      <fieldset className="mt-8">
        <legend className="text-lg font-semibold text-heading">{labels.chooseAmount}</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {fund.suggested.map((option) => (
            <button
              key={option.amount}
              type="button"
              onClick={() => {
                setAmount(option.amount);
                setCustom("");
              }}
              aria-pressed={amount === option.amount}
              className={cx(
                "rounded-xl border p-4 text-left transition-colors",
                amount === option.amount
                  ? "border-kumkum-600 bg-brand-soft"
                  : "border-hairline hover:border-gold-400 hover:bg-surface-raised",
              )}
            >
              <span className="block font-display text-2xl text-heading">${option.amount}</span>
              <span className="mt-0.5 block text-sm text-muted">{option.impact}</span>
            </button>
          ))}
        </div>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="font-semibold text-heading">{labels.otherAmount}</span>
          <span className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-muted">
              $
            </span>
            <input
              type="number"
              min={1}
              step={1}
              inputMode="decimal"
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value);
                setAmount(null);
              }}
              className="w-full rounded-xl border border-hairline bg-surface py-2.5 pr-4 pl-9 text-body"
              placeholder="0"
            />
          </span>
        </label>
      </fieldset>

      {/* Fees */}
      <label className="mt-8 flex items-start gap-3 rounded-xl bg-surface-raised p-4">
        <input
          type="checkbox"
          checked={coverFees}
          onChange={(event) => setCoverFees(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--sgs-brand)]"
        />
        <span>
          <span className="font-semibold text-heading">
            {labels.coverFees.replace("{amount}", valid ? `$${feeAmount.toFixed(2)}` : "the fee")}
          </span>
          <span className="mt-0.5 block text-sm text-muted">{labels.coverFeesNote}</span>
        </span>
      </label>

      {/* Total + continue */}
      <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-muted uppercase">
            {labels.total}
          </p>
          <p className="font-display text-3xl text-heading">
            ${valid ? total.toFixed(2) : "0.00"}
            {frequency !== "one-time" ? (
              <span className="ml-1 font-sans text-base font-normal text-muted">
                /{" "}
                {frequency === "monthly"
                  ? labels.monthly.toLowerCase()
                  : frequency === "quarterly"
                    ? labels.quarterly.toLowerCase()
                    : labels.annual.toLowerCase()}
              </span>
            ) : null}
          </p>
        </div>

        <Button size="lg" onClick={onContinue} disabled={!valid}>
          <Icon.Heart className="h-5 w-5" />
          {labels.continueToPayment}
        </Button>
      </div>
    </Card>
  );
}
