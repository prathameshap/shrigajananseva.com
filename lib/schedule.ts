/**
 * Derives "what is happening right now" from the published timetable.
 *
 * Both the home page "live now" card and the daily seva timetable read from
 * here, so they can never disagree with one another.
 */

import { dailySeva, site, type SevaSlot } from "@/lib/content";
import { dateKeyInZone, weekdayInZone, zonedToInstant } from "@/lib/datetime";

export type SlotStatus = "upcoming" | "live" | "done";

export type ResolvedSlot = SevaSlot & {
  start: Date;
  end: Date;
  status: SlotStatus;
};

/**
 * Today's seva, each slot resolved to a real instant.
 *
 * "Today" means today at the mandir — a devotee in Pune reading this at 9am
 * their time is looking at the mandir's previous evening, and the timetable
 * should say so rather than silently rolling over.
 */
export function resolveDay(now: Date = new Date()): ResolvedSlot[] {
  const dateKey = dateKeyInZone(now, site.timezone);

  return dailySeva.schedule.map((slot) => {
    const start = zonedToInstant(dateKey, slot.time, site.timezone);
    const end = new Date(start.getTime() + slot.durationMinutes * 60_000);
    const status: SlotStatus = now >= end ? "done" : now >= start ? "live" : "upcoming";
    return { ...slot, start, end, status };
  });
}

/** The slot in progress right now, if any. */
export function liveSlot(now: Date = new Date()): ResolvedSlot | undefined {
  return resolveDay(now).find((slot) => slot.status === "live");
}

/** The next slot that has not started, if any remain today. */
export function nextSlot(now: Date = new Date()): ResolvedSlot | undefined {
  return resolveDay(now).find((slot) => slot.status === "upcoming");
}

/**
 * Whether the "Live now — join on Zoom" card should appear.
 *
 * Only for slots that are actually broadcast. Showing a join button for an
 * in-person-only seva would send someone to an empty meeting room.
 */
export function liveBroadcast(now: Date = new Date()): ResolvedSlot | undefined {
  const slot = liveSlot(now);
  if (!slot) return undefined;
  return slot.mode === "online" || slot.mode === "both" ? slot : undefined;
}

/* ------------------------------------------------------------ open hours */

export type DayHours = { day: number; opens: string; closes: string };

export function hoursForDay(day: number): DayHours | undefined {
  return site.hours.find((entry) => entry.day === day);
}

export function isOpenToday(now: Date = new Date()): boolean {
  return Boolean(hoursForDay(weekdayInZone(now, site.timezone)));
}

export type OpenState =
  | { open: true; closesAt: Date }
  | { open: false; opensAt: Date | null; openToday: boolean };

export function openState(now: Date = new Date()): OpenState {
  const dateKey = dateKeyInZone(now, site.timezone);
  const today = hoursForDay(weekdayInZone(now, site.timezone));

  if (today) {
    const opens = zonedToInstant(dateKey, today.opens, site.timezone);
    const closes = zonedToInstant(dateKey, today.closes, site.timezone);
    if (now >= opens && now < closes) return { open: true, closesAt: closes };
    if (now < opens) return { open: false, opensAt: opens, openToday: true };
  }

  return { open: false, opensAt: nextOpening(now), openToday: Boolean(today) };
}

/** The next instant the mandir opens, searching forward up to a week. */
export function nextOpening(now: Date = new Date()): Date | null {
  for (let ahead = 0; ahead <= 7; ahead += 1) {
    const probe = new Date(now.getTime() + ahead * 86_400_000);
    const entry = hoursForDay(weekdayInZone(probe, site.timezone));
    if (!entry) continue;
    const opens = zonedToInstant(dateKeyInZone(probe, site.timezone), entry.opens, site.timezone);
    if (opens > now) return opens;
  }
  return null;
}

/** Open days in display order, starting from Thursday as the site does. */
export function weeklyHours(): DayHours[] {
  const order = [4, 6, 0, 1, 2, 3, 5];
  return order
    .map((day) => hoursForDay(day))
    .filter((entry): entry is DayHours => Boolean(entry));
}
