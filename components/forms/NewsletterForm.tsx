"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { Alert, Button, Checkbox, Field, Honeypot, Input } from "@/components/ui";

export type NewsletterLabels = {
  emailLabel: string;
  nameLabel: string;
  consent: string;
  consentNote: string;
  cta: string;
  sending: string;
  thanksTitle: string;
  thanksBody: string;
  required: string;
  invalidEmail: string;
  genericError: string;
  honeypotLabel: string;
  optional: string;
  mailtoFallback: string;
};

type State = "idle" | "sending" | "done" | "error" | "unconfigured";

export function NewsletterForm({
  labels,
  fallbackEmail,
}: {
  labels: NewsletterLabels;
  fallbackEmail: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  // Used by the spam check in lib/validate.ts: a submission faster than a
  // person can physically type is a script.
  const openedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    if (!email) {
      setError(labels.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError(labels.invalidEmail);
      return;
    }

    setError(null);
    setState("sending");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: String(form.get("name") ?? "").trim(),
          company: String(form.get("company") ?? ""),
          elapsedMs: Date.now() - openedAt.current,
        }),
      });

      if (response.status === 501) {
        setState("unconfigured");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      setState("done");
    } catch {
      setState("error");
      setError(labels.genericError);
    }
  }

  if (state === "done") {
    return (
      <Alert tone="success" title={labels.thanksTitle}>
        <p>{labels.thanksBody}</p>
      </Alert>
    );
  }

  if (state === "unconfigured") {
    return (
      <Alert tone="info" title={labels.thanksTitle}>
        <p>
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={`mailto:${fallbackEmail}?subject=${encodeURIComponent("Newsletter signup")}`}
          >
            {labels.mailtoFallback}
          </a>
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
      <Honeypot label={labels.honeypotLabel} />

      <Field label={labels.nameLabel} htmlFor="newsletter-name" hint={labels.optional}>
        <Input id="newsletter-name" name="name" autoComplete="name" />
      </Field>

      <Field
        label={labels.emailLabel}
        htmlFor="newsletter-email"
        required
        error={error ?? undefined}
      >
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-email-error" : undefined}
        />
      </Field>

      <Checkbox id="newsletter-consent" name="consent" label={labels.consent} required />

      <Button type="submit" disabled={state === "sending"} className="self-start">
        <Icon.Mail className="h-5 w-5" />
        {state === "sending" ? labels.sending : labels.cta}
      </Button>

      <p className="text-sm text-muted">{labels.consentNote}</p>
    </form>
  );
}
