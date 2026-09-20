import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Placeholder, Section } from "@/components/ui";
import { libraryByType, site, type LibraryType } from "@/lib/content";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { crumbs } from "@/lib/route";

/**
 * One collection of the library — texts, audio, video or newsletters.
 *
 * These four routes exist as their own URLs rather than as filter states
 * because the old site's separate pages (`/upasana/`, `/shri-gajanan-stotra/`,
 * `/youtube-gallery/` and the rest) are what currently rank in search, and the
 * 301s need somewhere real to land.
 */
export function CollectionPage({
  type,
  locale,
  titleKey,
  description,
  href,
}: {
  type: LibraryType;
  locale: Locale;
  titleKey: string;
  description: string;
  href: string;
}) {
  const dict = getDictionary(locale);
  const items = libraryByType(type);
  const pending = items.filter((item) => !item.fileUrl && !item.externalUrl);

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.library}
        title={titleKey}
        description={description}
        crumbs={crumbs(locale, ["nav.library", "/library"], [titleKey, href])}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={localePath(locale, "/library")} variant="secondary">
            {dict.library.title}
          </ButtonLink>
        }
      />

      <Section tone="canvas">
        {items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <LibraryCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-hairline p-10 text-center text-muted">
            {dict.library.noResults}
          </p>
        )}

        {pending.length ? (
          <div className="mt-10">
            <Placeholder
              title={`${pending.length} of these are not uploaded yet`}
              contact={site.contact.email}
            >
              <p>
                {pending.map((item) => item.title.en).join(", ")} — the page and the card exist,
                the file does not. Add it to{" "}
                <code className="rounded bg-surface px-1.5 py-0.5">public/library/</code> and set{" "}
                <code className="rounded bg-surface px-1.5 py-0.5">fileUrl</code> in{" "}
                <code className="rounded bg-surface px-1.5 py-0.5">
                  content/data/library.json
                </code>
                .
              </p>
            </Placeholder>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={localePath(locale, "/daily-seva/upasana")} variant="secondary">
            {dict.navGroups.upasana}
            <Icon.ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/connect/newsletter")} variant="secondary">
            {dict.navGroups.newsletter}
            <Icon.ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
