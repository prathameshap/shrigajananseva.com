import { occasions } from "@/lib/content";
import { isLocale, defaultLocale } from "@/lib/i18n";
import { buildCalendar, calendarResponse } from "@/lib/ics";

/**
 * Subscribable feed of every occasion.
 *
 * `/api/calendar?locale=mr` for Marathi titles. Devotees add this URL once in
 * Google Calendar or Apple Calendar and every future utsav appears without
 * anyone having to remember to announce it.
 */
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  const body = buildCalendar(occasions, locale, "Shri Gajanan Seva — Occasions");
  return calendarResponse(body, "shri-gajanan-seva.ics");
}
