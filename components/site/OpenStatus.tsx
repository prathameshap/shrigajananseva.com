"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { dateKeyInZone, formatTime, weekdayInZone, zonedToInstant } from "@/lib/datetime";
import type { Locale } from "@/lib/i18n";

type Hours = { day: number; opens: string; closes: string };

/**
 * "Open now, closes 9.00pm" in the header.
 *
 * Deliberately client-side and deliberately empty on the server. Whether the
 * centre is open depends on the current minute, and a statically rendered
 * answer would be wrong for all but a few minutes after each deploy — worse
 * than saying nothing, because somebody would drive there on it.
 */
export function OpenStatus({
  hours,
  timezone,
  locale,
  labels,
}: {
  hours: Hours[];
  timezone: string;
  locale: Locale;
  labels: { open: string; closed: string; closesAt: string; opensAt: string };
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const today = hours.find((entry) => entry.day === weekdayInZone(now, timezone));
  const dateKey = dateKeyInZone(now, timezone);

  let open = false;
  let boundary: Date | null = null;

  if (today) {
    const opens = zonedToInstant(dateKey, today.opens, timezone);
    const closes = zonedToInstant(dateKey, today.closes, timezone);
    if (now >= opens && now < closes) {
      open = true;
      boundary = closes;
    } else if (now < opens) {
      boundary = opens;
    }
  }

  if (!open && !boundary) {
    // Closed for the rest of today. Find the next day that has hours at all.
    for (let ahead = 1; ahead <= 7; ahead += 1) {
      const probe = new Date(now.getTime() + ahead * 86_400_000);
      const entry = hours.find((h) => h.day === weekdayInZone(probe, timezone));
      if (entry) {
        boundary = zonedToInstant(dateKeyInZone(probe, timezone), entry.opens, timezone);
        break;
      }
    }
  }

  const time = boundary ? formatTime(boundary, locale, timezone) : null;
  const suffix = time
    ? (open ? labels.closesAt : labels.opensAt).replace("{time}", time)
    : null;

  return (
    <p className="flex items-center gap-2 text-sm">
      <span
        className={
          open
            ? "h-2 w-2 shrink-0 rounded-full bg-tulsi-500"
            : "h-2 w-2 shrink-0 rounded-full bg-ink-400"
        }
        aria-hidden="true"
      />
      <span className={open ? "font-semibold text-marigold-200" : "font-semibold text-sandal-300"}>
        {open ? labels.open : labels.closed}
      </span>
      {suffix ? <span className="hidden text-sandal-300 sm:inline">· {suffix}</span> : null}
      <Icon.Clock className="h-4 w-4 text-sandal-400 sm:hidden" />
    </p>
  );
}
