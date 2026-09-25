import type { Metadata } from "next";
<<<<<<< HEAD

import { Icon } from "@/components/icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { PageHero } from "@/components/shared/PageHero";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card, Section, SectionHeader } from "@/components/ui";
import { libraryByType, site } from "@/lib/content";
import { newsletterLabels } from "@/lib/form-labels";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card, Container, Section, SectionHeader } from "@/components/ui";
import { libraryByType, site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
<<<<<<< HEAD
  return pageMetadata({
    locale,
    title: dict.connect.newsletterTitle,
    description: dict.connect.newsletterBody,
    path: "/connect/newsletter",
  });
=======
  return { title: dict.connect.newsletterTitle, description: dict.connect.newsletterBody };
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}

export default async function NewsletterPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
<<<<<<< HEAD
  const archive = libraryByType("newsletter");

  return (
    <>
      <PageHero
=======
  const issues = libraryByType("newsletter");

  return (
    <>
      <PageHeader
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        eyebrow={dict.nav.connect}
        title={dict.connect.newsletterTitle}
        description={dict.connect.newsletterBody}
        crumbs={crumbs(
          locale,
          ["nav.connect", "/connect"],
          ["navGroups.newsletter", "/connect/newsletter"],
        )}
<<<<<<< HEAD
        aside={
          <Card tone="gold" className="p-6">
            <NewsletterForm
              labels={newsletterLabels(locale)}
              fallbackEmail={site.contact.email}
            />
            <p className="mt-5 border-t border-gold-400/40 pt-4 text-sm text-muted">
              <a
                className="font-semibold text-accent underline underline-offset-2"
                href={localePath(locale, "/legal/privacy")}
              >
                {dict.legal.privacy}
              </a>
            </p>
          </Card>
        }
      />

      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.navGroups.newsletter}
          title={dict.library.newslettersTitle}
          description={t(
            {
              en: "Past issues, so you can see what you are signing up for before you hand over an email address.",
              mr: "मागील अंक — ईमेल देण्यापूर्वी तुम्ही कशासाठी नोंदणी करत आहात ते पाहता येईल.",
            },
            locale,
          )}
          action={
            <ButtonLink
              href={localePath(locale, "/library/newsletters")}
              variant="secondary"
            >
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
              {dict.common.viewAll}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
<<<<<<< HEAD
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {archive.slice(0, 3).map((item) => (
            <LibraryCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      </Section>
    </>
  );
}
