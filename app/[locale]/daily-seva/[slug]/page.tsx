import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/ui";
import { dailySeva, getSevaSlot, library, site } from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, isLocale, locales, localePath, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs } from "@/lib/route";

/**
 * One page per seva slot: /daily-seva/bhupali-aarti, /daily-seva/shejarati and
 * the rest.
 *
 * These are not decorative. `next.config.ts` 301s the legacy WordPress URLs
 * /bhupali-aarti and /shejarati here, and without this route those redirects
 * landed on a 404 — which is worse for the reader and worse for the rankings
 * than having left the old URLs alone.
 *
 * `/daily-seva/upasana` and `/daily-seva/nam-jaap` have their own files; a
 * static segment wins over this dynamic one, so they are unaffected.
 */
type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    dailySeva.schedule.map((slot) => ({ locale, slug: slot.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const slot = getSevaSlot(slug);
  if (!slot) return {};

  return pageMetadata({
    locale,
    title: t(slot.title, locale),
    description: t(slot.description, locale).slice(0, 180),
    path: `/daily-seva/${slug}`,
  });
}

const CLOCK_REFERENCE = "2026-01-01";

export default async function SevaSlotPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const slot = getSevaSlot(slug);
  if (!slot) notFound();

  const clock = (time: string) =>
    formatTime(zonedToInstant(CLOCK_REFERENCE, time, site.timezone), locale, site.timezone);

  const dayName = (day: number) =>
    new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2024, 0, 7 + day)));

  const modeLabel =
    slot.mode === "online"
      ? dict.dailySeva.online
      : slot.mode === "both"
        ? dict.dailySeva.both
        : dict.dailySeva.inPerson;

  const endTime = (() => {
    const start = zonedToInstant(CLOCK_REFERENCE, slot.time, site.timezone);
    return formatTime(
      new Date(start.getTime() + slot.durationMinutes * 60_000),
      locale,
      site.timezone,
    );
  })();

  // Texts a devotee would want in hand for this seva. Matched loosely on
  // purpose: the upasana booklet covers every aarti, so it is always relevant.
  const relatedTexts = library.filter(
    (item) => item.type === "text" && ["upasana-booklet", `${slug}-text`, slug].includes(item.slug),
  );

  const others = dailySeva.schedule.filter((other) => other.slug !== slot.slug).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.dailySeva}
        title={t(slot.title, locale)}
        crumbs={[
          ...crumbs(locale, ["nav.dailySeva", "/daily-seva"]),
          { name: t(slot.title, locale), href: localePath(locale, `/daily-seva/${slug}`) },
        ]}
        aside={
          <Card tone="gold" className="p-6">
            <Eyebrow>{dict.dailySeva.scheduleTitle}</Eyebrow>
            <p className="mt-2 font-display text-3xl tabular-nums text-heading">
              {clock(slot.time)} – {endTime}
            </p>
            <dl className="mt-4">
              <DefinitionRow term={t({ en: "Days", mr: "दिवस" }, locale)}>
                {slot.days.length === 7
                  ? t({ en: "Every day of the year", mr: "वर्षातील प्रत्येक दिवशी" }, locale)
                  : slot.days.map((day) => dayName(day)).join(", ")}
              </DefinitionRow>
              <DefinitionRow term={dict.dailySeva.durationLabel}>
                {slot.durationMinutes} {dict.dailySeva.minutes}
              </DefinitionRow>
              <DefinitionRow term={t({ en: "Where", mr: "कुठे" }, locale)}>
                <Badge tone={slot.mode === "in-person" ? "brand" : "accent"}>{modeLabel}</Badge>
              </DefinitionRow>
            </dl>

            {slot.mode !== "in-person" ? (
              site.zoom.joinUrl ? (
                <ButtonLink href={site.zoom.joinUrl} external className="mt-5 w-full">
                  <Icon.Video className="h-5 w-5" />
                  {dict.dailySeva.joinZoom}
                </ButtonLink>
              ) : (
                <ButtonLink
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                    `Zoom link — ${t(slot.title, locale)}`,
                  )}`}
                  className="mt-5 w-full"
                >
                  <Icon.Mail className="h-5 w-5" />
                  {t({ en: "Ask us for the link", mr: "दुव्यासाठी विचारा" }, locale)}
                </ButtonLink>
              )
            ) : (
              <ButtonLink
                href={localePath(locale, "/visit")}
                variant="secondary"
                className="mt-5 w-full"
              >
                <Icon.MapPin className="h-5 w-5" />
                {dict.visit.getDirections}
              </ButtonLink>
            )}
          </Card>
        }
      />

      <Section tone="canvas" width="narrow">
        <div className="prose-sgs max-w-none">
          <p className="text-lg">{t(slot.description, locale)}</p>
        </div>

        {relatedTexts.length ? (
          <div className="mt-10">
            <h2 className="text-2xl">
              {t({ en: "Words to follow along", mr: "सोबत म्हणण्यासाठी शब्द" }, locale)}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {relatedTexts.map((item) => (
                <Card as="li" key={item.slug} interactive className="p-5">
                  <ButtonLink
                    href={localePath(locale, `/library/${item.slug}`)}
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-3">
                      <Icon.Document className="h-5 w-5" />
                      {t(item.title, locale)}
                    </span>
                    <Icon.ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </Card>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section tone="tint">
        <SectionHeader
          eyebrow={dict.nav.dailySeva}
          title={t({ en: "The rest of the day", mr: "दिवसाचा बाकीचा भाग" }, locale)}
          action={
            <ButtonLink href={localePath(locale, "/daily-seva")} variant="secondary">
              {dict.dailySeva.scheduleTitle}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <Card as="li" key={other.slug} interactive className="p-5">
              <ButtonLink
                href={localePath(locale, `/daily-seva/${other.slug}`)}
                variant="ghost"
                className="w-full flex-col items-start gap-1"
              >
                <span className="font-display text-xl tabular-nums text-heading">
                  {clock(other.time)}
                </span>
                <span className="text-left font-semibold">{t(other.title, locale)}</span>
              </ButtonLink>
            </Card>
          ))}
        </ul>
      </Section>
    </>
  );
}
