"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Button, cx } from "@/components/ui";
import { getDictionary, type Locale } from "@/lib/i18n";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string }
  | { kind: "fallback"; mailto: string };

/**
 * Double opt-in newsletter signup.
 *
 * Consent is explicit and recorded with the submission — the old site's
 * "email us to subscribe" left no consent record and no way to unsubscribe.
 *
 * Until a mail provider is configured the route replies with a mailto
 * fallback, which we surface as a real button rather than pretending the
 * subscription succeeded.
 */
export function NewsletterForm({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const dict = getDictionary(locale);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!data.get("consent")) {
      setStatus({ kind: "error", message: dict.connect.consentRequired });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          name: data.get("name") ?? "",
          locale,
          consent: true,
          // Honeypot: a real person leaves this hidden field empty.
          company: data.get("company") ?? "",
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
        setStatus({ kind: "error", message: result.message ?? dict.connect.subscribeError });
      }
    } catch {
      setStatus({ kind: "error", message: dict.connect.subscribeError });
    }
  }

  if (status.kind === "ok") {
    return (
      <p className="flex items-start gap-2 rounded-card border border-tulsi-100 bg-tulsi-50 p-4 text-tulsi-700">
        <Icon.Check className="mt-0.5 h-5 w-5 shrink-0" />
        {dict.connect.subscribeSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className={cx("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col")}>
        {!compact ? (
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-heading">{dict.connect.nameLabel}</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder={dict.connect.namePlaceholder}
              className="rounded-full border border-hairline bg-surface px-4 py-2.5 text-body placeholder:text-ink-400"
            />
          </label>
        ) : null}

        <label className={cx("flex flex-col gap-1.5", compact && "flex-1")}>
          <span className={cx("font-semibold text-heading", compact && "sr-only")}>
            {dict.connect.emailLabel}
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={dict.connect.emailPlaceholder}
            className="w-full rounded-full border border-hairline bg-surface px-4 py-2.5 text-body placeholder:text-ink-400"
          />
        </label>

        {compact ? (
          <Button type="submit" disabled={status.kind === "sending"} className="shrink-0">
            {status.kind === "sending" ? dict.common.loading : dict.connect.subscribeCta}
          </Button>
        ) : null}
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-muted">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--sgs-brand)]"
        />
        <span>{dict.connect.consentLabel}</span>
      </label>

      {!compact ? (
        <Button type="submit" disabled={status.kind === "sending"} className="self-start">
          {status.kind === "sending" ? dict.common.loading : dict.connect.subscribeCta}
        </Button>
      ) : null}

      {status.kind === "error" ? (
        <p role="alert" className="text-sm font-semibold text-kumkum-600">
          {status.message}
        </p>
      ) : null}

      {status.kind === "fallback" ? (
        <p className="rounded-card border border-hairline bg-surface-raised p-3 text-sm text-muted">
          Our mailing system is not connected yet.{" "}
          <a className="font-semibold text-accent underline underline-offset-2" href={status.mailto}>
            Send us a one-line email instead
          </a>{" "}
          and a volunteer will add you to the list.
        </p>
      ) : null}
    </form>
  );
}
