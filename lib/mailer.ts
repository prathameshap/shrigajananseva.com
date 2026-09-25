/**
 * Outbound delivery for the two public forms.
 *
 * Nothing is hard-wired to a vendor. Whichever of these is configured wins:
 *
 *   FORM_WEBHOOK_URL   POST the submission as JSON (Zapier, Make, n8n, a
 *                      Google Apps Script — whatever the trustees already use)
 *   RESEND_API_KEY     send the submission as an email via Resend
 *
 * With neither set, `deliver` reports `configured: false` and the caller hands
 * the visitor a pre-filled mailto instead. That keeps the form honest: it never
 * claims to have sent something that went nowhere.
 */

export type Delivery =
  | { configured: false }
  | { configured: true; ok: true }
  | { configured: true; ok: false; error: string };

export type Submission = {
  kind: "newsletter" | "contact";
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  fields: Record<string, unknown>;
};

export function isDeliveryConfigured(): boolean {
  return Boolean(process.env.FORM_WEBHOOK_URL || process.env.RESEND_API_KEY);
}

export async function deliver(submission: Submission): Promise<Delivery> {
  const webhook = process.env.FORM_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: submission.kind,
          subject: submission.subject,
          receivedAt: new Date().toISOString(),
          ...submission.fields,
        }),
      });
      return response.ok
        ? { configured: true, ok: true }
        : { configured: true, ok: false, error: `Webhook responded ${response.status}` };
    } catch (error) {
      return { configured: true, ok: false, error: String(error) };
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.RESEND_FROM ?? "website@shrigajananseva.org";
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [submission.to],
          subject: submission.subject,
          text: submission.body,
          reply_to: submission.replyTo,
        }),
      });
      return response.ok
        ? { configured: true, ok: true }
        : { configured: true, ok: false, error: `Resend responded ${response.status}` };
    } catch (error) {
      return { configured: true, ok: false, error: String(error) };
    }
  }

  return { configured: false };
}

/** A pre-filled mailto used as the fallback when nothing is configured. */
export function mailtoFallback(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
