import { NextResponse } from "next/server";
import { site } from "@/lib/content";
import { deliver, mailtoFallback } from "@/lib/mailer";
import { cleanText, isEmail, looksLikeSpam } from "@/lib/validate";

export const runtime = "nodejs";

const RIGHT_LABELS: Record<string, string> = {
  know: "Know what personal information is held",
  access: "Access — send a portable copy",
  correct: "Correct inaccurate information",
  delete: "Delete personal information",
  optout: "Opt out of sale or sharing",
};

/**
 * Generates the reference the requester is told to keep.
 *
 * Date-prefixed so that whoever works the queue can see the statutory clock
 * at a glance without opening the record: SGS-20260919-4F2A.
 */
function reference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SGS-${date}-${suffix}`;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  if (looksLikeSpam(payload)) {
    return NextResponse.json({ ok: true, reference: reference() });
  }

  const name = cleanText(payload.name, 120);
  const details = cleanText(payload.details, 3000);
  const rights = Array.isArray(payload.rights)
    ? payload.rights.filter((right): right is string => typeof right === "string")
    : [];

  if (!isEmail(payload.email) || !name || rights.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Please give your name, email and at least one request." },
      { status: 422 },
    );
  }

  const email = payload.email.trim();
  const ref = reference();
  const requested = rights.map((right) => `- ${RIGHT_LABELS[right] ?? right}`).join("\n");

  const body = [
    `Privacy rights request — ${ref}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Authorised agent: ${payload.agent ? "yes — request written proof of authorisation" : "no"}`,
    "",
    "Requested:",
    requested,
    "",
    details ? `Additional detail:\n${details}` : "No additional detail given.",
    "",
    "--",
    "Statutory clock (CCPA/CPRA):",
    `  Acknowledge by: ${businessDaysFrom(10)}`,
    `  Substantive response by: ${calendarDaysFrom(45)}`,
    "  One 45-day extension is permitted if the requester is notified beforehand.",
  ].join("\n");

  const result = await deliver({
    kind: "contact",
    to: site.contact.privacyEmail,
    subject: `Privacy rights request ${ref} — action required`,
    body,
    replyTo: email,
    fields: {
      reference: ref,
      name,
      email,
      rights,
      details,
      agent: Boolean(payload.agent),
      receivedAt: new Date().toISOString(),
      acknowledgeBy: businessDaysFrom(10),
      respondBy: calendarDaysFrom(45),
    },
  });

  if (!result.configured) {
    return NextResponse.json({
      ok: false,
      reason: "not_configured",
      mailto: mailtoFallback(
        site.contact.privacyEmail,
        "Privacy rights request",
        `${body}\n\n— ${name}`,
      ),
    });
  }

  if (!result.ok) {
    console.error("[privacy-request] delivery failed:", result.error);
    return NextResponse.json(
      { ok: false, message: "We could not submit that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, reference: ref });
}

function calendarDaysFrom(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function businessDaysFrom(days: number): string {
  const date = new Date();
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date.toISOString().slice(0, 10);
}
