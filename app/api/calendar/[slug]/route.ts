import { getOccasion } from "@/lib/content";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { buildCalendar, calendarResponse } from "@/lib/ics";
import { t } from "@/lib/i18n";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) {
    return new Response("Not found", { status: 404 });
  }

  const requested = new URL(request.url).searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  const body = buildCalendar([occasion], locale, t(occasion.title, locale));
  return calendarResponse(body, `${slug}.ics`);
}
