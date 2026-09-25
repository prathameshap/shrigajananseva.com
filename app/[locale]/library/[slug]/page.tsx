import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LibraryCard } from "@/components/shared/LibraryCard";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  GoldRule,
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
import { getLibraryItem, library, libraryByType, site } from "@/lib/content";
import { getDictionary, locales, localePath, t, type Locale } from "@/lib/i18n";
import { crumbs, resolveLocale } from "@/lib/route";

/** Static segments (`/library/texts` and friends) win over this dynamic one. */
const RESERVED = new Set(["texts", "audio", "videos", "newsletters"]);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    library
      .filter((item) => !RESERVED.has(item.slug))
      .map((item) => ({ locale, slug: item.slug })),
  );
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const item = getLibraryItem(slug);
  if (!item) return {};
  const locale = (locales as readonly string[]).includes(raw) ? (raw as Locale) : "en";
  return {
    title: t(item.title, locale),
    description: t(item.description, locale),
    alternates: { canonical: `/${locale}/library/${slug}` },
  };
}

export default async function LibraryItemPage({ params }: Params) {
  const { slug } = await params;
  const locale = await resolveLocale(params as unknown as Promise<{ locale: string }>);
  const item = getLibraryItem(slug);
  if (!item) notFound();

  const dict = getDictionary(locale);
  const related = libraryByType(item.type)
    .filter((other) => other.slug !== item.slug)
    .slice(0, 3);

  const typeLabel = {
    text: dict.library.typeText,
    audio: dict.library.typeAudio,
    video: dict.library.typeVideo,
    newsletter: dict.library.typeNewsletter,
  }[item.type];

  const collectionHref = {
    text: "/library/texts",
    audio: "/library/audio",
    video: "/library/videos",
    newsletter: "/library/newsletters",
  }[item.type];

  const available = item.fileUrl || item.externalUrl;

  return (
    <>
      <PageHeader
        eyebrow={typeLabel}
        title={t(item.title, locale)}
        description={t(item.description, locale)}
        crumbs={crumbs(
          locale,
          ["nav.library", "/library"],
          [typeLabel, collectionHref],
          [t(item.title, locale), `/library/${item.slug}`],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          available ? (
            <ButtonLink
              href={(item.fileUrl ?? item.externalUrl) as string}
              external={Boolean(item.externalUrl)}
            >
              {item.type === "audio" ? (
                <Icon.Play className="h-5 w-5" />
              ) : item.type === "video" ? (
                <Icon.Video className="h-5 w-5" />
              ) : (
                <Icon.Download className="h-5 w-5" />
              )}
              {item.type === "audio"
                ? dict.common.listen
                : item.type === "video"
                  ? dict.common.watch
                  : dict.common.downloadPdf}
            </ButtonLink>
          ) : undefined
        }
      />

      <Container>
        <div className="grid gap-12 py-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Audio player */}
            {item.type === "audio" && item.fileUrl ? (
              <Card className="p-6">
                <h2 className="text-lg">{dict.common.listen}</h2>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio controls preload="none" src={item.fileUrl} className="mt-4 w-full">
                  Your browser cannot play audio.{" "}
                  <a href={item.fileUrl}>Download the recording instead.</a>
                </audio>
              </Card>
            ) : null}

            {/* Video */}
            {item.type === "video" && item.externalUrl ? (
              <Card className="p-6">
                <h2 className="text-lg">{dict.common.watch}</h2>
                <p className="mt-2 text-muted">
                  Recordings are published on our YouTube channel. Opening them there rather than
                  embedding them here keeps third-party tracking cookies off this site.
                </p>
                <ButtonLink href={item.externalUrl} external className="mt-5">
                  <Icon.Youtube className="h-5 w-5" />
                  Open the channel
                </ButtonLink>
              </Card>
            ) : null}

            {/* Not yet uploaded */}
            {!available ? (
              <Placeholder title="This file has not been uploaded yet" contact={site.contact.email}>
                <p>
                  The entry exists and the page is ready — the file itself still needs migrating
                  from the old site.
                </p>
                <p className="mt-2 text-sm">
                  Place it in{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5">public/library/</code> and set{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5">fileUrl</code> on{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5">{item.slug}</code> in{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5">
                    content/data/library.json
                  </code>
                  .
                </p>
              </Placeholder>
            ) : null}

            <section className="mt-10">
              <h2 className="text-2xl">About this text</h2>
              <GoldRule className="mt-3 mb-6 max-w-32" />
              <p className="text-lg leading-relaxed text-body">{t(item.description, locale)}</p>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-5 lg:sticky lg:top-32">
              <Card className="p-6">
                <h2 className="text-lg">Details</h2>
                <dl className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{dict.library.filterType}</dt>
                    <dd className="font-semibold text-heading">{typeLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{dict.library.filterLanguage}</dt>
                    <dd className="flex gap-1.5">
                      {item.languages.map((code) => (
                        <Badge key={code} tone="neutral">
                          {code === "mr" ? "मराठी" : "English"}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  {item.durationMinutes ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">{dict.library.duration}</dt>
                      <dd className="font-semibold text-heading">
                        {item.durationMinutes >= 60
                          ? `${Math.round(item.durationMinutes / 60)} hr`
                          : `${item.durationMinutes} min`}
                      </dd>
                    </div>
                  ) : null}
                  {item.publishedOn ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">{dict.library.published}</dt>
                      <dd className="font-semibold text-heading">
                        {new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
                          dateStyle: "long",
                        }).format(new Date(item.publishedOn))}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {available ? (
                  <ButtonLink
                    href={(item.fileUrl ?? item.externalUrl) as string}
                    external={Boolean(item.externalUrl)}
                    className="mt-6 w-full"
                  >
                    <Icon.Download className="h-4 w-4" />
                    {dict.common.download}
                  </ButtonLink>
                ) : null}
              </Card>

              <Card className="bg-surface-raised p-6">
                <h2 className="text-lg">{dict.navGroups.upasana}</h2>
                <p className="mt-2 text-muted">
                  How this fits into the daily practice at the mandir.
                </p>
                <ButtonLink
                  href={localePath(locale, "/daily-seva/upasana")}
                  variant="secondary"
                  className="mt-5 w-full"
                >
                  {dict.common.readMore}
                </ButtonLink>
              </Card>
            </div>
          </aside>
        </div>
      </Container>

      {related.length ? (
        <Section tone="raised">
          <SectionHeader
            title="More in this collection"
            action={
              <ButtonLink href={localePath(locale, collectionHref)} variant="secondary">
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((other) => (
              <LibraryCard key={other.slug} item={other} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
