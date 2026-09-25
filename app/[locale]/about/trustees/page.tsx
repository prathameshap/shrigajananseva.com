import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { Card, Container, Placeholder, Section, SectionHeader } from "@/components/ui";
import { people, site } from "@/lib/content";
import { getDictionary, t } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.navGroups.trustees,
    description:
      "How Shri Gajanan Seva is governed, who serves on the board of trustees, and the seva teams that run the mandir.",
  };
}

export default async function TrusteesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { trustees, sevaTeams, governanceNote } = people;

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.about}
        title={dict.navGroups.trustees}
        description="The mandir has no paid staff. It is governed by a volunteer board and run by seva teams."
        crumbs={crumbs(locale, ["nav.about", "/about"], ["navGroups.trustees", "/about/trustees"])}
        breadcrumbLabel={dict.nav.breadcrumb}
      />

      <Section tone="canvas">
        <Container width="narrow" className="px-0">
          <p className="text-lg text-muted">{t(governanceNote, locale)}</p>
        </Container>

        <div className="mt-10">
          {trustees.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trustees.map((trustee) => (
                <Card key={trustee.name} className="p-6">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                    <Icon.Users className="h-7 w-7" />
                  </span>
                  <h2 className="mt-4 text-lg">{trustee.name}</h2>
                  <p className="text-sm font-semibold text-accent">{t(trustee.role, locale)}</p>
                  {trustee.bio ? (
                    <p className="mt-3 text-muted">{t(trustee.bio, locale)}</p>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : (
            <Placeholder title="Trustee listing is being prepared" contact={site.contact.email}>
              <p>
                The spec calls for named trustees with roles, and this page is built to show them
                — but publishing names is the trustees&apos; decision, not something to invent.
              </p>
              <p className="mt-2">
                To publish, add entries to the{" "}
                <code className="rounded bg-surface px-1.5 py-0.5 text-sm">trustees</code> array
                in{" "}
                <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                  content/data/people.json
                </code>
                . Each needs a <code className="text-sm">name</code> and a{" "}
                <code className="text-sm">role</code>; a{" "}
                <code className="text-sm">bio</code> is optional. The cards appear automatically.
              </p>
            </Placeholder>
          )}
        </div>
      </Section>

      <Section tone="raised">
        <SectionHeader
          eyebrow="How the work is divided"
          title="Seva teams"
          description="Each team is led by volunteers and is always glad of another pair of hands."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sevaTeams.map((team) => (
            <Card key={team.slug} className="p-6">
              <h3 className="text-lg">{t(team.title, locale)}</h3>
              <p className="mt-2 text-muted">{t(team.description, locale)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
