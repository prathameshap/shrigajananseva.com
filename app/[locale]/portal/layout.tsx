import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge, Container } from "@/components/ui";
import { PortalNav } from "@/components/portal/PortalNav";
import { signOut } from "@/lib/portal/actions";
import { getSession } from "@/lib/portal/session";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { lookup, portalNav } from "@/lib/nav";
import { resolveLocale } from "@/lib/route";

/**
 * Every portal screen is per-devotee and must never be cached or prerendered.
 * Without this the build bakes the signed-out redirect into a static page and
 * serves it to signed-in devotees.
 */
export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const session = await getSession();

  // The sign-in screen renders inside this layout too, without the sidebar.
  if (!session) {
    return <div className="festive-wash min-h-[70vh]">{children}</div>;
  }

  const items = portalNav.map((item) => ({
    href: localePath(locale, item.href),
    label: lookup(dict, item.labelKey),
  }));

  return (
    <div className="bg-surface-raised">
      {/* Demonstration notice — shown on every portal screen, deliberately. */}
      <div className="border-b border-gold-400 bg-accent-soft">
        <Container width="wide">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm text-accent">
            <Icon.Info className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{dict.portal.demoBanner}</span>
            <Link
              href={localePath(locale, "/portal/about-this-demo")}
              className="underline underline-offset-2 hover:text-brand"
            >
              {dict.portal.demoBannerCta}
            </Link>
          </p>
        </Container>
      </div>

      <Container width="wide">
        <div className="flex flex-col gap-8 py-10 lg:flex-row lg:gap-12">
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-32">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-kumkum-700 font-display text-lg text-sandal-50">
                  {initials(session.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-heading">
                    {session.name}
                  </span>
                  <span className="block truncate text-sm text-muted">{session.email}</span>
                </span>
              </div>

              <PortalNav items={items} />

              <form action={signOut} className="mt-6">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="w-full rounded-full border border-hairline bg-surface px-4 py-2.5 font-semibold text-heading hover:border-gold-400"
                >
                  {dict.portal.signOut}
                </button>
              </form>

              <Badge tone="neutral" className="mt-5">
                {(locale satisfies Locale) === "mr" ? "प्रात्यक्षिक" : "Demonstration data"}
              </Badge>
            </div>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </Container>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
