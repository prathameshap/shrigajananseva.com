/**
 * Timezone-aware date helpers.
 *
 * The mandir publishes its timetable in America/Los_Angeles. Devotees read it
 * from Pune, London, Sydney and Fremont. Every time shown on this site is
 * therefore converted into the *reader's* zone, and labelled so they know it.
 *
 * Implemented with Intl alone — no date library, no extra kilobytes shipped to
 * a congregation that often reads this on an old phone over cellular.
 */

import { localeTags, type Locale } from "@/lib/i18n";

/** Milliseconds a zone is ahead of UTC at a given instant. */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  // Intl renders hour 24 for midnight in some engines; normalise to 0.
  const hour = get("hour") % 24;

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second"),
  );
  return asUtc - instant.getTime();
}

/**
 * Turn a wall-clock time in a named zone into a real instant.
 *
 * `dateISO` is `YYYY-MM-DD`, `time` is `HH:mm`, both as written on the
 * timetable. Two passes settle the DST edge case where the first offset guess
 * lands on the wrong side of a transition.
 */
export function zonedToInstant(dateISO: string, time: string, timeZone: string): Date {
  const naive = Date.parse(`${dateISO}T${time}:00Z`);
  let instant = new Date(naive - zoneOffsetMs(new Date(naive), timeZone));
  instant = new Date(naive - zoneOffsetMs(instant, timeZone));
  return instant;
}

/** `YYYY-MM-DD` for an instant as seen in a given zone. */
export function dateKeyInZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** 0 = Sunday … 6 = Saturday, as seen in a given zone. */
export function weekdayInZone(instant: Date, timeZone: string): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(instant);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

export function formatTime(instant: Date, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(instant);
}

export function formatDate(
  instant: Date,
  locale: Locale,
  timeZone: string,
  style: "full" | "long" | "medium" | "short" = "long",
): string {
  return new Intl.DateTimeFormat(localeTags[locale], { timeZone, dateStyle: style }).format(
    instant,
  );
}

export function formatDateTime(instant: Date, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    timeZone,
    dateStyle: "long",
    timeStyle: "short",
  }).format(instant);
}

/** A short, human zone label — "PDT", "IST" — for the "times shown in…" note. */
export function zoneLabel(timeZone: string, locale: Locale = "en"): string {
  const parts = new Intl.DateTimeFormat(localeTags[locale], {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(new Date());
  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

/** The reader's own zone, or the mandir's when running on the server. */
export function readerTimeZone(fallback: string): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  } catch {
    return fallback;
  }
}

/** "in 3 days", "tomorrow", "in 2 hours" — for countdowns to the next occasion. */
export function relativeTime(target: Date, locale: Locale, now: Date = new Date()): string {
  const rtf = new Intl.RelativeTimeFormat(localeTags[locale], { numeric: "auto" });
  const diffMs = target.getTime() - now.getTime();
  const minutes = Math.round(diffMs / 60000);

  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(months, "month");
  return rtf.format(Math.round(months / 12), "year");
}

/** A date range rendered as compactly as the two endpoints allow. */
export function formatDateRange(
  start: Date,
  end: Date,
  locale: Locale,
  timeZone: string,
): string {
  const sameDay = dateKeyInZone(start, timeZone) === dateKeyInZone(end, timeZone);
  if (sameDay) {
    return `${formatDate(start, locale, timeZone)}, ${formatTime(start, locale, timeZone)} – ${formatTime(end, locale, timeZone)}`;
  }
  return `${formatDate(start, locale, timeZone)} – ${formatDate(end, locale, timeZone)}`;
}
