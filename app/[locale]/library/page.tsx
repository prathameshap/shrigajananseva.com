import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { ButtonLink, Card, Placeholder, Section, SectionHeader } from "@/components/ui";
import { library, site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return { title: dict.library.title, description: dict.library.intro };
}

export default async function LibraryPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const missingFiles = library.filter((item) => !item.fileUrl && !item.externalUrl);

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.library}
        title={dict.library.title}
        description={dict.library.intro}
        crumbs={crumbs(locale, ["nav.library", "/library"])}
        breadcrumbLabel={dict.nav.breadcrumb}
      />

      <Section tone="canvas">
        <LibraryFilters
          items={library.map((item) => ({
            slug: item.slug,
            type: item.type,
            languages: item.languages,
          }))}
          labels={{
            filterType: dict.library.filterType,
            filterLanguage: dict.library.filterLanguage,
            all: locale === "mr" ? "सर्व" : "All",
            noResults: dict.library.noResults,
            clearFilters: dict.occasions.clearFilters,
            typeLabels: {
              text: dict.library.typeText,
              audio: dict.library.typeAudio,
              video: dict.library.typeVideo,
              newsletter: dict.library.typeNewsletter,
            },
          }}
        >
          {library.map((item) => (
            <LibraryCard key={item.slug} item={item} locale={locale} />
          ))}
        </LibraryFilters>
      </Section>

      {missingFiles.length ? (
        <Section tone="raised">
          <Placeholder
            title={`${missingFiles.length} items are listed but not yet uploaded`}
            contact={site.contact.email}
          >
            <p>
              Each of these has a card and a page, but no file behind it yet. The structure is
              ready — the PDFs and audio simply need migrating across from the old site.
            </p>
            <p className="mt-2 text-sm">
              Put files in{" "}
              <code className="rounded bg-surface px-1.5 py-0.5">public/library/</code> and set{" "}
              <code className="rounded bg-surface px-1.5 py-0.5">fileUrl</code> on the matching
              entry in{" "}
              <code className="rounded bg-surface px-1.5 py-0.5">content/data/library.json</code>.
            </p>
          </Placeholder>
        </Section>
      ) : null}

      <Section tone={missingFiles.length ? "canvas" : "raised"}>
        <SectionHeader
          eyebrow="Browse by kind"
          title="Collections"
          description="The same library, sorted."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/library/texts", label: dict.navGroups.texts, icon: Icon.Document },
            { href: "/library/audio", label: dict.navGroups.audio, icon: Icon.Audio },
            { href: "/library/videos", label: dict.navGroups.videos, icon: Icon.Video },
            {
              href: "/library/newsletters",
              label: dict.navGroups.newsletterArchive,
              icon: Icon.News,
            },
          ].map((collection) => (
            <Card key={collection.href} interactive className="p-6">
              <a href={localePath(locale, collection.href)} className="block">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent">
                  <collection.icon className="h-5 w-5" />
                </span>
                <span className="mt-4 block font-display text-lg text-heading">
                  {collection.label}
                </span>
              </a>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <ButtonLink href={localePath(locale, "/connect/newsletter")} variant="secondary">
            {dict.navGroups.newsletter}
            <Icon.ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
