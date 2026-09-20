import Link from "next/link";
import { Icon } from "@/components/icons";
import { ButtonLink, Card, Container, GoldRule } from "@/components/ui";
import { defaultLocale, getDictionary, localePath } from "@/lib/i18n";

/**
 * The rebuild moved almost every URL, and while `next.config.ts` carries a 301
 * for each known old path, the old site accumulated links nobody has a record
 * of. This page assumes that is what happened and points at the likely
 * destination rather than apologising.
 */
export default function NotFound() {
  const locale = defaultLocale;
  const dict = getDictionary(locale);

  const suggestions = [
    { href: "/", label: dict.nav.home },
    { href: "/visit", label: dict.nav.visit },
    { href: "/daily-seva", label: dict.nav.dailySeva },
    { href: "/occasions", label: dict.nav.occasions },
    { href: "/library", label: dict.nav.library },
    { href: "/donate", label: dict.nav.donate },
    { href: "/contact", label: dict.navGroups.contact },
  ];

  return (
    <div className="festive-wash">
      <Container width="narrow">
        <div className="py-20 sm:py-28">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-kumkum-700 text-sandal-50">
            <Icon.Lotus className="h-8 w-8" />
          </span>

          <h1 className="mt-8 text-4xl sm:text-5xl">{dict.errors.notFoundTitle}</h1>
          <GoldRule className="mt-6 max-w-32" />
          <p className="mt-6 text-lg text-muted">{dict.errors.notFoundBody}</p>

          <Card className="mt-10 p-6">
            <h2 className="text-lg">Where you might have been going</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {suggestions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localePath(locale, item.href)}
                    className="inline-flex items-center gap-2 font-semibold text-accent hover:underline hover:underline-offset-4"
                  >
                    <Icon.ChevronRight className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={localePath(locale, "/")} size="lg">
              {dict.errors.goHome}
            </ButtonLink>
            <ButtonLink href={localePath(locale, "/contact")} variant="secondary" size="lg">
              Tell us what you were looking for
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
