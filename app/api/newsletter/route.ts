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
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
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

  const result = await deliver({
    kind: "newsletter",
    to: site.contact.newsletterEmail,
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
}
