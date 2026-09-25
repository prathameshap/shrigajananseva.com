"use client";

import { useEffect, useState } from "react";
import { formatDate, formatTime, readerTimeZone, relativeTime, zoneLabel } from "@/lib/datetime";
import type { Locale } from "@/lib/i18n";

/**
 * Renders an instant in the *reader's* timezone.
 *
 * The server can only render in the mandir's zone, so the first paint shows
 * that, and this swaps to the reader's own zone once mounted. `suppressHydration
 * Warning` covers the one-frame difference; a devotee in Pune sees their own
 * clock, which is the whole point.
 */
export function LocalTime({
  iso,
  locale,
  serverZone,
  mode = "time",
  className,
}: {
  iso: string;
  locale: Locale;
  serverZone: string;
  mode?: "time" | "date" | "datetime";
  className?: string;
}) {
  const [zone, setZone] = useState(serverZone);

  useEffect(() => {
    setZone(readerTimeZone(serverZone));
  }, [serverZone]);

  const instant = new Date(iso);
  const time = formatTime(instant, locale, zone);
  const date = formatDate(instant, locale, zone, "medium");

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {mode === "time" ? time : mode === "date" ? date : `${date}, ${time}`}
    </time>
  );
}

/**
 * "in 3 days" — recalculated against the reader's clock.
 *
 * Rendered as nothing on the server, because a build-time "in 3 days" becomes
 * a lie the moment the page is cached.
 */
export function Countdown({
  iso,
  locale,
  className,
}: {
  iso: string;
  locale: Locale;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date(iso);
    const update = () => setLabel(relativeTime(target, locale));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [iso, locale]);

  if (!label) return null;
  return <span className={className}>{label}</span>;
}

/** "Times are shown in PDT." — the note that keeps the timetable unambiguous. */
export function TimeZoneNote({
  locale,
  serverZone,
  template,
  className,
}: {
  locale: Locale;
  serverZone: string;
  template: string;
  className?: string;
}) {
  const [zone, setZone] = useState(serverZone);

  useEffect(() => {
    setZone(readerTimeZone(serverZone));
  }, [serverZone]);

  return (
    <p className={className} suppressHydrationWarning>
      {template.replace("{zone}", zoneLabel(zone, locale))}
    </p>
  );
}
