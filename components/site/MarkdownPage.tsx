import { Container, Prose } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PageHeader, type Crumb } from "@/components/site/PageHeader";
import { getDictionary, type Locale } from "@/lib/i18n";
import { requirePage } from "@/lib/pages";

/**
 * Renders a prose page from `content/pages/<slug>.<locale>.md`.
 *
 * When a Marathi reader lands on a page that has not been translated yet they
 * get the English text plus an explicit note saying so — better than an empty
 * page, and honest about which pages still need a translator's seva.
 */
export function MarkdownPage({
  slug,
  locale,
  crumbs,
  aside,
  children,
}: {
  slug: string;
  locale: Locale;
  crumbs?: Crumb[];
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const page = requirePage(slug, locale);

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        crumbs={crumbs}
        breadcrumbLabel={dict.nav.breadcrumb}
      />

      <Container width={aside ? "default" : "narrow"}>
        <div className={aside ? "grid gap-12 py-14 lg:grid-cols-12" : "py-14"}>
          <div className={aside ? "lg:col-span-8" : undefined}>
            {page.fallback ? (
              <p className="mb-8 flex items-start gap-2.5 rounded-card border border-hairline bg-surface-raised p-4 text-sm text-muted">
                <Icon.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  हे पृष्ठ अद्याप मराठीत उपलब्ध नाही — खालील मजकूर इंग्रजीत आहे.
                  <span className="mt-1 block">
                    This page has not been translated into Marathi yet, so the English text is
                    shown below.
                  </span>
                </span>
              </p>
            ) : null}

            <Prose html={page.html} />

            {page.updated ? (
              <p className="mt-12 border-t border-hairline pt-5 text-sm text-muted">
                {dict.legal.lastUpdated.replace(
                  "{date}",
                  new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
                    dateStyle: "long",
                  }).format(new Date(page.updated)),
                )}
              </p>
            ) : null}

            {children}
          </div>

          {aside ? <aside className="lg:col-span-4">{aside}</aside> : null}
        </div>
      </Container>
    </>
  );
}

/** Page metadata straight from the Markdown frontmatter. */
export function markdownMetadata(slug: string, locale: Locale) {
  const page = requirePage(slug, locale);
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description },
  };
}
