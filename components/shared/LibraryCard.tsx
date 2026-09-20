import Link from "next/link";
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
    text: dict.library.typeText,
    audio: dict.library.typeAudio,
    video: dict.library.typeVideo,
    newsletter: dict.library.typeNewsletter,
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
