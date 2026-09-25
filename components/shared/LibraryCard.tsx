import Link from "next/link";
<<<<<<< HEAD

import { Icon } from "@/components/icons";
import { Badge, Eyebrow, SpinedCard } from "@/components/ui";
import type { LibraryItem, LibraryType } from "@/lib/content";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";

const SPINE = {
  text: "kumkum",
  audio: "peacock",
  video: "saffron",
  newsletter: "marigold",
} as const;

export function libraryIcon(type: LibraryType) {
  if (type === "audio") return Icon.Audio;
  if (type === "video") return Icon.Video;
  if (type === "newsletter") return Icon.News;
  return Icon.Document;
}

export function libraryTypeLabel(type: LibraryType, locale: Locale) {
  const dict = getDictionary(locale);
  return {
=======
import { Icon } from "@/components/icons";
import { Badge, Card } from "@/components/ui";
import { type LibraryItem } from "@/lib/content";
import { getDictionary, localePath, t, type Locale } from "@/lib/i18n";

const typeIcon = {
  text: Icon.Document,
  audio: Icon.Audio,
  video: Icon.Video,
  newsletter: Icon.News,
} as const;

export function LibraryCard({ item, locale }: { item: LibraryItem; locale: Locale }) {
  const dict = getDictionary(locale);
  const TypeIcon = typeIcon[item.type];
  const href = localePath(locale, `/library/${item.slug}`);

  const typeLabel = {
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
    text: dict.library.typeText,
    audio: dict.library.typeAudio,
    video: dict.library.typeVideo,
    newsletter: dict.library.typeNewsletter,
<<<<<<< HEAD
  }[type];
}

/** "1h 30m" / "24h" / "12 min" — never a bare 1440. */
export function formatDuration(minutes: number, locale: Locale) {
  const dict = getDictionary(locale);
  if (minutes < 60) return `${minutes} ${dict.dailySeva.minutes}`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function LibraryCard({ item, locale }: { item: LibraryItem; locale: Locale }) {
  const dict = getDictionary(locale);
  const Glyph = libraryIcon(item.type);
  const href = localePath(locale, `/library/${item.slug}`);
  const available = Boolean(item.fileUrl || item.externalUrl);

  return (
    <SpinedCard as="article" spine={SPINE[item.type]} interactive>
      <div className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Glyph className="h-5 w-5" />
          </span>
          {item.featured ? <Badge tone="gold">{dict.library.featured}</Badge> : null}
        </div>

        <Eyebrow className="mt-4">{libraryTypeLabel(item.type, locale)}</Eyebrow>

        <h3 className="mt-1 text-lg">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {t(item.title, locale)}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm text-muted">{t(item.description, locale)}</p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          {item.durationMinutes ? (
            <div className="flex gap-1.5">
              <dt className="font-semibold">{dict.library.durationLabel}:</dt>
              <dd>{formatDuration(item.durationMinutes, locale)}</dd>
            </div>
          ) : null}
          {item.languages.length ? (
            <div className="flex gap-1.5">
              <dt className="font-semibold">{dict.library.languagesLabel}:</dt>
              <dd className="uppercase">{item.languages.join(", ")}</dd>
            </div>
          ) : null}
        </dl>

        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1.5 self-start font-semibold text-accent hover:underline hover:underline-offset-4"
        >
          {available
            ? item.type === "audio"
              ? dict.library.listen
              : item.type === "video"
                ? dict.library.watch
                : dict.library.read
            : dict.common.learnMore}
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SpinedCard>
  );
}
=======
  }[item.type];

  const available = Boolean(item.fileUrl || item.externalUrl);

  return (
    <Card as="article" interactive className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <TypeIcon className="h-5 w-5" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge tone="neutral">{typeLabel}</Badge>
          {item.languages.map((code) => (
            <Badge key={code} tone="neutral">
              {code === "mr" ? "मराठी" : "English"}
            </Badge>
          ))}
        </div>
      </div>

      <h3 className="text-lg">
        <Link href={href} className="hover:text-brand hover:underline hover:underline-offset-4">
          {t(item.title, locale)}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-muted">{t(item.description, locale)}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline hover:underline-offset-4"
        >
          {item.type === "audio"
            ? dict.common.listen
            : item.type === "video"
              ? dict.common.watch
              : dict.library.readOnline}
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
        {!available ? (
          <span className="text-sm text-muted italic">{dict.common.comingSoon}</span>
        ) : null}
        {item.durationMinutes ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <Icon.Clock className="h-4 w-4" />
            {formatDuration(item.durationMinutes)}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

function formatDuration(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.round(minutes / 60);
    return `${hours} hr`;
  }
  return `${minutes} min`;
}
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
