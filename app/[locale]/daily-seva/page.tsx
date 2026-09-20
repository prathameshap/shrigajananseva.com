import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { TodayPanel } from "@/components/home/TodayPanel";
import {
  Badge,
  ButtonLink,
  Card,
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
import { dailySeva, featuredLibrary, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.dailySeva.title,
    description:
      "Bhupali Aarti, Shrungar Seva, Ram Raksha and Maruti Stotra on Zoom, collective nam jaap and Shejarati — the daily timetable, shown in your own timezone.",
  };
}

export default async function DailySevaPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const audio = featuredLibrary().filter((item) => item.type === "audio");

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.dailySeva}
        title={dict.dailySeva.title}
        description={dict.dailySeva.intro}
        crumbs={crumbs(locale, ["nav.dailySeva", "/daily-seva"])}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          site.zoom.joinUrl ? (
            <ButtonLink href={site.zoom.joinUrl} external>
              <Icon.Video className="h-5 w-5" />
              {dict.dailySeva.joinZoom}
            </ButtonLink>
          ) : undefined
        }
      />

      {/* Live timetable */}
      <Section tone="canvas">
        <TodayPanel
          locale={locale}
          mandirTimezone={site.timezone}
          zoomUrl={site.zoom.joinUrl}
          scheduleHref={localePath(locale, "/daily-seva/upasana")}
          slots={dailySeva.schedule.map((slot) => ({
            slug: slot.slug,
            time: slot.time,
            durationMinutes: slot.durationMinutes,
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
            timezoneNote: dict.common.timezoneNote,
            viewFullSchedule: dict.navGroups.upasana,
            zoomUnavailable: "Zoom link available on request",
          }}
        />
      </Section>

      {/* Each seva explained */}
      <Section tone="raised">
        <SectionHeader
          eyebrow="What each one is"
          title={dict.dailySeva.scheduleTitle}
          description="You are welcome to join any part of this, or none of it. Nobody keeps a register."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {dailySeva.schedule.map((slot) => (
            <Card key={slot.slug} className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg">{t(slot.title, locale)}</h3>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-accent">
                    {displayHour(slot.time)} · {slot.durationMinutes} min
                  </p>
                </div>
                <Badge tone={slot.mode === "in-person" ? "neutral" : "accent"}>
                  {slot.mode === "in-person"
                    ? dict.dailySeva.inPerson
                    : slot.mode === "online"
                      ? dict.dailySeva.online
                      : dict.dailySeva.both}
                </Badge>
              </div>
              <p className="mt-3 flex-1 text-muted">{t(slot.description, locale)}</p>
              {slot.highlight ? (
                <p className="mt-4 rounded-xl bg-accent-soft p-3 text-sm font-semibold text-accent">
                  New to all this? Start here — it needs nothing but a link and half an hour.
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </Section>

      {/* Joining online */}
      <Section tone="canvas">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="p-7">
            <h2 className="flex items-center gap-2 text-xl">
              <Icon.Video className="h-5 w-5 text-gold-500" />
              Joining on Zoom
            </h2>
            <p className="mt-3 text-muted">{t(site.zoom.note, locale)}</p>

            {site.zoom.joinUrl ? (
              <>
                <dl className="mt-5 flex flex-col gap-2 text-muted">
                  {site.zoom.meetingId ? (
                    <div className="flex gap-3">
                      <dt className="w-32 font-semibold text-heading">Meeting ID</dt>
                      <dd className="font-mono tabular-nums">{site.zoom.meetingId}</dd>
                    </div>
                  ) : null}
                  {site.zoom.passcode ? (
                    <div className="flex gap-3">
                      <dt className="w-32 font-semibold text-heading">Passcode</dt>
                      <dd className="font-mono">{site.zoom.passcode}</dd>
                    </div>
                  ) : null}
                </dl>
                <ButtonLink href={site.zoom.joinUrl} external className="mt-6 w-full">
                  {dict.dailySeva.joinZoom}
                </ButtonLink>
              </>
            ) : (
              <div className="mt-5">
                <Placeholder
                  title="The Zoom link is not published on the site yet"
                  contact={site.contact.email}
                >
                  <p>
                    Daily seva on Zoom is one of the most valuable things this community offers
                    and it is currently invisible to anyone who is not already on the WhatsApp
                    group. Add{" "}
                    <code className="rounded bg-surface px-1.5 py-0.5 text-sm">zoom.joinUrl</code>{" "}
                    to{" "}
                    <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                      content/data/site.json
                    </code>{" "}
                    and the join button appears here, on the home page, and in the live-now card.
                  </p>
                </Placeholder>
              </div>
            )}
          </Card>

          <Card className="bg-surface-raised p-7">
            <h2 className="text-xl">{t(dailySeva.sankalp.title, locale)}</h2>
            <p className="mt-3 text-muted">{t(dailySeva.sankalp.description, locale)}</p>
            <ButtonLink
              href={localePath(locale, "/contact")}
              variant="secondary"
              className="mt-6"
            >
              Speak to a trustee
            </ButtonLink>
          </Card>
        </div>
      </Section>

      {/* Nam jaap */}
      <Section tone="brand">
        <div className="mx-auto max-w-3xl text-center">
          <Icon.Sparkle className="mx-auto h-8 w-8 text-marigold-300" />
          <h2 className="mt-5 font-deva text-4xl text-sandal-50 sm:text-5xl">
            {dailySeva.namJaap.mantra}
          </h2>
          <p className="mt-2 font-display text-lg text-marigold-300 italic">
            {dailySeva.namJaap.transliteration}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-sandal-200">
            {t(dailySeva.namJaap.guidance, locale)}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={localePath(locale, "/daily-seva/nam-jaap")} variant="onbrand">
              {dict.dailySeva.jaapTitle}
            </ButtonLink>
            {audio.length ? (
              <ButtonLink
                href={localePath(locale, "/library/audio")}
                variant="secondary"
                className="border-sandal-400/40 bg-transparent text-sandal-100 hover:bg-night-700"
              >
                <Icon.Audio className="h-4 w-4" />
                {dict.navGroups.audio}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Upasana */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.navGroups.upasana}
          title="Following the upasana at home"
          description="The full order of the daily upasana, with every aarti and stotra in sequence."
          action={
            <ButtonLink href={localePath(locale, "/daily-seva/upasana")}>
              {dict.common.readMore}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
      </Section>
    </>
  );
}

function displayHour(value: string) {
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute} ${suffix}`;
}
