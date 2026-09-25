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

  if (looksLikeSpam(payload)) {
    return NextResponse.json({ ok: true });
  }

  const name = cleanText(payload.name, 120);
  const subject = cleanText(payload.subject, 160) || "General enquiry";
  const message = cleanText(payload.message, 5000);

  if (!isEmail(payload.email) || !name || !message) {
    return NextResponse.json(
      { ok: false, message: "Please complete every field." },
      { status: 422 },
    );
  }

  const email = payload.email.trim();
  const body = [
    `From: ${name} <${email}>`,
    `Subject: ${subject}`,
    `Language: ${payload.locale === "mr" ? "Marathi" : "English"}`,
    "",
    message,
  ].join("\n");

  const result = await deliver({
    kind: "contact",
    to: site.contact.email,
    subject: `Website enquiry — ${subject}`,
    body,
    replyTo: email,
    fields: { name, email, subject, message, locale: payload.locale ?? "en" },
  });

  if (!result.configured) {
    return NextResponse.json({
      ok: false,
      reason: "not_configured",
      mailto: mailtoFallback(site.contact.email, subject, `${message}\n\n— ${name}`),
    });
  }

  if (!result.ok) {
    console.error("[contact] delivery failed:", result.error);
    return NextResponse.json(
      { ok: false, message: "We could not send that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
