import Link from "next/link";
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

export function OccasionCard({
  occasion,
  locale,
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
  );
}
