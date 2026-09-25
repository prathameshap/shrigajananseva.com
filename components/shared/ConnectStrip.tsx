import { Icon, socialIcon } from "@/components/icons";
<<<<<<< HEAD
import { Card } from "@/components/ui";
=======
import { Card, Placeholder } from "@/components/ui";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import { site } from "@/lib/content";
import { getDictionary, t, type Locale } from "@/lib/i18n";

/**
<<<<<<< HEAD
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
=======
 * Every channel the sangha uses, in one strip.
 *
 * The WhatsApp community and announcement channel are the two that matter
 * most day to day and are entirely absent from the current site. Channels
 * without a published URL render as "being set up" rather than a dead link.
 */
export function ConnectStrip({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pending = site.social.filter((channel) => !channel.url);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.social
          .filter((channel) => channel.url)
          .map((channel) => {
            const ChannelIcon = socialIcon(channel.id);
            return (
              <Card key={channel.id} interactive className="p-5">
                <a
                  href={channel.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <ChannelIcon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-heading">{channel.label}</span>
                    <span className="block truncate text-sm text-muted">
                      {channel.description
                        ? t(channel.description, locale)
                        : (channel.handle ?? "")}
                    </span>
                  </span>
                  <Icon.External className="h-4 w-4 shrink-0 text-muted" />
                </a>
              </Card>
            );
          })}
      </div>

      {pending.length ? (
        <Placeholder title="WhatsApp channels are being set up" contact={site.contact.email}>
          <p>
            {pending.map((channel) => channel.label).join(" and ")} will appear here as soon as
            the invite links are published. Add the links to{" "}
            <code className="rounded bg-surface-raised px-1.5 py-0.5 text-sm">
              content/data/site.json
            </code>{" "}
            and these cards go live.
          </p>
        </Placeholder>
      ) : null}

      <p className="text-sm text-muted">{dict.connect.intro}</p>
    </div>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  );
}
