import { Icon, socialIcon } from "@/components/icons";
import { Card } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, t, type Locale } from "@/lib/i18n";

/**
 * Every channel in `site.json`, published or not.
 *
 * An unpublished channel is rendered as a disabled card rather than hidden.
 * The WhatsApp group and channel are the two things a newcomer most often
 * arrives looking for, and "not open yet" is a far more useful answer than
 * silently omitting them and letting someone conclude they do not exist.
 */
export function ConnectStrip({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {site.social.map((channel) => {
        const Glyph = socialIcon(channel.id);
        const description = channel.description ? t(channel.description, locale) : null;

        if (!channel.url) {
          return (
            <Card as="li" key={channel.id} className="p-5 opacity-70">
              <p className="flex items-center gap-3 font-semibold text-heading">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-raised text-ink-400">
                  <Glyph className="h-5 w-5" />
                </span>
                {channel.label}
              </p>
              {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
              <p className="mt-2 text-sm font-semibold text-muted">
                {dict.connect.notPublishedYet}
              </p>
            </Card>
          );
        }

        return (
          <Card as="li" key={channel.id} interactive className="p-5">
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <p className="flex items-center gap-3 font-semibold text-heading">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Glyph className="h-5 w-5" />
                </span>
                {channel.label}
                <Icon.External className="h-4 w-4 shrink-0 text-muted" />
              </p>
              {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
              {channel.handle ? (
                <p className="mt-2 text-sm font-semibold text-accent">{channel.handle}</p>
              ) : null}
              <span className="sr-only"> ({dict.common.opensInNewTab})</span>
            </a>
          </Card>
        );
      })}
    </ul>
  );
}
