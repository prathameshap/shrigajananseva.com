import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { ProsePage } from "@/components/shared/ProsePage";
import { ButtonLink, Card, Section, SectionHeader, SpinedCard } from "@/components/ui";
import { people } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { requirePage } from "@/lib/pages";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = requirePage("about", locale);
  return pageMetadata({
    locale,
    title: page.title,
    description: page.description,
    path: "/about",
  });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const page = requirePage("about", locale);

  return (
    <ProsePage
      page={page}
      locale={locale}
      crumbs={crumbs(locale, ["nav.about", "/about"])}
      aside={
        <Card tone="gold" className="p-6">
          <h2 className="text-lg">{dict.common.onThisPage}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              { href: "/about/shri-gajanan-maharaj", label: dict.navGroups.maharaj },
              { href: "/about/trustees", label: dict.navGroups.trustees },
              { href: "/about/transparency", label: dict.navGroups.transparency },
              { href: "/visit", label: dict.visit.firstVisit },
            ].map((item) => (
              <li key={item.href}>
                <ButtonLink
                  href={localePath(locale, item.href)}
                  variant="secondary"
                  className="w-full justify-between"
                >
                  {item.label}
                  <Icon.ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Card>
      }
    >
      <Section tone="tint" id="seva-teams">
        <SectionHeader
          eyebrow={dict.navGroups.sevaTeams}
          title={dict.about.sevaTeamsTitle}
          description={dict.about.sevaTeamsIntro}
          action={
            <ButtonLink href={localePath(locale, "/get-involved")} variant="secondary">
              {dict.navGroups.volunteer}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {people.sevaTeams.map((team, index) => (
            <SpinedCard
              key={team.slug}
              as="article"
              spine={
                (["saffron", "peacock", "kumkum", "tulsi", "marigold"] as const)[index % 5]
              }
            >
              <div className="p-6">
                <h3 className="text-lg">{t(team.title, locale)}</h3>
                <p className="mt-2 text-muted">{t(team.description, locale)}</p>
              </div>
            </SpinedCard>
          ))}
        </div>
      </Section>
    </ProsePage>
  );
}
