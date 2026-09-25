import { occasions } from "@/lib/content";
<<<<<<< HEAD
import { buildCalendar, calendarResponse } from "@/lib/ics";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * The subscribable feed of every occasion.
 *
 * This is the one that matters: utsav dates follow the tithi and move each
 * year, so a devotee who subscribes once never has to look them up again. Add
 * `?locale=mr` for Marathi titles.
=======
import { isLocale, defaultLocale } from "@/lib/i18n";
import { buildCalendar, calendarResponse } from "@/lib/ics";

/**
 * Subscribable feed of every occasion.
 *
 * `/api/calendar?locale=mr` for Marathi titles. Devotees add this URL once in
 * Google Calendar or Apple Calendar and every future utsav appears without
 * anyone having to remember to announce it.
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
 */
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  const body = buildCalendar(occasions, locale, "Shri Gajanan Seva — Occasions");
  return calendarResponse(body, "shri-gajanan-seva.ics");
}
