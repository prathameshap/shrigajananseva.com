/**
 * iCalendar generation.
 *
 * Two shapes are served: a single `.ics` file for one occasion ("add to
 * calendar"), and a whole-calendar feed devotees can subscribe to once and
 * then forget about — which is how a utsav date actually ends up in someone's
 * phone eleven months before it happens.
 */

import { site, type Occasion } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";

function stamp(value: Date): string {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * RFC 5545 requires CRLF line endings, escaping of `\ ; ,` and newlines, and
 * folding of lines over 75 octets. Calendar clients are unforgiving about all
 * three, so none of it is optional.
 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 74) {
    parts.push(` ${remaining.slice(0, 74)}`);
    remaining = remaining.slice(74);
  }
  if (remaining.length) parts.push(` ${remaining}`);
  return parts.join("\r\n");
}

function eventLines(occasion: Occasion, locale: Locale): string[] {
  const url = `${site.url}/${locale}/occasions/${occasion.slug}`;
  const description = [
    t(occasion.summary, locale),
    "",
    occasion.dateConfirmed
      ? ""
      : "Note: this date is not yet confirmed. Check the website before travelling.",
    url,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "BEGIN:VEVENT",
    `UID:${occasion.slug}@shrigajananseva.org`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(new Date(occasion.start))}`,
    `DTEND:${stamp(new Date(occasion.end))}`,
    `SUMMARY:${escapeText(t(occasion.title, locale))}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(`${occasion.locationName}, ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`)}`,
    `URL:${url}`,
    // An unconfirmed date is published as TENTATIVE so a calendar client can
    // show it differently rather than presenting a guess as settled fact.
    `STATUS:${occasion.dateConfirmed ? "CONFIRMED" : "TENTATIVE"}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`Tomorrow: ${t(occasion.title, locale)}`)}`,
    "END:VALARM",
    "END:VEVENT",
  ];
}

export function buildCalendar(occasions: Occasion[], locale: Locale, name: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shri Gajanan Seva//Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-TIMEZONE:${site.timezone}`,
    ...occasions.flatMap((occasion) => eventLines(occasion, locale)),
    "END:VCALENDAR",
  ];

  return `${lines.map(fold).join("\r\n")}\r\n`;
}

export function calendarResponse(body: string, filename: string): Response {
  return new Response(body, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "public, max-age=3600",
    },
  });
}
