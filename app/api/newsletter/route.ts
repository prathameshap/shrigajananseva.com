import { NextResponse } from "next/server";
import { site } from "@/lib/content";
import { deliver, mailtoFallback } from "@/lib/mailer";
import { cleanText, isEmail, looksLikeSpam } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  // Bots get a cheerful 200 — telling them they were caught only helps them.
  if (looksLikeSpam(payload)) {
    return NextResponse.json({ ok: true });
  }

  if (!isEmail(payload.email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  if (payload.consent !== true) {
    return NextResponse.json(
      { ok: false, message: "Consent is required before we can email you." },
      { status: 422 },
    );
  }

  const email = payload.email.trim().toLowerCase();
  const name = cleanText(payload.name, 120);
  const locale = payload.locale === "mr" ? "mr" : "en";

  const subject = `Newsletter signup — ${email}`;
  const body = [
    `Email: ${email}`,
    name ? `Name: ${name}` : null,
    `Preferred language: ${locale}`,
    `Consent given: yes`,
    `Consent recorded at: ${new Date().toISOString()}`,
    "",
    "Double opt-in: send this address a confirmation link before adding them to the list.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await deliver({
    kind: "newsletter",
    to: site.contact.newsletterEmail,
    subject,
    body,
    replyTo: email,
    fields: { email, name, locale, consent: true, consentAt: new Date().toISOString() },
  });

  if (!result.configured) {
    return NextResponse.json({
      ok: false,
      reason: "not_configured",
      mailto: mailtoFallback(
        site.contact.newsletterEmail,
        "Please add me to the newsletter",
        `Please add ${email} to the monthly newsletter list.\n\n${name ? `Name: ${name}\n` : ""}I consent to receiving the newsletter and understand I can unsubscribe at any time.`,
      ),
    });
  }

  if (!result.ok) {
    console.error("[newsletter] delivery failed:", result.error);
    return NextResponse.json(
      { ok: false, message: "We could not complete that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
