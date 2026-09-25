import type { Metadata } from "next";
<<<<<<< HEAD

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
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { Badge, ButtonLink, Card, Section, SectionHeader } from "@/components/ui";
import { people, upcomingOccasions, volunteer } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
<<<<<<< HEAD
  return pageMetadata({
    locale,
    title: dict.getInvolved.title,
    description: t(volunteer.intro, locale).slice(0, 180),
    path: "/get-involved",
  });
=======
  return { title: dict.getInvolved.title, description: dict.getInvolved.intro };
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}

export default async function GetInvolvedPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

<<<<<<< HEAD
  const teamName = (slug: string) => {
    const team = people.sevaTeams.find((entry) => entry.slug === slug);
    return team ? t(team.title, locale) : slug;
  };

  const open = volunteer.opportunities.filter((item) => item.open);
  const closed = volunteer.opportunities.filter((item) => !item.open);

  return (
    <>
      <PageHero
=======
  const teamName = new Map(people.sevaTeams.map((team) => [team.slug, t(team.title, locale)]));
  const nextNeeds = upcomingOccasions(new Date(), 3).filter(
    (occasion) => occasion.volunteerNeeds.length > 0,
  );

  return (
    <>
      <PageHeader
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        eyebrow={dict.nav.getInvolved}
        title={dict.getInvolved.title}
        description={t(volunteer.intro, locale)}
        crumbs={crumbs(locale, ["nav.getInvolved", "/get-involved"])}
<<<<<<< HEAD
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
=======
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={localePath(locale, "/get-involved/students")} variant="secondary">
            {dict.navGroups.students}
          </ButtonLink>
        }
      />

      {/* Opportunities */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow="Where hands are needed"
          title={dict.getInvolved.opportunities}
          description="Pick something that fits the time you actually have, not the time you wish you had."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {volunteer.opportunities.map((opportunity) => (
            <Card key={opportunity.slug} className="flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{teamName.get(opportunity.team) ?? opportunity.team}</Badge>
                {opportunity.minAge >= 18 ? <Badge tone="warning">18+</Badge> : null}
                {!opportunity.open ? <Badge tone="neutral">Closed</Badge> : null}
              </div>

              <h3 className="mt-4 text-lg">{t(opportunity.title, locale)}</h3>
              <p className="mt-2 flex-1 text-muted">{t(opportunity.description, locale)}</p>

              <dl className="mt-5 flex flex-col gap-1.5 border-t border-hairline pt-4 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted">Commitment</dt>
                  <dd className="font-semibold text-heading">
                    {t(opportunity.commitment, locale)}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Minimum age</dt>
                  <dd className="font-semibold text-heading">{opportunity.minAge}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>

        <Card className="mt-10 bg-surface-raised p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl">Ready to start?</h2>
              <p className="mt-2 text-muted">
                Shift signup and rosters arrive with the devotee portal in the next phase. Until
                then the quickest route is the oldest one — tell us what you would like to do and
                a seva lead will be in touch.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href={localePath(locale, "/contact")}>
                <Icon.Mail className="h-5 w-5" />
                {dict.connect.contactTitle}
              </ButtonLink>
              <ButtonLink href={localePath(locale, "/portal")} variant="secondary">
                {dict.nav.portal}
              </ButtonLink>
            </div>
          </div>
        </Card>
      </Section>

      {/* Immediate needs */}
      {nextNeeds.length ? (
        <Section tone="raised">
          <SectionHeader
            eyebrow="Coming up"
            title="Volunteers needed soon"
            description="These are the occasions in the next few months where hands are short."
            action={
              <ButtonLink href={localePath(locale, "/occasions")} variant="secondary">
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {nextNeeds.map((occasion) => (
              <Card key={occasion.slug} className="p-6">
                <h3 className="text-lg">
                  <a
                    href={localePath(locale, `/occasions/${occasion.slug}`)}
                    className="hover:text-brand hover:underline hover:underline-offset-4"
                  >
                    {t(occasion.title, locale)}
                  </a>
                </h3>
                <ul className="mt-4 flex flex-col gap-2">
                  {occasion.volunteerNeeds.map((need) => (
                    <li key={need.en} className="flex gap-2.5 text-muted">
                      <Icon.Users className="mt-1 h-4 w-4 shrink-0 text-gold-500" />
                      {t(need, locale)}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Seva teams */}
      <Section tone={nextNeeds.length ? "canvas" : "raised"}>
        <SectionHeader
          eyebrow="How the work is organised"
          title="Seva teams"
          description="Each team is led by volunteers and is always glad of another pair of hands."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.sevaTeams.map((team) => (
            <Card key={team.slug} className="p-6">
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
              <h3 className="text-lg">{t(team.title, locale)}</h3>
              <p className="mt-2 text-muted">{t(team.description, locale)}</p>
            </Card>
          ))}
<<<<<<< HEAD
        </ul>
=======
        </div>
      </Section>

      {/* Students */}
      <Section tone={nextNeeds.length ? "raised" : "canvas"}>
        <Card className="p-7 sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Badge tone="accent">{dict.navGroups.students}</Badge>
              <h2 className="mt-4 text-2xl">{t(volunteer.studentProgramme.title, locale)}</h2>
              <p className="mt-3 text-muted">{t(volunteer.studentProgramme.summary, locale)}</p>
            </div>
            <ButtonLink
              href={localePath(locale, "/get-involved/students")}
              size="lg"
              className="shrink-0"
            >
              {dict.common.learnMore}
              <Icon.ArrowRight className="h-5 w-5" />
            </ButtonLink>
          </div>
        </Card>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      </Section>
    </>
  );
}
