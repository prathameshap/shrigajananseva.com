import { occasions } from "@/lib/content";
import { buildCalendar, calendarResponse } from "@/lib/ics";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * The subscribable feed of every occasion.
 *
 * This is the one that matters: utsav dates follow the tithi and move each
 * year, so a devotee who subscribes once never has to look them up again. Add
 * `?locale=mr` for Marathi titles.
 */
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  const body = buildCalendar(occasions, locale, "Shri Gajanan Seva — Occasions");
  return calendarResponse(body, "shri-gajanan-seva.ics");
}
