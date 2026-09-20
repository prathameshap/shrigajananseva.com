import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonLink, Card, GoldRule, Section, SectionHeader } from "@/components/ui";
import { site, volunteer } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.navGroups.students,
    description: t(volunteer.studentProgramme.summary, locale),
  };
}

export default async function StudentsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const programme = volunteer.studentProgramme;

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.getInvolved}
        title={t(programme.title, locale)}
        description={t(programme.summary, locale)}
        crumbs={crumbs(
          locale,
          ["nav.getInvolved", "/get-involved"],
          ["navGroups.students", "/get-involved/students"],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={localePath(locale, "/contact")}>
            <Icon.Mail className="h-5 w-5" />
            Ask about joining
          </ButtonLink>
        }
      />

      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl">What students actually do</h2>
            <GoldRule className="mt-3 mb-6 max-w-32" />
            <p className="text-muted">
              This is real work with real responsibility, not a sign-in sheet. Students run
              sections of utsav that several hundred people depend on.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {programme.activities.map((activity) => (
                <li key={activity.en} className="flex gap-2.5 text-body">
                  <Icon.Check className="mt-1.5 h-4 w-4 shrink-0 text-tulsi-500" />
                  {t(activity, locale)}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl">Requirements</h2>
            <GoldRule className="mt-3 mb-6 max-w-32" />
            <ul className="flex flex-col gap-3">
              {programme.requirements.map((requirement) => (
                <li key={requirement.en} className="flex gap-2.5 text-body">
                  <Icon.ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-gold-500" />
                  {t(requirement, locale)}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-32">
              <Card className="bg-surface-raised p-6">
                <h2 className="flex items-center gap-2 text-lg">
                  <Icon.Users className="h-5 w-5 text-gold-500" />
                  For parents and guardians
                </h2>
                <p className="mt-3 text-muted">
                  {t(programme.guardianConsentNote, locale)}
                </p>
                <ButtonLink
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Student volunteer programme — guardian consent")}`}
                  variant="secondary"
                  className="mt-5 w-full"
                >
                  Request the consent form
                </ButtonLink>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg">Questions from schools</h2>
                <p className="mt-2 text-muted">
                  Counsellors and service-hour coordinators can verify any letter we have issued
                  by quoting its verification code.
                </p>
                <a
                  className="mt-4 inline-flex items-center gap-2 font-semibold text-accent hover:underline hover:underline-offset-4"
                  href={`mailto:${site.contact.email}`}
                >
                  <Icon.Mail className="h-4 w-4" />
                  {site.contact.email}
                </a>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Letter process */}
      <Section tone="raised">
        <SectionHeader
          eyebrow="After your shifts"
          title="How the service-hours letter is issued"
          description="Verified, on letterhead, with a code your school can check with us directly."
        />

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {programme.letterProcess.map((step, index) => (
            <li key={step.en}>
              <Card className="h-full p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-kumkum-700 font-display text-lg text-sandal-50">
                  {index + 1}
                </span>
                <p className="mt-4 text-body">{t(step, locale)}</p>
              </Card>
            </li>
          ))}
        </ol>

        <Card className="mt-10 p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl">Tracking your own hours</h2>
              <p className="mt-2 text-muted">
                Self-service hour logs and one-click letter downloads arrive with the devotee
                portal in the next phase. Until then, hours are logged at the volunteer desk and
                letters are issued on request by email.
              </p>
            </div>
            <ButtonLink href={localePath(locale, "/contact")} className="shrink-0">
              Request a letter
            </ButtonLink>
          </div>
        </Card>
      </Section>
    </>
  );
}
