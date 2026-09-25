import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { PageHero } from "@/components/shared/PageHero";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card, Section, SectionHeader } from "@/components/ui";
import { libraryByType, site } from "@/lib/content";
import { newsletterLabels } from "@/lib/form-labels";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.connect.newsletterTitle,
    description: dict.connect.newsletterBody,
    path: "/connect/newsletter",
  });
}

export default async function NewsletterPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const archive = libraryByType("newsletter");

  return (
    <>
      <PageHero
        eyebrow={dict.nav.connect}
        title={dict.connect.newsletterTitle}
        description={dict.connect.newsletterBody}
        crumbs={crumbs(
          locale,
          ["nav.connect", "/connect"],
          ["navGroups.newsletter", "/connect/newsletter"],
        )}
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
              {dict.common.viewAll}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {archive.slice(0, 3).map((item) => (
            <LibraryCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </Section>
    </>
  );
}
