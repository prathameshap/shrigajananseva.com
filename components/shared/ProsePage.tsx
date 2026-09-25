import { PageHero } from "@/components/shared/PageHero";
import { Alert, Section } from "@/components/ui";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { PageDoc } from "@/lib/pages";

/**
 * A Markdown-backed page.
 *
 * `fallback` is true when a Marathi reader is being shown the English file
 * because `<slug>.mr.md` does not exist yet. That is surfaced rather than
 * hidden: being quietly handed a language you did not ask for is disorienting,
 * and the note tells the reader it is a gap rather than a mistake they made.
 */
export function ProsePage({
  page,
  locale,
  crumbs,
  aside,
  children,
}: {
  page: PageDoc;
  locale: Locale;
  crumbs?: { name: string; href: string }[];
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        crumbs={crumbs}
        aside={aside}
      />

      <Section tone="canvas" width="narrow">
        {page.fallback ? (
          <Alert tone="info">
            <p>{dict.common.showingEnglish}</p>
          </Alert>
        ) : null}

        <div
          className="prose-sgs mt-8 max-w-none first:mt-0"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />

        {page.updated ? (
          <p className="mt-10 border-t border-hairline pt-5 text-sm text-muted">
            {dict.legal.lastUpdated}:{" "}
            {new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
              dateStyle: "long",
              timeZone: "UTC",
            }).format(new Date(page.updated))}
          </p>
        ) : null}
      </Section>

      {children}
    </>
  );
}
