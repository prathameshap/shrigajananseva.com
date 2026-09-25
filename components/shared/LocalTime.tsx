"use client";

import { useEffect, useState } from "react";
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
 */
export function LocalTime({
  iso,
  locale,
  serverZone,
  mode = "datetime",
  showZone = true,
  className,
}: {
  iso: string;
  locale: Locale;
  /** The mandir's zone, used for the first render. */
  serverZone: string;
  mode?: "date" | "time" | "datetime";
  showZone?: boolean;
  className?: string;
}) {
  const [zone, setZone] = useState(serverZone);

  useEffect(() => {
    setZone(readerTimeZone(serverZone));
  }, [serverZone]);

  const instant = new Date(iso);
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
    </time>
  );
}

/**
 * "in 3 days", "tomorrow", "in 2 hours".
 *
 * Renders nothing until mounted. A countdown baked into static HTML is stale
 * the moment it is cached, and a wrong one is worse than none — this is the
 * number people use to decide whether to leave the house.
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
    const tick = () => setLabel(relativeTime(target, locale));
    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, [iso, locale]);

  if (!label) return null;

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
  className?: string;
}) {
  const [zone, setZone] = useState(serverZone);

  useEffect(() => {
    setZone(readerTimeZone(serverZone));
  }, [serverZone]);

  return <span className={className}>{zoneLabel(zone, locale)}</span>;
}
