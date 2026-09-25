import type { Metadata } from "next";

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
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const programme = volunteer.studentProgramme;
  return pageMetadata({
    locale,
    title: t(programme.title, locale),
    description: t(programme.summary, locale).slice(0, 180),
    path: "/get-involved/students",
  });
}

export default async function StudentsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const programme = volunteer.studentProgramme;

  return (
    <>
      <PageHero
        eyebrow={dict.nav.getInvolved}
        title={t(programme.title, locale)}
        description={t(programme.summary, locale)}
        crumbs={crumbs(
          locale,
          ["nav.getInvolved", "/get-involved"],
          ["navGroups.students", "/get-involved/students"],
        )}
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
          </div>
        </div>
      </Section>

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
      </Section>
    </>
  );
}
