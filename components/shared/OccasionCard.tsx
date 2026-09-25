import Link from "next/link";

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

export function OccasionCard({
  occasion,
  locale,
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
  );
}
