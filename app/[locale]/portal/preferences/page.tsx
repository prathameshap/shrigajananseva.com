import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { Badge, Card, GoldRule, Placeholder } from "@/components/ui";
import { getDictionary, localeNames, localePath, locales } from "@/lib/i18n";
import { portal, getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.preferences, robots: { index: false, follow: false } };
}

const PURPOSE_LABEL = {
  newsletter: "Monthly newsletter",
  occasions: "Utsav and occasion announcements",
  seva: "Seva and volunteer requests",
  giving: "Receipts and giving",
} as const;

const CHANNEL_LABEL = {
  email: "Email",
  whatsapp: "WhatsApp",
  sms: "SMS",
} as const;

const PURPOSES = ["newsletter", "occasions", "seva", "giving"] as const;
const CHANNELS = ["email", "whatsapp", "sms"] as const;

export default async function PreferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session) redirect(localePath(locale, "/portal/sign-in"));

  const preferences = await portal.listPreferences(session.id);
  const lookup = new Map(
    preferences.map((pref) => [`${pref.channel}:${pref.purpose}`, pref.enabled]),
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">{dict.portal.preferences}</h1>
        <GoldRule className="mt-4 max-w-24" />
        <p className="mt-5 text-muted">
          Per channel and per purpose, not one blunt on/off switch. You can take the utsav
          announcements and skip the seva requests, or the reverse.
        </p>
      </header>

      {/* Language */}
      <Card className="p-6">
        <h2 className="flex items-center gap-2 text-lg">
          <Icon.Globe className="h-5 w-5 text-gold-500" />
          {dict.common.language}
        </h2>
        <p className="mt-2 text-muted">
          Used for emails and for the language this site opens in on your devices.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {locales.map((code) => (
            <span
              key={code}
              className={
                code === session.preferredLocale
                  ? "rounded-full bg-saffron-600 px-5 py-2 font-semibold text-sandal-50"
                  : "rounded-full border border-hairline px-5 py-2 font-semibold text-muted"
              }
            >
              {localeNames[code]}
            </span>
          ))}
        </div>
      </Card>

      {/* Matrix */}
      <Card className="overflow-x-auto">
        <div className="border-b border-hairline bg-surface-raised px-6 py-4">
          <h2 className="text-lg">Communication preferences</h2>
        </div>
        <table className="w-full min-w-[32rem] text-left">
          <caption className="sr-only">
            Communication preferences by purpose and channel
          </caption>
          <thead className="border-b border-hairline">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold text-heading">
                Purpose
              </th>
              {CHANNELS.map((channel) => (
                <th
                  key={channel}
                  scope="col"
                  className="px-6 py-3 text-center font-semibold text-heading"
                >
                  {CHANNEL_LABEL[channel]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {PURPOSES.map((purpose) => (
              <tr key={purpose}>
                <th scope="row" className="px-6 py-4 font-medium text-body">
                  {PURPOSE_LABEL[purpose]}
                </th>
                {CHANNELS.map((channel) => {
                  const enabled = lookup.get(`${channel}:${purpose}`);
                  return (
                    <td key={channel} className="px-6 py-4 text-center">
                      {enabled === undefined ? (
                        <span className="text-ink-400" aria-label="Not applicable">
                          —
                        </span>
                      ) : enabled ? (
                        <Icon.Check
                          className="mx-auto h-5 w-5 text-tulsi-500"
                          title="Subscribed"
                        />
                      ) : (
                        <Icon.Close
                          className="mx-auto h-5 w-5 text-ink-400"
                          title="Not subscribed"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Placeholder title="Changing these needs somewhere to save them">
        <p>
          The preference model is built — per channel, per purpose, with consent recorded — but
          writing a change needs the database. Unsubscribe links in emails will always work
          regardless, because that is a statutory requirement rather than a feature.
        </p>
      </Placeholder>

      <Card className="bg-surface-raised p-6">
        <h2 className="text-lg">{dict.portal.privacy}</h2>
        <p className="mt-2 text-muted">
          Export everything we hold on you, or ask us to delete it.
        </p>
        <a
          className="mt-4 inline-flex items-center gap-2 font-semibold text-accent hover:underline hover:underline-offset-4"
          href={localePath(locale, "/portal/privacy")}
        >
          {dict.portal.privacy}
          <Icon.ArrowRight className="h-4 w-4" />
        </a>
        <Badge tone="neutral" className="mt-4 block w-fit">
          CCPA / CPRA
        </Badge>
      </Card>
    </div>
  );
}
