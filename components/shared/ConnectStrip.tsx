import { Icon, socialIcon } from "@/components/icons";
import { Card, Placeholder } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, t, type Locale } from "@/lib/i18n";

/**
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
  );
}
