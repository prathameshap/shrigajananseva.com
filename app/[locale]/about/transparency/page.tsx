import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import {
  ButtonLink,
  Card,
  DefinitionRow,
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.navGroups.transparency,
    description:
      "Legal name, EIN, 501(c)(3) determination letter, annual report and Form 990 for Shri Gajanan Seva.",
  };
}

/**
 * The spec calls this the highest-value, zero-build item on the site, and it
 * is right: employer matching portals, grant applications and cautious donors
 * all want these four documents, and none of them exist on the current site.
 *
 * Every row degrades honestly — a document that has not been uploaded says so
 * and gives an address to request it, rather than linking to a 404.
 */
export default async function TransparencyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { nonprofit, contact, address, legalName } = site;

  const documents = [
    {
      key: "determination",
      title: "IRS 501(c)(3) determination letter",
      description:
        "The letter confirming our federal tax-exempt status. Most employer matching portals ask for this.",
      url: nonprofit.determinationLetterUrl,
      field: "nonprofit.determinationLetterUrl",
    },
    {
      key: "annual",
      title: "Annual report",
      description:
        "What we did in the last financial year, what it cost, and what it achieved.",
      url: nonprofit.annualReportUrl,
      field: "nonprofit.annualReportUrl",
    },
    {
      key: "form990",
      title: "IRS Form 990",
      description:
        "Our annual federal information return. Public by law; published here so nobody has to go looking.",
      url: nonprofit.form990Url,
      field: "nonprofit.form990Url",
    },
  ];

  const published = documents.filter((doc) => doc.url);
  const pending = documents.filter((doc) => !doc.url);

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.about}
        title={dict.navGroups.transparency}
        description="A community that gives its money to a cause is owed a clear account of where it went. Everything a donor, an employer matching portal or a grant-maker might ask for is on this page."
        crumbs={crumbs(
          locale,
          ["nav.about", "/about"],
          ["navGroups.transparency", "/about/transparency"],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={localePath(locale, "/donate")} variant="secondary">
            <Icon.Heart className="h-4 w-4" />
            {dict.nav.donate}
          </ButtonLink>
        }
      />

      {/* Organisation details */}
      <Section tone="canvas">
        <SectionHeader
          title="Organisation details"
          description="These are the details to enter into an employer matching portal such as Benevity or YourCause."
        />

        <Card className="p-7">
          <dl>
            <DefinitionRow term={dict.donate.legalName}>{legalName}</DefinitionRow>
            <DefinitionRow term="Tax status">
              {nonprofit.status} non-profit, {nonprofit.state}
            </DefinitionRow>
            <DefinitionRow term={dict.donate.ein}>
              {nonprofit.ein ?? (
                <span className="text-muted italic">
                  Not yet published — email{" "}
                  <a
                    className="font-semibold text-accent underline underline-offset-2 not-italic"
                    href={`mailto:${contact.charityEmail}`}
                  >
                    {contact.charityEmail}
                  </a>{" "}
                  and the treasurer will send it to you the same week.
                </span>
              )}
            </DefinitionRow>
            <DefinitionRow term={dict.donate.mailingAddress}>
              {address.street}, {address.locality}, {address.region} {address.postalCode}
            </DefinitionRow>
            <DefinitionRow term="Finance contact">
              <a
                className="font-semibold text-accent underline underline-offset-2"
                href={`mailto:${contact.charityEmail}`}
              >
                {contact.charityEmail}
              </a>
            </DefinitionRow>
            <DefinitionRow term={dict.visit.phone}>
              <a className="hover:text-accent" href={`tel:${contact.phoneE164}`}>
                {contact.phone}
              </a>
            </DefinitionRow>
          </dl>
        </Card>

        {!nonprofit.ein ? (
          <div className="mt-6">
            <Placeholder title="EIN is not published on this site yet">
              <p>
                This is the single most requested piece of information on any non-profit website
                — employer matching portals cannot process a gift without it. Add it to{" "}
                <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                  content/data/site.json
                </code>{" "}
                under{" "}
                <code className="rounded bg-surface px-1.5 py-0.5 text-sm">nonprofit.ein</code>{" "}
                and it appears here, in the donate page, and in the site&apos;s structured data
                for search engines.
              </p>
            </Placeholder>
          </div>
        ) : null}
      </Section>

      {/* Documents */}
      <Section tone="raised">
        <SectionHeader
          title="Documents"
          description="Downloadable, with no account and no email address required."
        />

        {published.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {published.map((doc) => (
              <Card key={doc.key} interactive className="flex flex-col p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon.Document className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg">{doc.title}</h3>
                <p className="mt-2 flex-1 text-muted">{doc.description}</p>
                <ButtonLink
                  href={doc.url as string}
                  variant="secondary"
                  className="mt-5 w-full"
                  external
                >
                  <Icon.Download className="h-4 w-4" />
                  {dict.common.downloadPdf}
                </ButtonLink>
              </Card>
            ))}
          </div>
        ) : null}

        {pending.length ? (
          <div className={published.length ? "mt-8" : undefined}>
            <Placeholder
              title={`${pending.length} document${pending.length > 1 ? "s" : ""} awaiting upload`}
              contact={contact.charityEmail}
            >
              <ul className="mt-1 flex flex-col gap-2">
                {pending.map((doc) => (
                  <li key={doc.key}>
                    <strong className="text-heading">{doc.title}</strong> — {doc.description}
                    <br />
                    <span className="text-sm">
                      Put the PDF in{" "}
                      <code className="rounded bg-surface px-1.5 py-0.5">public/documents/</code>{" "}
                      and set{" "}
                      <code className="rounded bg-surface px-1.5 py-0.5">{doc.field}</code> in{" "}
                      <code className="rounded bg-surface px-1.5 py-0.5">
                        content/data/site.json
                      </code>
                      .
                    </span>
                  </li>
                ))}
              </ul>
            </Placeholder>
          </div>
        ) : null}
      </Section>

      {/* Employer matching */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow="Double your gift"
          title={dict.donate.matchingTitle}
          description={dict.donate.matchingBody}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg">How to do it</h3>
            <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-muted">
              <li>
                Find your employer&apos;s giving portal — most large Bay Area employers use
                Benevity, YourCause, Bright Funds or Give Lively.
              </li>
              <li>
                Search for <strong className="text-heading">{legalName}</strong>
                {nonprofit.ein ? (
                  <>
                    {" "}
                    or the EIN <strong className="text-heading">{nonprofit.ein}</strong>
                  </>
                ) : null}
                .
              </li>
              <li>Submit your match request, usually within the same calendar year as the gift.</li>
              <li>
                If the portal asks for our determination letter, email{" "}
                <a
                  className="font-semibold text-accent underline underline-offset-2"
                  href={`mailto:${contact.charityEmail}`}
                >
                  {contact.charityEmail}
                </a>{" "}
                and we will send it the same week.
              </li>
            </ol>
            <p className="mt-5 text-muted">
              Many employers also match volunteer hours with a cash grant. If yours does, log your
              seva hours and ask us for a verification letter.
            </p>
          </Card>

          <Card className="bg-surface-raised p-6">
            <h3 className="text-lg">Ways to give that cost us nothing</h3>
            <p className="mt-2 text-muted">
              Card processing takes a percentage of every gift. Zelle and check take none of it.
            </p>
            <ButtonLink
              href={localePath(locale, "/donate")}
              variant="secondary"
              className="mt-5 w-full"
            >
              {dict.donate.otherWays}
            </ButtonLink>
          </Card>
        </div>
      </Section>
    </>
  );
}
