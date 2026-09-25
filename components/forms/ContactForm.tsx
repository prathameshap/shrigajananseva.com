"use client";

import { useRef, useState } from "react";
<<<<<<< HEAD

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
=======
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";
import { getDictionary, type Locale } from "@/lib/i18n";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string }
  | { kind: "fallback"; mailto: string };

const SUBJECTS = [
  "General enquiry",
  "Visiting for the first time",
  "Donation or receipt",
  "Volunteering",
  "Student service hours",
  "Shrungar Seva or sponsorship",
  "Press or partnership",
] as const;

/**
 * The old contact page had no form at all — only an address and a phone
 * number. This is the replacement.
 *
 * Spam protection is deliberately invisible: a honeypot field plus a minimum
 * fill time. No CAPTCHA, because a CAPTCHA in front of a mandir's contact form
 * excludes exactly the elderly devotees most likely to need it.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  const openedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
<<<<<<< HEAD
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
=======
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "sending" });
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
<<<<<<< HEAD
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
=======
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          locale,
          company: data.get("company") ?? "",
          elapsedMs: Date.now() - openedAt.current,
        }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        reason?: string;
        mailto?: string;
        message?: string;
      };

      if (result.ok) {
        setStatus({ kind: "ok" });
        form.reset();
      } else if (result.reason === "not_configured" && result.mailto) {
        setStatus({ kind: "fallback", mailto: result.mailto });
      } else {
        setStatus({ kind: "error", message: result.message ?? dict.connect.contactError });
      }
    } catch {
      setStatus({ kind: "error", message: dict.connect.contactError });
    }
  }

  if (status.kind === "ok") {
    return (
      <p className="flex items-start gap-2 rounded-card border border-tulsi-100 bg-tulsi-50 p-5 text-tulsi-700">
        <Icon.Check className="mt-0.5 h-5 w-5 shrink-0" />
        {dict.connect.contactSuccess}
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-hairline bg-surface px-4 py-2.5 text-body placeholder:text-ink-400";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold text-heading">{dict.connect.nameLabel}</span>
          <input name="name" type="text" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold text-heading">{dict.connect.emailLabel}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={dict.connect.emailPlaceholder}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-heading">{dict.connect.subjectLabel}</span>
        <select name="subject" className={fieldClass} defaultValue={SUBJECTS[0]}>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-heading">{dict.connect.messageLabel}</span>
        <textarea name="message" required rows={6} className={fieldClass} />
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={status.kind === "sending"} className="self-start">
        {status.kind === "sending" ? dict.common.loading : dict.common.submit}
      </Button>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm font-semibold text-kumkum-600">
          {status.message}
        </p>
      ) : null}

      {status.kind === "fallback" ? (
        <p className="rounded-card border border-hairline bg-surface-raised p-4 text-sm text-muted">
          Our message delivery is not connected yet.{" "}
          <a className="font-semibold text-accent underline underline-offset-2" href={status.mailto}>
            Open this message in your email app
          </a>{" "}
          — it is pre-filled and ready to send.
        </p>
      ) : null}
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
    </form>
  );
}
