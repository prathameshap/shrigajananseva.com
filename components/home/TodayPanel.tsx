"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Badge, Card, LiveDot, cx } from "@/components/ui";
import {
  dateKeyInZone,
  formatTime,
  readerTimeZone,
  zoneLabel,
  zonedToInstant,
} from "@/lib/datetime";
import type { Locale } from "@/lib/i18n";

export type PanelSlot = {
  slug: string;
  time: string;
  durationMinutes: number;
  title: string;
  mode: "in-person" | "online" | "both";
};

export type PanelLabels = {
  todayTitle: string;
  liveNow: string;
  liveNowBody: string;
  joinZoom: string;
  nextUp: string;
  inProgress: string;
  concluded: string;
  online: string;
  inPerson: string;
  timezoneNote: string;
  viewFullSchedule: string;
  zoomUnavailable: string;
};

/**
 * "What is happening right now" — live seva, and the rest of today.
 *
 * This runs on the client for two reasons: the answer changes every minute,
 * and it has to be expressed in the *reader's* timezone. A statically
 * rendered version would be stale and in the wrong zone for half the sangha.
 */
export function TodayPanel({
  locale,
  slots,
  mandirTimezone,
  zoomUrl,
  scheduleHref,
  labels,
}: {
  locale: Locale;
  slots: PanelSlot[];
  mandirTimezone: string;
  zoomUrl: string | null;
  scheduleHref: string;
  labels: PanelLabels;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [zone, setZone] = useState(mandirTimezone);

  useEffect(() => {
    setZone(readerTimeZone(mandirTimezone));
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, [mandirTimezone]);

  const resolved = useMemo(() => {
    const reference = now ?? new Date();
    const dateKey = dateKeyInZone(reference, mandirTimezone);
    return slots.map((slot) => {
      const start = zonedToInstant(dateKey, slot.time, mandirTimezone);
      const end = new Date(start.getTime() + slot.durationMinutes * 60_000);
      const status =
        reference >= end ? "done" : reference >= start ? "live" : ("upcoming" as const);
      return { ...slot, start, end, status };
    });
  }, [slots, mandirTimezone, now]);

  const live = resolved.find((slot) => slot.status === "live");
  const next = resolved.find((slot) => slot.status === "upcoming");
  const broadcasting = live && (live.mode === "online" || live.mode === "both");

  // Before hydration we cannot know the reader's clock; render the timetable
  // without any live/next emphasis rather than guessing and flickering.
  const settled = now !== null;

  return (
    <div className="flex flex-col gap-5">
      {settled && broadcasting ? (
        <Card className="border-night-700 bg-night-800 p-6 text-sandal-100 shadow-lift">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-1.5">
                <LiveDot />
              </span>
              <div>
                <p className="text-sm font-bold tracking-[0.16em] text-marigold-300 uppercase">
                  {labels.liveNow}
                </p>
                <p className="mt-1 font-display text-2xl text-sandal-50">{live.title}</p>
                <p className="mt-1 text-sandal-200">
                  {labels.liveNowBody} · {formatTime(live.start, locale, zone)} –{" "}
                  {formatTime(live.end, locale, zone)}
                </p>
              </div>
            </div>
            {zoomUrl ? (
              <a
                href={zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-marigold-400 px-6 py-3 font-semibold text-ink-900 hover:bg-marigold-300"
              >
                <Icon.Video className="h-5 w-5" />
                {labels.joinZoom}
              </a>
            ) : (
              <span className="shrink-0 rounded-full border border-sandal-400/40 px-5 py-2.5 text-sm text-sandal-200">
                {labels.zoomUnavailable}
              </span>
            )}
          </div>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface-raised px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg">
            <Icon.Clock className="h-5 w-5 text-gold-500" />
            {labels.todayTitle}
          </h2>
          <Link
            href={scheduleHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline hover:underline-offset-4"
          >
            {labels.viewFullSchedule}
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y divide-hairline">
          {resolved.map((slot) => {
            const isLive = settled && slot.status === "live";
            const isNext = settled && next?.slug === slot.slug;
            const isDone = settled && slot.status === "done";
            return (
              <li
                key={slot.slug}
                className={cx(
                  "flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5",
                  isLive && "bg-accent-soft",
                  isDone && "opacity-55",
                )}
              >
                <span
                  className={cx(
                    "w-24 shrink-0 font-semibold tabular-nums",
                    isLive ? "text-accent" : "text-heading",
                  )}
                  suppressHydrationWarning
                >
                  {formatTime(slot.start, locale, zone)}
                </span>
                <span className="min-w-0 flex-1 font-medium text-body">{slot.title}</span>
                <span className="flex items-center gap-2">
                  {slot.mode !== "in-person" ? (
                    <Badge tone="neutral">
                      <Icon.Video className="h-3.5 w-3.5" />
                      {labels.online}
                    </Badge>
                  ) : (
                    <Badge tone="neutral">{labels.inPerson}</Badge>
                  )}
                  {isLive ? <Badge tone="live">{labels.inProgress}</Badge> : null}
                  {isNext ? <Badge tone="accent">{labels.nextUp}</Badge> : null}
                </span>
              </li>
            );
          })}
        </ul>

        <p
          className="border-t border-hairline px-6 py-3 text-sm text-muted"
          suppressHydrationWarning
        >
          {labels.timezoneNote.replace("{zone}", zoneLabel(zone, locale))}
        </p>
      </Card>
    </div>
  );
}
