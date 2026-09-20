import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card, Container, Section, SectionHeader } from "@/components/ui";
import { libraryByType, site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return { title: dict.connect.newsletterTitle, description: dict.connect.newsletterBody };
}

export default async function NewsletterPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const issues = libraryByType("newsletter");

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.connect}
        title={dict.connect.newsletterTitle}
        description={dict.connect.newsletterBody}
        crumbs={crumbs(
          locale,
          ["nav.connect", "/connect"],
          ["navGroups.newsletter", "/connect/newsletter"],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
      />

      <Container width="narrow">
        <div className="py-14">
          <Card className="p-7 sm:p-8">
            <h2 className="text-2xl">{dict.connect.subscribeCta}</h2>
            <p className="mt-2 text-muted">
              Enter your email and we will send you a confirmation link. Nothing is sent until you
              click it.
            </p>
            <div className="mt-6">
              <NewsletterForm locale={locale} />
            </div>
          </Card>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Icon.Calendar,
                title: "Monthly, on the last day",
                body: "Devotees have kept this seva going without interruption for close to two years.",
              },
              {
                icon: Icon.Check,
                title: "Double opt-in",
                body: "You confirm by email before anything is sent, and your consent is recorded with its date.",
              },
              {
                icon: Icon.Close,
                title: "Unsubscribe any time",
                body: "A link in every issue. No explanation needed, and it takes effect immediately.",
              },
              {
                icon: Icon.Info,
                title: "Never sold or shared",
                body: "Shri Gajanan Seva does not sell or share any personal information that is collected.",
              },
            ].map((point) => (
              <Card key={point.title} className="flex gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <point.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-heading">{point.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{point.body}</span>
                </span>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted">
            Prefer to ask a person? Email{" "}
            <a
              className="font-semibold text-accent underline underline-offset-2"
              href={`mailto:${site.contact.newsletterEmail}`}
            >
              {site.contact.newsletterEmail}
            </a>{" "}
            and a volunteer will add you.
          </p>
        </div>
      </Container>

      <Section tone="raised">
        <SectionHeader
          eyebrow={dict.navGroups.newsletterArchive}
          title="Past issues"
          description="Every issue stays available here."
          action={
            <ButtonLink href={localePath(locale, "/library/newsletters")} variant="secondary">
              {dict.common.viewAll}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        {issues.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {issues.slice(0, 3).map((issue) => (
              <LibraryCard key={issue.slug} item={issue} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-hairline p-10 text-center text-muted">
            The archive is being migrated across from the old site.
          </p>
        )}
      </Section>
    </>
  );
}
