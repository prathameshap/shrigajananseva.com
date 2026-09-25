"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Icon } from "@/components/icons";
import { Badge, buttonClass, cx, LiveDot } from "@/components/ui";
import {
  dateKeyInZone,
  formatTime,
  readerTimeZone,
  weekdayInZone,
  zoneLabel,
  zonedToInstant,
} from "@/lib/datetime";
import type { Locale } from "@/lib/i18n";

export type PanelSlot = {
  slug: string;
  time: string;
  durationMinutes: number;
  days: number[];
  title: string;
  mode: "in-person" | "online" | "both";
};

type Labels = {
  todayTitle: string;
  liveNow: string;
  liveNowBody: string;
  joinZoom: string;
  nextUp: string;
  inProgress: string;
  concluded: string;
  online: string;
  inPerson: string;
  both: string;
  timezoneNote: string;
  viewFullSchedule: string;
  zoomUnavailable: string;
  noSlotsLeft: string;
};

/**
 * "What is happening at the centre right now."
 *
 * Client-side on purpose. Which slot is live depends on the current minute, and
 * this panel is the one thing on the page that is actively wrong if it is
 * rendered once at build time. It ticks every thirty seconds.
 *
 * Until it mounts it renders the mandir's own timetable for today, so the panel
 * is never an empty box and the layout does not jump.
 */
export function TodayPanel({
  locale,
  mandirTimezone,
  zoomUrl,
  scheduleHref,
  slots,
  labels,
}: {
  locale: Locale;
  mandirTimezone: string;
  zoomUrl: string | null;
  scheduleHref: string;
  slots: PanelSlot[];
  labels: Labels;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const readerZone = useMemo(
    () => (now ? readerTimeZone(mandirTimezone) : mandirTimezone),
    [now, mandirTimezone],
  );

  const reference = now ?? new Date();
  const dateKey = dateKeyInZone(reference, mandirTimezone);
  const weekday = weekdayInZone(reference, mandirTimezone);

  const resolved = slots
    .filter((slot) => slot.days.includes(weekday))
    .map((slot) => {
      const start = zonedToInstant(dateKey, slot.time, mandirTimezone);
      const end = new Date(start.getTime() + slot.durationMinutes * 60_000);
      return { ...slot, start, end };
    });

  const live = now ? resolved.find((slot) => now >= slot.start && now < slot.end) : undefined;
  const next = now ? resolved.find((slot) => now < slot.start) : resolved[0];
  const liveIsBroadcast = live && (live.mode === "online" || live.mode === "both");

  const modeLabel = (mode: PanelSlot["mode"]) =>
    mode === "online" ? labels.online : mode === "both" ? labels.both : labels.inPerson;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-panel border border-hairline bg-surface shadow-lift">
      {/* ------------------------------------------------ live / next banner */}
      {live ? (
        <div className="bg-gradient-to-r from-saffron-600 to-kumkum-600 px-6 py-5 text-sandal-50">
          <p className="flex items-center gap-2.5 text-sm font-bold tracking-[0.14em] uppercase">
            <LiveDot />
            {labels.liveNow}
          </p>
          <p className="mt-2 font-display text-2xl">{live.title}</p>
          <p className="mt-1 text-sm text-sandal-100">
            {formatTime(live.start, locale, readerZone)} –{" "}
            {formatTime(live.end, locale, readerZone)}
          </p>

          {liveIsBroadcast ? (
            zoomUrl ? (
              <a
                href={zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  buttonClass("onbrand", "md"),
                  "mt-4",
                )}
              >
                <Icon.Video className="h-5 w-5" />
                {labels.joinZoom}
              </a>
            ) : (
              <p className="mt-3 text-sm text-marigold-200">{labels.zoomUnavailable}</p>
            )
          ) : (
            <p className="mt-3 text-sm text-sandal-100">{labels.liveNowBody}</p>
          )}
        </div>
      ) : (
        <div className="border-b border-hairline bg-surface-tint px-6 py-5">
          <p className="text-sm font-bold tracking-[0.14em] text-accent uppercase">
            {next ? labels.nextUp : labels.todayTitle}
          </p>
          {next ? (
            <>
              <p className="mt-2 font-display text-2xl text-heading">{next.title}</p>
              <p className="mt-1 text-sm text-muted">
                {formatTime(next.start, locale, readerZone)} ·{" "}
                {modeLabel(next.mode)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-muted">{labels.noSlotsLeft}</p>
          )}
        </div>
      )}

      {/* ----------------------------------------------------- the timetable */}
      <div className="flex flex-1 flex-col px-6 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl">{labels.todayTitle}</h2>
          <p className="text-xs text-muted">
            {labels.timezoneNote} · {zoneLabel(readerZone, locale)}
          </p>
        </div>

        <ol className="mt-4 flex flex-col">
          {resolved.map((slot) => {
            const done = now ? now >= slot.end : false;
            const isLive = live?.slug === slot.slug;
            return (
              <li
                key={slot.slug}
                className="flex items-baseline gap-4 border-b border-hairline py-2.5 last:border-0"
              >
                <span
                  className={cx(
                    "w-24 shrink-0 font-semibold tabular-nums",
                    isLive ? "text-brand" : done ? "text-ink-400" : "text-heading",
                  )}
                >
                  {formatTime(slot.start, locale, readerZone)}
                </span>
                <span className="flex flex-1 flex-wrap items-center gap-2">
                  <span
                    className={cx(
                      isLive && "font-semibold text-brand",
                      done && "text-ink-400 line-through decoration-ink-400/50",
                    )}
                  >
                    {slot.title}
                  </span>
                  {slot.mode !== "in-person" ? (
                    <Badge tone="accent" className="px-2 py-0 text-xs">
                      <Icon.Video className="h-3 w-3" />
                      {labels.online}
                    </Badge>
                  ) : null}
                  {isLive ? (
                    <Badge tone="live" className="px-2 py-0 text-xs">
                      {labels.inProgress}
                    </Badge>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>

        <Link
          href={scheduleHref}
          className="mt-5 inline-flex items-center gap-2 self-start font-semibold text-accent hover:underline hover:underline-offset-4"
        >
          {labels.viewFullSchedule}
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
