import type { Metadata } from "next";
<<<<<<< HEAD
import Link from "next/link";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import { LibraryCard, libraryIcon } from "@/components/shared/LibraryCard";
import { ButtonLink, Section, SectionHeader, SpinedCard } from "@/components/ui";
import { library, libraryByType, site, type LibraryType } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { ButtonLink, Card, Placeholder, Section, SectionHeader } from "@/components/ui";
import { library, site } from "@/lib/content";
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
    title: dict.library.title,
    description: dict.library.intro,
    path: "/library",
  });
}

/** The four index pages, in the order they appear in the navigation. */
const SECTIONS: { type: LibraryType; path: string; spine: "kumkum" | "peacock" | "saffron" | "marigold" }[] =
  [
    { type: "text", path: "/library/texts", spine: "kumkum" },
    { type: "audio", path: "/library/audio", spine: "peacock" },
    { type: "video", path: "/library/videos", spine: "saffron" },
    { type: "newsletter", path: "/library/newsletters", spine: "marigold" },
  ];

export default async function LibraryPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  const titles: Record<LibraryType, string> = {
    text: dict.library.textsTitle,
    audio: dict.library.audioTitle,
    video: dict.library.videosTitle,
    newsletter: dict.library.newslettersTitle,
  };

  const featured = library.filter((item) => item.featured);

  return (
    <>
      <PageHero
=======
  return { title: dict.library.title, description: dict.library.intro };
}

export default async function LibraryPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const missingFiles = library.filter((item) => !item.fileUrl && !item.externalUrl);

  return (
    <>
      <PageHeader
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        eyebrow={dict.nav.library}
        title={dict.library.title}
        description={dict.library.intro}
        crumbs={crumbs(locale, ["nav.library", "/library"])}
<<<<<<< HEAD
      />

      {/* ──────────────────────────────────────────────── the four shelves ─── */}
      <Section tone="canvas">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section) => {
            const Glyph = libraryIcon(section.type);
            const count = libraryByType(section.type).length;
            return (
              <SpinedCard as="li" key={section.type} spine={section.spine} interactive>
                <Link href={localePath(locale, section.path)} className="block p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                    <Glyph className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 text-lg">{titles[section.type]}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {count} {t({ en: "items", mr: "नोंदी" }, locale)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-accent">
                    {dict.common.viewAll}
                    <Icon.ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </SpinedCard>
            );
          })}
        </ul>
      </Section>

      {/* ─────────────────────────────────────────────────────── featured ─── */}
      {featured.length ? (
        <Section tone="tint">
          <SectionHeader
            eyebrow={dict.library.featured}
            title={t(
              { en: "What devotees reach for most", mr: "भक्त सर्वाधिक वापरतात ते" },
              locale,
            )}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <LibraryCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* ───────────────────────────────────────────────── everything else ─── */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.nav.library}
          title={t({ en: "Everything we publish", mr: "आम्ही प्रकाशित करतो ते सर्व" }, locale)}
          description={t(
            {
              en: "Free to download, free to print and free to share. If a file you need is missing or will not open, tell us and we will send it.",
              mr: "विनामूल्य डाउनलोड, छपाई व वाटप. हवी असलेली फाइल नसेल किंवा उघडत नसेल तर सांगा, आम्ही पाठवू.",
            },
            locale,
          )}
          action={
            <ButtonLink href={`mailto:${site.contact.email}`} variant="secondary">
              <Icon.Mail className="h-4 w-4" />
              {dict.contact.mailtoFallback}
            </ButtonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {library.map((item) => (
            <LibraryCard key={item.slug} item={item} locale={locale} />
          ))}
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        </div>
      </Section>
    </>
  );
}
