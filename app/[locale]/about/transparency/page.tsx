import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
import { funds, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.about.transparencyTitle,
    description: dict.about.transparencyIntro,
    path: "/about/transparency",
  });
}

export default async function TransparencyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const np = site.nonprofit;

  const documents = [
    { label: dict.about.determinationLetter, url: np.determinationLetterUrl },
    { label: dict.about.annualReport, url: np.annualReportUrl },
    { label: dict.about.form990, url: np.form990Url },
  ];
  const published = documents.filter((doc) => doc.url);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.about}
        title={dict.about.transparencyTitle}
        description={dict.about.transparencyIntro}
        crumbs={crumbs(
          locale,
          ["nav.about", "/about"],
          ["navGroups.transparency", "/about/transparency"],
        )}
      />

      {/* ------------------------------------------------ registration facts */}
      <Section tone="canvas">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow={dict.nav.about}
              title={t(
                { en: "Registration", mr: "नोंदणी" },
                locale,
              )}
            />
            <Card className="p-7">
              <dl>
                <DefinitionRow term={dict.about.legalNameLabel}>{site.legalName}</DefinitionRow>
                <DefinitionRow term={dict.about.statusLabel}>
                  <Badge tone="success">{np.status}</Badge>
                </DefinitionRow>
                <DefinitionRow term={dict.about.stateLabel}>{np.state}</DefinitionRow>
                <DefinitionRow term={dict.about.einLabel}>
                  {np.ein ? (
                    <span className="font-semibold tabular-nums text-heading">{np.ein}</span>
                  ) : (
                    <span className="italic">
                      {t(
                        {
                          en: "Not published yet — email us and we will send it",
                          mr: "अद्याप प्रकाशित नाही — आम्हाला ईमेल करा, आम्ही पाठवू",
                        },
                        locale,
                      )}
                    </span>
                  )}
                </DefinitionRow>
                <DefinitionRow
                  term={t({ en: "Registered address", mr: "नोंदणीकृत पत्ता" }, locale)}
                >
                  {site.address.street}, {site.address.locality}, {site.address.region}{" "}
                  {site.address.postalCode}
                </DefinitionRow>
              </dl>
            </Card>

            <Alert tone="info" title={t({ en: "Tax deductibility", mr: "करवजावट" }, locale)}>
              <p>{dict.about.deductibleNote}</p>
            </Alert>
          </div>

          {/* ------------------------------------------------------ documents */}
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.about.documentsTitle}
              title={dict.about.documentsTitle}
            />
            {published.length ? (
              <ul className="flex flex-col gap-3">
                {published.map((doc) => (
                  <Card as="li" key={doc.label} interactive className="p-5">
                    <a
                      href={doc.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 font-semibold text-heading"
                    >
                      <span className="flex items-center gap-3">
                        <Icon.Document className="h-5 w-5 shrink-0 text-accent" />
                        {doc.label}
                      </span>
                      <Icon.Download className="h-5 w-5 shrink-0 text-muted" />
                    </a>
                  </Card>
                ))}
              </ul>
            ) : (
              <Placeholder
                title="The filings are not uploaded yet"
                contact={site.contact.charityEmail}
              >
                <p>
                  The IRS determination letter, the annual report and the most recent Form 990 are
                  all public documents and we will publish them here. Until then, ask and we will
                  email you any of them.
                </p>
                <p className="mt-2">
                  To publish them, put the PDFs in{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                    public/documents/
                  </code>{" "}
                  and set the three URL fields under{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-sm">nonprofit</code> in{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                    content/data/site.json
                  </code>
                  .
                </p>
              </Placeholder>
            )}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- where it goes */}
      <Section tone="tint">
        <SectionHeader
          eyebrow={dict.nav.donate}
          title={dict.donate.fundsTitle}
          description={t(
            {
              en: "Every donation is assigned to one of these. A restricted fund is spent on that activity and nothing else — the board approves each use.",
              mr: "प्रत्येक देणगी यांपैकी एकाला दिली जाते. राखीव निधी त्याच कामावर खर्च होतो, अन्य कशावरही नाही — प्रत्येक वापर मंडळ मंजूर करते.",
            },
            locale,
          )}
          action={
            <ButtonLink href={localePath(locale, "/donate")} variant="secondary">
              {dict.nav.donate}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {funds.map((fund) => (
            <Card as="li" key={fund.slug} className="p-6">
              <h3 className="text-lg">{t(fund.title, locale)}</h3>
              <p className="mt-2 text-muted">{t(fund.description, locale)}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* --------------------------------------------------------- asking */}
      <Section tone="canvas" width="narrow">
        <SectionHeader
          eyebrow={dict.navGroups.contact}
          title={t(
            { en: "Ask us for anything not here", mr: "येथे नसलेले काहीही विचारा" },
            locale,
          )}
          description={t(
            {
              en: "Any devotee may ask to see the minutes of a board meeting or the accounts for a particular drive, and we will send them. You do not need to give a reason.",
              mr: "कोणताही भक्त मंडळाच्या बैठकीचे इतिवृत्त किंवा विशिष्ट उपक्रमाचा हिशोब मागू शकतो, आणि आम्ही तो पाठवू. कारण द्यायची गरज नाही.",
            },
            locale,
          )}
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${site.contact.charityEmail}`}>
            <Icon.Mail className="h-5 w-5" />
            {site.contact.charityEmail}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/contact")} variant="secondary">
            {dict.contact.formTitle}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
