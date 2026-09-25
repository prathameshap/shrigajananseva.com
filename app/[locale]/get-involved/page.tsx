import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Eyebrow,
  Section,
  SectionHeader,
  SpinedCard,
} from "@/components/ui";
import { people, site, volunteer } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.getInvolved.title,
    description: t(volunteer.intro, locale).slice(0, 180),
    path: "/get-involved",
  });
}

export default async function GetInvolvedPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  const teamName = (slug: string) => {
    const team = people.sevaTeams.find((entry) => entry.slug === slug);
    return team ? t(team.title, locale) : slug;
  };

  const open = volunteer.opportunities.filter((item) => item.open);
  const closed = volunteer.opportunities.filter((item) => !item.open);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.getInvolved}
        title={dict.getInvolved.title}
        description={t(volunteer.intro, locale)}
        crumbs={crumbs(locale, ["nav.getInvolved", "/get-involved"])}
        aside={
          <Card tone="gold" className="p-6">
            <h2 className="text-lg">{dict.getInvolved.studentsTitle}</h2>
            <p className="mt-2 text-muted">{t(volunteer.studentProgramme.summary, locale)}</p>
            <ButtonLink
              href={localePath(locale, "/get-involved/students")}
              className="mt-5"
            >
              {dict.common.learnMore}
              <Icon.ArrowRight className="h-5 w-5" />
            </ButtonLink>
          </Card>
        }
      />

      {/* ─────────────────────────────────────────────── opportunities ─── */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.navGroups.volunteer}
          title={dict.getInvolved.opportunitiesTitle}
          action={
            <ButtonLink
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                "I would like to volunteer",
              )}`}
              variant="secondary"
            >
              <Icon.Mail className="h-4 w-4" />
              {dict.getInvolved.emailUs}
            </ButtonLink>
          }
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {[...open, ...closed].map((item) => (
            <SpinedCard
              as="li"
              key={item.slug}
              spine={item.open ? "tulsi" : "marigold"}
              className={item.open ? undefined : "opacity-85"}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Eyebrow>{teamName(item.team)}</Eyebrow>
                  <Badge tone={item.open ? "success" : "warning"}>
                    {item.open ? dict.getInvolved.openLabel : dict.getInvolved.closedLabel}
                  </Badge>
                </div>

                <h3 className="mt-2 text-xl">{t(item.title, locale)}</h3>
                <p className="mt-3 flex-1 text-muted">{t(item.description, locale)}</p>

                <dl className="mt-5">
                  <DefinitionRow term={dict.getInvolved.commitmentLabel}>
                    {t(item.commitment, locale)}
                  </DefinitionRow>
                  <DefinitionRow term={dict.getInvolved.minAgeLabel}>
                    {item.minAge}+
                  </DefinitionRow>
                </dl>

                <ButtonLink
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                    `Volunteering — ${t(item.title, locale)}`,
                  )}`}
                  variant={item.open ? "primary" : "secondary"}
                  className="mt-5 self-start"
                >
                  <Icon.Mail className="h-5 w-5" />
                  {dict.getInvolved.emailUs}
                </ButtonLink>
              </div>
            </SpinedCard>
          ))}
        </ul>
      </Section>

      {/* ──────────────────────────────────────────────── seva teams ─── */}
      <Section tone="tint">
        <SectionHeader
          eyebrow={dict.navGroups.sevaTeams}
          title={dict.about.sevaTeamsTitle}
          description={dict.about.sevaTeamsIntro}
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {people.sevaTeams.map((team) => (
            <Card as="li" key={team.slug} className="p-6">
              <h3 className="text-lg">{t(team.title, locale)}</h3>
              <p className="mt-2 text-muted">{t(team.description, locale)}</p>
            </Card>
          ))}
        </ul>
      </Section>
    </>
  );
}
