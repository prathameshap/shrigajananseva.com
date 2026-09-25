import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { ButtonLink, Card, Container, GoldRule } from "@/components/ui";
import { getDictionary, localePath } from "@/lib/i18n";
import { getSession } from "@/lib/portal/session";
import { resolveLocale } from "@/lib/route";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About this demonstration",
    robots: { index: false, follow: false },
  };
}

/**
 * An honest inventory of what is real and what is not.
 *
 * Trustees reviewing the portal need to know exactly which screens are live
 * behaviour and which are scaffolding, without having to ask.
 */
export default async function AboutDemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const signedIn = Boolean(await getSession());

  const real = [
    "Every screen, layout and state you can navigate to",
    "Timezone conversion — all times render in your own timezone",
    "Capacity, waitlist thresholds and places-remaining logic",
    "QR ticket codes, generated server-side and genuinely scannable",
    "Occasion data, funds, library and schedule — from content/data/",
    "Bilingual EN / मराठी rendering with English fallback",
    "The public rights-request form, with statutory response clocks",
  ];

  const notReal = [
    {
      title: "Authentication",
      detail:
        "No magic link is emailed and no Google sign-in exists. Any address opens the same fictional household. The session cookie gates nothing.",
    },
    {
      title: "The household you are looking at",
      detail:
        "Members, RSVPs, donations and attendance are invented sample records. No real devotee data is stored anywhere.",
    },
    {
      title: "Writing anything",
      detail:
        "RSVP submit, household editing and preference changes are disabled rather than silently discarding input. There is no database behind them.",
    },
    {
      title: "Card donations",
      detail:
        "No payment processor is connected. The donate flow builds the gift correctly and then tells you plainly that card giving is not live.",
    },
    {
      title: "Receipts, statements and service letters",
      detail: "These generate from the treasurer's ledger, which is the admin console phase.",
    },
  ];

  return (
    <Container width={signedIn ? "default" : "narrow"} className={signedIn ? "px-0" : undefined}>
      <div className={signedIn ? "" : "py-16"}>
        <header>
          <h1 className="text-3xl">About this demonstration</h1>
          <GoldRule className="mt-4 max-w-24" />
          <p className="mt-5 text-lg text-muted">
            The portal is built against a stub data layer while the backend and database are
            designed. Here is exactly where the line falls.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 text-lg">
              <Icon.Check className="h-5 w-5 text-tulsi-500" />
              Real and working
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {real.map((item) => (
                <li key={item} className="flex gap-2.5 text-muted">
                  <Icon.Check className="mt-1.5 h-4 w-4 shrink-0 text-tulsi-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-gold-400 bg-accent-soft/40 p-6">
            <h2 className="flex items-center gap-2 text-lg">
              <Icon.Info className="h-5 w-5 text-accent" />
              Not real yet
            </h2>
            <dl className="mt-4 flex flex-col gap-4">
              {notReal.map((item) => (
                <div key={item.title}>
                  <dt className="font-semibold text-heading">{item.title}</dt>
                  <dd className="mt-0.5 text-sm text-muted">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="text-lg">What turning it on involves</h2>
          <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-muted">
            <li>
              Provision a database and implement{" "}
              <code className="rounded bg-surface-raised px-1.5 py-0.5 text-sm">
                PortalRepository
              </code>{" "}
              against it — the interface is already defined in{" "}
              <code className="rounded bg-surface-raised px-1.5 py-0.5 text-sm">
                lib/portal/types.ts
              </code>
              .
            </li>
            <li>
              Swap one export in{" "}
              <code className="rounded bg-surface-raised px-1.5 py-0.5 text-sm">
                lib/portal/session.ts
              </code>
              . No screen changes.
            </li>
            <li>
              Replace the demo session with real passwordless auth and Google sign-in, in{" "}
              <code className="rounded bg-surface-raised px-1.5 py-0.5 text-sm">
                lib/portal/actions.ts
              </code>
              .
            </li>
            <li>Add write methods and server actions for RSVP, household and preferences.</li>
            <li>Connect a payment processor and a mail provider.</li>
          </ol>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={localePath(locale, "/portal")}>{dict.portal.dashboard}</ButtonLink>
          <ButtonLink href={localePath(locale, "/")} variant="secondary">
            {dict.nav.home}
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
