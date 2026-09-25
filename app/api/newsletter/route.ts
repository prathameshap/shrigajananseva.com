<<<<<<< HEAD
import { site } from "@/lib/content";
import { deliver } from "@/lib/mailer";
import { cleanText, isEmail, looksLikeSpam } from "@/lib/validate";

/**
 * Newsletter signup.
 *
 * Returns 501 when no delivery channel is configured, which the form treats as
 * "show the visitor a pre-filled mailto instead". It never returns 200 for a
 * submission that went nowhere — a signup form that silently discards
 * addresses is worse than no form.
 */
=======
import { NextResponse } from "next/server";
import { site } from "@/lib/content";
import { deliver, mailtoFallback } from "@/lib/mailer";
import { cleanText, isEmail, looksLikeSpam } from "@/lib/validate";

export const runtime = "nodejs";

>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
<<<<<<< HEAD
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  // Answer a bot exactly as we answer a person. Telling it which check it
  // failed is free tuning information for whoever wrote it.
  if (looksLikeSpam(payload)) {
    return Response.json({ ok: true }, { status: 202 });
  }

  const email = cleanText(payload.email, 254);
  if (!isEmail(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 422 });
  }

  const name = cleanText(payload.name, 120);
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f

  const result = await deliver({
    kind: "newsletter",
    to: site.contact.newsletterEmail,
<<<<<<< HEAD
    subject: `Newsletter signup — ${email}`,
    body: [
      "A newsletter signup was submitted on the website.",
      "",
      `Email: ${email}`,
      name ? `Name: ${name}` : "Name: not given",
      "",
      "Send the double opt-in confirmation before adding this address to the list.",
    ].join("\n"),
    replyTo: email,
    fields: { email, name, source: "website" },
  });

  if (!result.configured) {
    return Response.json({ error: "Delivery not configured" }, { status: 501 });
  }
  if (!result.ok) {
    console.error("[newsletter] delivery failed:", result.error);
    return Response.json({ error: "Delivery failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}
