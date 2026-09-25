"use client";

import { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  formatDate,
  formatDateTime,
  formatTime,
  readerTimeZone,
  relativeTime,
  zoneLabel,
} from "@/lib/datetime";
import type { Locale } from "@/lib/i18n";

/**
 * An instant, rendered in the reader's own timezone.
 *
 * Server-rendered in the mandir's zone first so the markup is never empty and
 * the page does not reflow, then re-rendered in the reader's zone on mount. A
 * devotee in Pune sees Pragat Din at the time it will actually reach them, and
 * the zone abbreviation is appended so nobody has to wonder which it is.
=======
import { formatDate, formatTime, readerTimeZone, relativeTime, zoneLabel } from "@/lib/datetime";
import type { Locale } from "@/lib/i18n";

/**
 * Renders an instant in the *reader's* timezone.
 *
 * The server can only render in the mandir's zone, so the first paint shows
 * that, and this swaps to the reader's own zone once mounted. `suppressHydration
 * Warning` covers the one-frame difference; a devotee in Pune sees their own
 * clock, which is the whole point.
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
 */
export function LocalTime({
  iso,
  locale,
  serverZone,
<<<<<<< HEAD
  mode = "datetime",
  showZone = true,
=======
  mode = "time",
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  className,
}: {
  iso: string;
  locale: Locale;
<<<<<<< HEAD
  /** The mandir's zone, used for the first render. */
  serverZone: string;
  mode?: "date" | "time" | "datetime";
  showZone?: boolean;
=======
  serverZone: string;
  mode?: "time" | "date" | "datetime";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  className?: string;
}) {
  const [zone, setZone] = useState(serverZone);

  useEffect(() => {
    setZone(readerTimeZone(serverZone));
  }, [serverZone]);

  const instant = new Date(iso);
<<<<<<< HEAD
  const format =
    mode === "date" ? formatDate : mode === "time" ? formatTime : formatDateTime;

  return (
    <time dateTime={iso} className={className}>
      {format(instant, locale, zone)}
      {showZone && mode !== "date" ? (
        <span className="ml-1.5 text-[0.85em] font-normal opacity-70">
          {zoneLabel(zone, locale)}
        </span>
      ) : null}
=======
  const time = formatTime(instant, locale, zone);
  const date = formatDate(instant, locale, zone, "medium");

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {mode === "time" ? time : mode === "date" ? date : `${date}, ${time}`}
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
    </time>
  );
}

/**
<<<<<<< HEAD
 * "in 3 days", "tomorrow", "in 2 hours".
 *
 * Renders nothing until mounted. A countdown baked into static HTML is stale
 * the moment it is cached, and a wrong one is worse than none — this is the
 * number people use to decide whether to leave the house.
=======
 * "in 3 days" — recalculated against the reader's clock.
 *
 * Rendered as nothing on the server, because a build-time "in 3 days" becomes
 * a lie the moment the page is cached.
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
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
<<<<<<< HEAD
    const tick = () => setLabel(relativeTime(target, locale));
    tick();
    const timer = setInterval(tick, 60_000);
=======
    const update = () => setLabel(relativeTime(target, locale));
    update();
    const timer = setInterval(update, 60_000);
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
    return () => clearInterval(timer);
  }, [iso, locale]);

  if (!label) return null;
<<<<<<< HEAD

  return <span className={className}>{label}</span>;
}

/** The reader's zone abbreviation on its own — "times shown in PDT". */
export function ReaderZone({
  serverZone,
  locale,
  className,
}: {
  serverZone: string;
  locale: Locale;
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  className?: string;
}) {
  const [zone, setZone] = useState(serverZone);

  useEffect(() => {
    setZone(readerTimeZone(serverZone));
  }, [serverZone]);

<<<<<<< HEAD
  return <span className={className}>{zoneLabel(zone, locale)}</span>;
=======
  return (
    <p className={className} suppressHydrationWarning>
      {template.replace("{zone}", zoneLabel(zone, locale))}
    </p>
  );
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}
