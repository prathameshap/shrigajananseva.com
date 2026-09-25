import Link from "next/link";

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
    text: dict.library.typeText,
    audio: dict.library.typeAudio,
    video: dict.library.typeVideo,
    newsletter: dict.library.typeNewsletter,
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
