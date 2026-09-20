import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { MarkdownPage, markdownMetadata } from "@/components/site/MarkdownPage";
import { ButtonLink, Card } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return markdownMetadata("about", await resolveLocale(params));
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <MarkdownPage
      slug="about"
      locale={locale}
      crumbs={crumbs(locale, ["nav.about", "/about"])}
      aside={
        <div className="flex flex-col gap-5 lg:sticky lg:top-32">
          <Card className="p-6">
            <h2 className="text-lg">Read next</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                { href: "/about/shri-gajanan-maharaj", label: dict.navGroups.maharaj },
                { href: "/about/trustees", label: dict.navGroups.trustees },
                { href: "/about/transparency", label: dict.navGroups.transparency },
                { href: "/visit", label: dict.visit.firstVisit },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={localePath(locale, link.href)}
                    className="inline-flex items-center gap-2 font-semibold text-accent hover:underline hover:underline-offset-4"
                  >
                    <Icon.ChevronRight className="h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-surface-raised p-6">
            <h2 className="text-lg">{dict.home.donateTitle}</h2>
            <p className="mt-2 text-sm text-muted">{dict.home.donateBody}</p>
            <ButtonLink href={localePath(locale, "/donate")} className="mt-5 w-full">
              <Icon.Heart className="h-4 w-4" />
              {dict.nav.donate}
            </ButtonLink>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg">{dict.footer.contactHeading}</h2>
            <address className="mt-3 flex flex-col gap-2 text-muted not-italic">
              <span>
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </span>
              <a className="hover:text-accent" href={`tel:${site.contact.phoneE164}`}>
                {site.contact.phone}
              </a>
              <a className="hover:text-accent" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </address>
          </Card>
        </div>
      }
    />
  );
}
