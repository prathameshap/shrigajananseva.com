import Link from "next/link";
<<<<<<< HEAD

import { Icon } from "@/components/icons";
import { LocalTime } from "@/components/shared/LocalTime";
import { Badge, Eyebrow, SpinedCard } from "@/components/ui";
import { capacityState, placesLeft, site, type Occasion } from "@/lib/content";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";

const SPINE = {
  utsav: "kumkum",
  upasana: "peacock",
  "seva-drive": "tulsi",
} as const;

export function typeLabel(type: Occasion["type"], locale: Locale) {
  const dict = getDictionary(locale);
  if (type === "utsav") return dict.occasions.typeUtsav;
  if (type === "upasana") return dict.occasions.typeUpasana;
  return dict.occasions.typeSevaDrive;
}

/** The capacity pill. Returns null for an uncapped occasion rather than "∞". */
export function CapacityBadge({
  occasion,
  locale,
}: {
  occasion: Occasion;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const state = capacityState(occasion);
  const left = placesLeft(occasion);

  if (state === "uncapped") return null;
  if (state === "full") return <Badge tone="warning">{dict.occasions.capacityFull}</Badge>;
  if (state === "waitlist")
    return <Badge tone="warning">{dict.occasions.capacityWaitlist}</Badge>;
  if (state === "filling")
    return (
      <Badge tone="warning">
        {dict.occasions.placesLeft.replace("{count}", String(left))}
      </Badge>
    );
  return <Badge tone="success">{dict.occasions.capacityOpen}</Badge>;
}
=======
import { Icon } from "@/components/icons";
import { Badge, Card, cx } from "@/components/ui";
import { LocalTime } from "@/components/shared/LocalTime";
import { capacityState, placesLeft, site, type Occasion } from "@/lib/content";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";

const typeTone = {
  utsav: "brand",
  upasana: "accent",
  "seva-drive": "success",
} as const;

const typeLabel: Record<Occasion["type"], { en: string; mr: string }> = {
  utsav: { en: "Utsav", mr: "उत्सव" },
  upasana: { en: "Upasana", mr: "उपासना" },
  "seva-drive": { en: "Seva drive", mr: "सेवा उपक्रम" },
};
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f

export function OccasionCard({
  occasion,
  locale,
<<<<<<< HEAD
  past,
}: {
  occasion: Occasion;
  locale: Locale;
  past?: boolean;
}) {
  const dict = getDictionary(locale);
  const href = localePath(locale, `/occasions/${occasion.slug}`);

  return (
    <SpinedCard
      as="article"
      spine={SPINE[occasion.type]}
      interactive
      className={past ? "opacity-85" : undefined}
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Eyebrow>{typeLabel(occasion.type, locale)}</Eyebrow>
          {occasion.onlineJoin ? (
            <Badge tone="accent" className="px-2 py-0 text-xs">
              <Icon.Video className="h-3 w-3" />
              {dict.occasions.onlineJoin}
            </Badge>
          ) : null}
        </div>

        <h3 className="mt-2 text-xl">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {t(occasion.title, locale)}
          </Link>
        </h3>

        <p className="mt-3 flex items-start gap-2 font-semibold text-body">
          <Icon.Calendar className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
          <LocalTime
            iso={occasion.start}
            locale={locale}
            serverZone={site.timezone}
            mode="datetime"
          />
        </p>

        {!occasion.dateConfirmed ? (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-marigold-700">
            <Icon.Info className="h-4 w-4 shrink-0" />
            {dict.occasions.dateToBeConfirmed}
          </p>
        ) : null}

        <p className="mt-3 flex-1 text-muted">{t(occasion.summary, locale)}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!past ? <CapacityBadge occasion={occasion} locale={locale} /> : null}
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline hover:underline-offset-4"
          >
            {past || !occasion.rsvpOpen ? dict.common.learnMore : dict.occasions.rsvp}
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </SpinedCard>
=======
  featured = false,
}: {
  occasion: Occasion;
  locale: Locale;
  featured?: boolean;
}) {
  const dict = getDictionary(locale);
  const href = localePath(locale, `/occasions/${occasion.slug}`);
  const state = capacityState(occasion);
  const left = placesLeft(occasion);

  const capacityBadge = {
    open: { tone: "success" as const, label: dict.occasions.capacityOpen },
    filling: { tone: "warning" as const, label: dict.occasions.capacityFilling },
    waitlist: { tone: "warning" as const, label: dict.occasions.capacityWaitlist },
    full: { tone: "neutral" as const, label: dict.occasions.capacityFull },
    uncapped: null,
  }[state];

  return (
    <Card
      as="article"
      interactive
      className={cx("flex h-full flex-col p-6", featured && "sm:p-8")}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone={typeTone[occasion.type]}>{typeLabel[occasion.type][locale]}</Badge>
        {occasion.onlineJoin ? (
          <Badge tone="neutral">
            <Icon.Video className="h-3.5 w-3.5" />
            {dict.dailySeva.online}
          </Badge>
        ) : null}
        {capacityBadge ? <Badge tone={capacityBadge.tone}>{capacityBadge.label}</Badge> : null}
      </div>

      <h3 className={cx("text-xl", featured && "sm:text-2xl")}>
        <Link href={href} className="hover:text-brand hover:underline hover:underline-offset-4">
          {t(occasion.title, locale)}
        </Link>
      </h3>

      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-accent">
        <Icon.Calendar className="h-4 w-4" />
        <LocalTime iso={occasion.start} locale={locale} serverZone={site.timezone} mode="date" />
        <span aria-hidden="true">·</span>
        <LocalTime iso={occasion.start} locale={locale} serverZone={site.timezone} mode="time" />
        {!occasion.dateConfirmed ? (
          <span className="font-normal text-muted italic">(date to be confirmed)</span>
        ) : null}
      </p>

      <p className="mt-3 flex-1 text-muted">{t(occasion.summary, locale)}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline hover:underline-offset-4"
        >
          {dict.common.learnMore}
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
        {left != null && left > 0 && state !== "open" ? (
          <span className="text-sm text-muted">
            {dict.occasions.spotsLeft.replace("{count}", String(left))}
          </span>
        ) : null}
      </div>
    </Card>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  );
}
