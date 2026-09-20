"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, Card } from "@/components/ui";
import type { Locale } from "@/lib/i18n";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; reference: string }
  | { kind: "error"; message: string }
  | { kind: "fallback"; mailto: string };

const RIGHTS = [
  { value: "know", label: "Know what you hold about me" },
  { value: "access", label: "Send me a copy of my data" },
  { value: "correct", label: "Correct something that is wrong" },
  { value: "delete", label: "Delete my personal information" },
  { value: "optout", label: "Opt out of sale or sharing" },
] as const;

/**
 * CCPA/CPRA rights request intake.
 *
 * Required by statute, and absent from the current site entirely. The
 * acknowledgement deliberately quotes the statutory clocks back to the
 * requester — 10 business days to acknowledge, 45 calendar days to respond —
 * so they know what to hold us to.
 */
export function PrivacyRequestForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const openedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const rights = RIGHTS.filter((right) => data.get(`right-${right.value}`)).map(
      (right) => right.value,
    );

    if (rights.length === 0) {
      setStatus({ kind: "error", message: "Please select at least one request." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          rights,
          details: data.get("details") ?? "",
          agent: Boolean(data.get("agent")),
          locale,
          company: data.get("company") ?? "",
          elapsedMs: Date.now() - openedAt.current,
        }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        reference?: string;
        reason?: string;
        mailto?: string;
        message?: string;
      };

      if (result.ok && result.reference) {
        setStatus({ kind: "ok", reference: result.reference });
        form.reset();
      } else if (result.reason === "not_configured" && result.mailto) {
        setStatus({ kind: "fallback", mailto: result.mailto });
      } else {
        setStatus({
          kind: "error",
          message: result.message ?? "We could not submit that just now.",
        });
      }
    } catch {
      setStatus({ kind: "error", message: "We could not submit that just now." });
    }
  }

  if (status.kind === "ok") {
    return (
      <Card className="border-tulsi-100 bg-tulsi-50 p-6">
        <p className="flex items-start gap-2 font-semibold text-tulsi-700">
          <Icon.Check className="mt-0.5 h-5 w-5 shrink-0" />
          Your request has been logged.
        </p>
        <p className="mt-3 text-tulsi-700">
          Your reference is{" "}
          <strong className="font-mono tracking-tight">{status.reference}</strong>. Keep it — it
          is how we will identify your request.
        </p>
        <p className="mt-3 text-sm text-tulsi-700">
          We will acknowledge within 10 business days and respond within 45 calendar days. If the
          request is complex we may extend once by a further 45 days, and we will tell you before
          we do.
        </p>
      </Card>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-hairline bg-surface px-4 py-2.5 text-body placeholder:text-ink-400";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold text-heading">Your name</span>
          <input name="name" type="text" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold text-heading">
            Email address we are likely to hold for you
          </span>
          <input name="email" type="email" required autoComplete="email" className={fieldClass} />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-1.5 font-semibold text-heading">
          What would you like us to do?
        </legend>
        {RIGHTS.map((right) => (
          <label key={right.value} className="flex items-start gap-2.5 text-body">
            <input
              name={`right-${right.value}`}
              type="checkbox"
              className="mt-1.5 h-4 w-4 shrink-0 accent-[var(--sgs-brand)]"
            />
            <span>{right.label}</span>
          </label>
        ))}
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-heading">
          Anything that will help us find your records{" "}
          <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          name="details"
          rows={4}
          className={fieldClass}
          placeholder="Other email addresses you may have used, roughly when you last attended, and so on."
        />
      </label>

      <label className="flex items-start gap-2.5 text-body">
        <input
          name="agent"
          type="checkbox"
          className="mt-1.5 h-4 w-4 shrink-0 accent-[var(--sgs-brand)]"
        />
        <span>
          I am an authorised agent acting on someone else&apos;s behalf.
          <span className="mt-0.5 block text-sm text-muted">
            We will ask for written proof of the authorisation.
          </span>
        </span>
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={status.kind === "sending"} className="self-start">
        {status.kind === "sending" ? "Submitting…" : "Submit request"}
      </Button>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm font-semibold text-kumkum-600">
          {status.message}
        </p>
      ) : null}

      {status.kind === "fallback" ? (
        <p className="rounded-card border border-hairline bg-surface-raised p-4 text-sm text-muted">
          Our request queue is not connected yet.{" "}
          <a className="font-semibold text-accent underline underline-offset-2" href={status.mailto}>
            Send this request by email instead
          </a>{" "}
          — it is pre-filled, and the statutory response times apply from the moment you send it.
        </p>
      ) : null}
    </form>
  );
}
