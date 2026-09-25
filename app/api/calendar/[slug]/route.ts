import { getOccasion } from "@/lib/content";
<<<<<<< HEAD
import { buildCalendar, calendarResponse } from "@/lib/ics";
import { defaultLocale, isLocale, t } from "@/lib/i18n";

/** A single occasion as a downloadable `.ics` — the "add to calendar" button. */
=======
import { defaultLocale, isLocale } from "@/lib/i18n";
import { buildCalendar, calendarResponse } from "@/lib/ics";
import { t } from "@/lib/i18n";

>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
<<<<<<< HEAD
  if (!occasion) return new Response("Not found", { status: 404 });
=======
  if (!occasion) {
    return new Response("Not found", { status: 404 });
  }
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f

  const requested = new URL(request.url).searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  const body = buildCalendar([occasion], locale, t(occasion.title, locale));
  return calendarResponse(body, `${slug}.ics`);
}
