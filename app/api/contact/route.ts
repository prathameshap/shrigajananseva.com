import { site } from "@/lib/content";
import { deliver } from "@/lib/mailer";
import { cleanText, isEmail, looksLikeSpam } from "@/lib/validate";

const SUBJECTS = new Set(["general", "visit", "seva", "donation", "privacy", "other"]);

/**
 * The contact form.
 *
 * A privacy-related message is routed to the privacy mailbox rather than the
 * general one, because the CPRA clock starts when it arrives and it must not
 * sit in a shared inbox behind questions about parking.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  if (looksLikeSpam(payload)) {
    return Response.json({ ok: true }, { status: 202 });
  }

  const name = cleanText(payload.name, 120);
  const email = cleanText(payload.email, 254);
  const phone = cleanText(payload.phone, 40);
  const message = cleanText(payload.message, 5000);
  const rawSubject = cleanText(payload.subject, 40);
  const subject = SUBJECTS.has(rawSubject) ? rawSubject : "general";

  if (!name || !isEmail(email) || message.length < 10) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 422 });
  }

  const to = subject === "privacy" ? site.contact.privacyEmail : site.contact.email;

  const result = await deliver({
    kind: "contact",
    to,
    subject:
      subject === "privacy"
        ? `Privacy request — ${name}`
        : `Website enquiry (${subject}) — ${name}`,
    body: [
      `From: ${name} <${email}>`,
      phone ? `Phone: ${phone}` : "Phone: not given",
      `Topic: ${subject}`,
      "",
      message,
    ].join("\n"),
    replyTo: email,
    fields: { name, email, phone, subject, message },
  });

  if (!result.configured) {
    return Response.json({ error: "Delivery not configured" }, { status: 501 });
  }
  if (!result.ok) {
    console.error("[contact] delivery failed:", result.error);
    return Response.json({ error: "Delivery failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
