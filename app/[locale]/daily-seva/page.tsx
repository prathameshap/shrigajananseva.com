import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import { TodayPanel } from "@/components/home/TodayPanel";
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  Eyebrow,
  Section,
  SectionHeader,
  SpinedCard,
} from "@/components/ui";
import { dailySeva, site } from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.dailySeva.title,
    description: dict.dailySeva.intro,
    path: "/daily-seva",
  });
}

const CLOCK_REFERENCE = "2026-01-01";

export default async function DailySevaPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  const clock = (time: string) =>
    formatTime(zonedToInstant(CLOCK_REFERENCE, time, site.timezone), locale, site.timezone);

  const dayName = (day: number) =>
    new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2024, 0, 7 + day)));

  const modeLabel = (mode: string) =>
    mode === "online"
      ? dict.dailySeva.online
      : mode === "both"
        ? dict.dailySeva.both
        : dict.dailySeva.inPerson;

  return (
    <>
      <PageHero
        eyebrow={dict.nav.dailySeva}
        title={dict.dailySeva.title}
        description={dict.dailySeva.intro}
        crumbs={crumbs(locale, ["nav.dailySeva", "/daily-seva"])}
        aside={
          <Card tone="gold" className="p-6">
            <Eyebrow>{dict.dailySeva.zoomTitle}</Eyebrow>
            <p className="mt-3 text-muted">{t(site.zoom.note, locale)}</p>
            {site.zoom.joinUrl ? (
              <>
                <ButtonLink href={site.zoom.joinUrl} external className="mt-5">
                  <Icon.Video className="h-5 w-5" />
                  {dict.dailySeva.joinZoom}
                </ButtonLink>
                {site.zoom.meetingId ? (
                  <dl className="mt-4 flex flex-col gap-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-heading">
                        {dict.dailySeva.zoomIdLabel}:
                      </dt>
                      <dd className="tabular-nums text-muted">{site.zoom.meetingId}</dd>
                    </div>
                    {site.zoom.passcode ? (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-heading">
                          {dict.dailySeva.zoomPasscodeLabel}:
                        </dt>
                        <dd className="text-muted">{site.zoom.passcode}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </>
            ) : (
              <ButtonLink
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                  "Zoom link for daily upasana",
                )}`}
                className="mt-5"
              >
                <Icon.Mail className="h-5 w-5" />
                {t(
                  { en: "Ask us for the link", mr: "दुव्यासाठी आम्हाला विचारा" },
                  locale,
                )}
              </ButtonLink>
            )}
          </Card>
        }
      />

      {/* ─────────────────────────────────────────────────────── today ─── */}
      <Section tone="canvas">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <TodayPanel
              locale={locale}
              mandirTimezone={site.timezone}
              zoomUrl={site.zoom.joinUrl}
              scheduleHref={localePath(locale, "/visit#weekly")}
              slots={dailySeva.schedule.map((slot) => ({
                slug: slot.slug,
                time: slot.time,
                durationMinutes: slot.durationMinutes,
                days: slot.days,
                title: t(slot.title, locale),
                mode: slot.mode,
              }))}
              labels={{
                todayTitle: dict.dailySeva.scheduleTitle,
                liveNow: dict.home.liveNow,
                liveNowBody: dict.home.liveNowBody,
                joinZoom: dict.dailySeva.joinZoom,
                nextUp: dict.dailySeva.nextUp,
                inProgress: dict.dailySeva.inProgress,
                concluded: dict.dailySeva.concluded,
                online: dict.dailySeva.online,
                inPerson: dict.dailySeva.inPerson,
                both: dict.dailySeva.both,
                timezoneNote: dict.common.timezoneNote,
                viewFullSchedule: dict.visit.weeklyTitle,
                zoomUnavailable: t(
                  {
                    en: "Zoom link available on request — email us",
                    mr: "झूम दुवा विनंतीवरून — आम्हाला ईमेल करा",
                  },
                  locale,
                ),
                noSlotsLeft: dict.dailySeva.noSlotsLeft,
              }}
            />
          </div>

          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.nav.dailySeva}
              title={t({ en: "Two practices", mr: "दोन साधना" }, locale)}
              description={t(
                {
                  en: "Beyond the aartis, there are two things any devotee can take up today, from anywhere, with nothing to arrange.",
                  mr: "आरत्यांपलीकडे, कोणताही भक्त आजच, कुठूनही, काहीही न ठरवता सुरू करू शकेल अशा दोन गोष्टी.",
                },
                locale,
              )}
            />
            <div className="flex flex-col gap-4">
              <SpinedCard spine="kumkum" interactive>
                <Link
                  href={localePath(locale, "/daily-seva/nam-jaap")}
                  className="block p-6"
                >
                  <h3 className="flex items-center gap-2 text-xl">
                    <Icon.Sparkle className="h-5 w-5 text-marigold-500" />
                    {dict.dailySeva.jaapTitle}
                  </h3>
                  <p className="mt-2 font-deva text-lg text-heading">
                    {dailySeva.namJaap.mantra}
                  </p>
                  <p className="mt-2 text-muted">{dict.dailySeva.jaapIntro}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-accent">
                    {dict.common.learnMore}
                    <Icon.ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </SpinedCard>

              <SpinedCard spine="peacock" interactive>
                <Link href={localePath(locale, "/daily-seva/upasana")} className="block p-6">
                  <h3 className="flex items-center gap-2 text-xl">
                    <Icon.Video className="h-5 w-5 text-peacock-500" />
                    {dict.dailySeva.upasanaTitle}
                  </h3>
                  <p className="mt-2 text-muted">
                    {t(
                      {
                        en: "Shri Ram Raksha and Maruti Stotra, on Zoom at 7pm Pacific, every day of the year.",
                        mr: "श्री रामरक्षा व मारुती स्तोत्र, पॅसिफिक वेळेनुसार सायंकाळी ७ वाजता झूमवर, वर्षातील प्रत्येक दिवशी.",
                      },
                      locale,
                    )}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-accent">
                    {dict.common.learnMore}
                    <Icon.ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </SpinedCard>
            </div>
          </div>
        </div>
      </Section>

      {/* ───────────────────────────────────────── every seva, explained ─── */}
      <Section tone="tint">
        <SectionHeader
          eyebrow={dict.dailySeva.scheduleTitle}
          title={t(
            { en: "Every seva, and what it is", mr: "प्रत्येक सेवा, आणि ती काय आहे" },
            locale,
          )}
          description={dict.dailySeva.weeklyNote}
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {dailySeva.schedule.map((slot) => (
            <SpinedCard
              as="li"
              key={slot.slug}
              spine={slot.mode === "in-person" ? "saffron" : "peacock"}
              interactive
            >
              <Link href={localePath(locale, `/daily-seva/${slot.slug}`)} className="block p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-2xl tabular-nums text-heading">
                    {clock(slot.time)}
                  </span>
                  <Badge tone={slot.mode === "in-person" ? "brand" : "accent"}>
                    {modeLabel(slot.mode)}
                  </Badge>
                  {slot.highlight ? <Badge tone="gold">{dict.library.featured}</Badge> : null}
                </div>

                <h3 className="mt-2 text-lg">{t(slot.title, locale)}</h3>

                <p className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold text-muted uppercase">
                  {slot.days.length === 7
                    ? t({ en: "Every day", mr: "दररोज" }, locale)
                    : slot.days.map((day) => <span key={day}>{dayName(day)}</span>)}
                  <span className="text-ink-400">
                    · {slot.durationMinutes} {dict.dailySeva.minutes}
                  </span>
                </p>

                <p className="mt-3 line-clamp-3 text-muted">{t(slot.description, locale)}</p>
              </Link>
            </SpinedCard>
          ))}
        </ul>

        <div className="mt-8">
          <Alert tone="info" title={dict.common.timezoneNote}>
            <p>
              {t(
                {
                  en: "Every time on this site is converted from the mandir's clock in San Jose into your device's timezone. If you are reading this in India, the 7pm upasana reaches you at 7.30am the next morning.",
                  mr: "या संकेतस्थळावरील प्रत्येक वेळ सॅन होजेतील केंद्राच्या घड्याळावरून तुमच्या उपकरणाच्या वेळेत रूपांतरित केली जाते. तुम्ही भारतात वाचत असाल तर सायंकाळी ७ ची उपासना तुमच्याकडे दुसऱ्या दिवशी सकाळी ७.३० ला पोहोचते.",
                },
                locale,
              )}
            </p>
          </Alert>
        </div>
      </Section>
    </>
  );
}
