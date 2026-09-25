"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { Alert, Button, Field, Honeypot, Input, Select, Textarea } from "@/components/ui";

export type ContactLabels = {
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  subjectLabel: string;
  messageLabel: string;
  send: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
  failedTitle: string;
  failedBody: string;
  mailtoFallback: string;
  required: string;
  invalidEmail: string;
  tooShort: string;
  honeypotLabel: string;
  optional: string;
  privacyNote: string;
  subjects: { value: string; label: string }[];
};

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type State = "idle" | "sending" | "done" | "failed" | "unconfigured";

export function ContactForm({
  labels,
  fallbackEmail,
}: {
  labels: ContactLabels;
  fallbackEmail: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const openedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = labels.required;
    if (!email) next.email = labels.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = labels.invalidEmail;
    if (message.length < 10) next.message = labels.tooShort;

    setErrors(next);
    if (Object.keys(next).length) return;

    setState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          phone: String(form.get("phone") ?? "").trim(),
          subject: String(form.get("subject") ?? "general"),
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
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <Alert tone="success" title={labels.sentTitle}>
        <p>{labels.sentBody}</p>
      </Alert>
    );
  }

  if (state === "failed" || state === "unconfigured") {
    return (
      <Alert tone="warning" title={labels.failedTitle}>
        <p>{labels.failedBody}</p>
        <p className="mt-2">
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={`mailto:${fallbackEmail}`}
          >
            {labels.mailtoFallback} — {fallbackEmail}
          </a>
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5">
      <Honeypot label={labels.honeypotLabel} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={labels.nameLabel}
          htmlFor="contact-name"
          required
          error={errors.name}
        >
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
        </Field>

        <Field
          label={labels.emailLabel}
          htmlFor="contact-email"
          required
          error={errors.email}
        >
          <Input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
        </Field>

        <Field label={labels.phoneLabel} htmlFor="contact-phone" hint={labels.optional}>
          <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
        </Field>

        <Field label={labels.subjectLabel} htmlFor="contact-subject">
          <Select id="contact-subject" name="subject" defaultValue="general">
            {labels.subjects.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label={labels.messageLabel}
        htmlFor="contact-message"
        required
        error={errors.message}
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={state === "sending"}>
          <Icon.Mail className="h-5 w-5" />
          {state === "sending" ? labels.sending : labels.send}
        </Button>
        <p className="text-sm text-muted">{labels.privacyNote}</p>
      </div>
    </form>
  );
}
