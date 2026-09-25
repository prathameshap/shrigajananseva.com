import type { Metadata } from "next";
<<<<<<< HEAD

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Alert,
  ButtonLink,
  Card,
  NumberedStep,
  Section,
  SectionHeader,
} from "@/components/ui";
import { site, volunteer } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonLink, Card, GoldRule, Section, SectionHeader } from "@/components/ui";
import { site, volunteer } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
<<<<<<< HEAD
  const programme = volunteer.studentProgramme;
  return pageMetadata({
    locale,
    title: t(programme.title, locale),
    description: t(programme.summary, locale).slice(0, 180),
    path: "/get-involved/students",
  });
=======
  const dict = getDictionary(locale);
  return {
    title: dict.navGroups.students,
    description: t(volunteer.studentProgramme.summary, locale),
  };
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}

export default async function StudentsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const programme = volunteer.studentProgramme;

  return (
    <>
<<<<<<< HEAD
      <PageHero
=======
      <PageHeader
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        eyebrow={dict.nav.getInvolved}
        title={t(programme.title, locale)}
        description={t(programme.summary, locale)}
        crumbs={crumbs(
          locale,
          ["nav.getInvolved", "/get-involved"],
          ["navGroups.students", "/get-involved/students"],
        )}
<<<<<<< HEAD
        aside={
          <Card tone="gold" className="p-6">
            <h2 className="text-lg">{dict.getInvolved.consentTitle}</h2>
            <p className="mt-2 text-muted">{t(programme.guardianConsentNote, locale)}</p>
            <ButtonLink
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                "Guardian consent form — student volunteering",
              )}`}
              className="mt-5"
            >
              <Icon.Mail className="h-5 w-5" />
              {t({ en: "Request the form", mr: "अर्ज मागवा" }, locale)}
            </ButtonLink>
          </Card>
        }
      />

      {/* ───────────────────────────────────────── activities + asks ─── */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow={dict.navGroups.students}
              title={dict.getInvolved.activitiesTitle}
            />
            <ul className="flex flex-col gap-3">
              {programme.activities.map((activity) => (
                <Card as="li" key={activity.en} className="flex gap-3 p-5">
                  <Icon.Check className="mt-0.5 h-5 w-5 shrink-0 text-tulsi-500" />
                  <span className="text-body">{t(activity, locale)}</span>
                </Card>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader
              eyebrow={dict.navGroups.students}
              title={dict.getInvolved.requirementsTitle}
            />
            <ul className="flex flex-col gap-3">
              {programme.requirements.map((requirement) => (
                <Card as="li" key={requirement.en} className="flex gap-3 p-5">
                  <Icon.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-body">{t(requirement, locale)}</span>
                </Card>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────── the letter ─── */}
      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.navGroups.students}
              title={dict.getInvolved.letterTitle}
              description={t(
                {
                  en: "Schools want a signed letter on letterhead with a verifiable total. Here is exactly how one gets produced, so there are no surprises the week it is due.",
                  mr: "शाळांना लेटरहेडवर स्वाक्षरित पत्र आणि पडताळता येणारी एकूण संख्या हवी असते. ते कसे तयार होते ते नेमके येथे आहे, जेणेकरून मुदतीच्या आठवड्यात आश्चर्य नको.",
                },
                locale,
              )}
            />
            <Alert tone="warning">
              <p>
                {t(
                  {
                    en: "Every student asks in the same fortnight of May. Ask two weeks before your deadline, not two days.",
                    mr: "सर्व विद्यार्थी मे महिन्याच्या त्याच पंधरवड्यात मागतात. मुदतीच्या दोन दिवस आधी नको, दोन आठवडे आधी मागा.",
                  },
                  locale,
                )}
              </p>
            </Alert>
          </div>

          <div className="lg:col-span-7">
            <ol className="flex flex-col gap-4">
              {programme.letterProcess.map((step, index) => (
                <NumberedStep key={step.en} index={index + 1} title={t(step, locale)} />
              ))}
            </ol>
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
          </div>
        </div>
      </Section>

<<<<<<< HEAD
      {/* ──────────────────────────────────────────────────── get going ─── */}
      <Section tone="canvas" width="narrow">
        <SectionHeader
          eyebrow={dict.navGroups.contact}
          title={t({ en: "Start this month", mr: "या महिन्यात सुरुवात करा" }, locale)}
          description={t(
            {
              en: "Email us with your name, your school and roughly how many hours you need. We will tell you which upcoming shifts have room.",
              mr: "तुमचे नाव, शाळा आणि अंदाजे किती तास हवे आहेत ते ईमेल करा. कोणत्या येणाऱ्या पाळ्यांत जागा आहे ते आम्ही सांगू.",
            },
            locale,
          )}
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink
            href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
              "Student service hours",
            )}&body=${encodeURIComponent(
              "Name:\nSchool:\nHours needed:\nDeadline:\nWeekends I can do:\n",
            )}`}
            size="lg"
          >
            <Icon.Mail className="h-5 w-5" />
            {dict.getInvolved.emailUs}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/occasions")} variant="secondary" size="lg">
            <Icon.Calendar className="h-5 w-5" />
            {dict.occasions.title}
          </ButtonLink>
        </div>
=======
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
                <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron-600 font-display text-lg text-sandal-50">
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      </Section>
    </>
  );
}
