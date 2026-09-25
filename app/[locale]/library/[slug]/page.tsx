import type { Metadata } from "next";
import { notFound } from "next/navigation";
<<<<<<< HEAD

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  formatDuration,
  LibraryCard,
  libraryIcon,
  libraryTypeLabel,
} from "@/components/shared/LibraryCard";
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LibraryCard } from "@/components/shared/LibraryCard";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import {
  Badge,
  ButtonLink,
  Card,
<<<<<<< HEAD
  DefinitionRow,
=======
  Container,
  GoldRule,
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
<<<<<<< HEAD
import {
  getLibraryItem,
  library,
  libraryByType,
  site,
  type LibraryType,
} from "@/lib/content";
import { getDictionary, isLocale, locales, localePath, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs } from "@/lib/route";

/**
 * Both the four type indexes and every individual item live at one path
 * segment: /library/texts alongside /library/upasana-booklet.
 *
 * That is a constraint from the URL map, not a preference — the legacy
 * WordPress URLs 301 to /library/<item-slug>, and the navigation points at
 * /library/texts. Rather than pick one and break the other, this route resolves
 * the segment as an index first and falls through to an item.
 */
const INDEXES: Record<string, { type: LibraryType; labelKey: string }> = {
  texts: { type: "text", labelKey: "textsTitle" },
  audio: { type: "audio", labelKey: "audioTitle" },
  videos: { type: "video", labelKey: "videosTitle" },
  newsletters: { type: "newsletter", labelKey: "newslettersTitle" },
};

const INDEX_PATH: Record<LibraryType, string> = {
  text: "/library/texts",
  audio: "/library/audio",
  video: "/library/videos",
  newsletter: "/library/newsletters",
};

/** The dictionary key holding each index's own heading. */
const INDEX_TITLE_KEY: Record<LibraryType, "textsTitle" | "audioTitle" | "videosTitle" | "newslettersTitle"> =
  {
    text: "textsTitle",
    audio: "audioTitle",
    video: "videosTitle",
    newsletter: "newslettersTitle",
  };

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    ...Object.keys(INDEXES).map((slug) => ({ locale, slug })),
    ...library.map((item) => ({ locale, slug: item.slug })),
  ]);
}

function indexTitle(slug: string, locale: Locale) {
  const dict = getDictionary(locale);
  const entry = INDEXES[slug];
  if (!entry) return null;
  return {
    type: entry.type,
    title: (dict.library as unknown as Record<string, string>)[entry.labelKey],
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const index = indexTitle(slug, locale);
  if (index) {
    return pageMetadata({
      locale,
      title: index.title,
      description: dict.library.intro,
      path: `/library/${slug}`,
    });
  }

  const item = getLibraryItem(slug);
  if (!item) return {};
  return pageMetadata({
    locale,
    title: t(item.title, locale),
    description: t(item.description, locale),
    path: `/library/${slug}`,
  });
}

export default async function LibrarySlugPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const index = indexTitle(slug, locale);
  if (index) return <TypeIndex locale={locale} type={index.type} title={index.title} slug={slug} />;

  const item = getLibraryItem(slug);
  if (!item) notFound();

  const Glyph = libraryIcon(item.type);
  const href = item.fileUrl ?? item.externalUrl ?? null;
  const external = Boolean(item.externalUrl && !item.fileUrl);
  const siblings = libraryByType(item.type)
    .filter((other) => other.slug !== item.slug)
    .slice(0, 3);

  const actionLabel =
    item.type === "audio"
      ? dict.library.listen
      : item.type === "video"
        ? dict.library.watch
        : dict.library.download;

  return (
    <>
      <PageHero
        eyebrow={libraryTypeLabel(item.type, locale)}
        title={t(item.title, locale)}
        description={t(item.description, locale)}
        crumbs={[
          ...crumbs(
            locale,
            ["nav.library", "/library"],
            [`library.${INDEX_TITLE_KEY[item.type]}`, INDEX_PATH[item.type]],
          ),
          { name: t(item.title, locale), href: localePath(locale, `/library/${slug}`) },
        ]}
        aside={
          <Card tone="gold" className="p-6">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-accent">
              <Glyph className="h-6 w-6" />
            </span>

            <dl className="mt-5">
              <DefinitionRow term={dict.library.languagesLabel}>
                <span className="uppercase">{item.languages.join(", ")}</span>
              </DefinitionRow>
              {item.durationMinutes ? (
                <DefinitionRow term={dict.library.durationLabel}>
                  {formatDuration(item.durationMinutes, locale)}
                </DefinitionRow>
              ) : null}
              {item.publishedOn ? (
                <DefinitionRow term={dict.library.publishedLabel}>
                  {new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-US", {
                    dateStyle: "long",
                    timeZone: "UTC",
                  }).format(new Date(item.publishedOn))}
                </DefinitionRow>
              ) : null}
            </dl>

            {href ? (
              <ButtonLink href={href} external={external} className="mt-5 w-full">
                {external ? (
                  <Icon.External className="h-5 w-5" />
                ) : (
                  <Icon.Download className="h-5 w-5" />
                )}
                {actionLabel}
              </ButtonLink>
            ) : null}
          </Card>
        }
      />

      <Section tone="canvas" width="narrow">
        {href ? (
          <div className="prose-sgs max-w-none">
            <p className="text-lg">{t(item.description, locale)}</p>
          </div>
        ) : (
          <Placeholder title={dict.library.notUploadedYet} contact={site.contact.email}>
            <p>
              {t(
                {
                  en: "The text is in use at the centre but the file has not been uploaded to the website yet. Email us and we will send it to you — there is no charge and no form.",
                  mr: "हा ग्रंथ केंद्रात वापरात आहे पण फाइल अद्याप संकेतस्थळावर चढवलेली नाही. आम्हाला ईमेल करा, आम्ही पाठवू — शुल्क नाही, अर्ज नाही.",
                },
                locale,
              )}
            </p>
            <p className="mt-2">
              To publish it, put the file in{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">public/library/</code> and
              set{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">fileUrl</code> for{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">{item.slug}</code> in{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                content/data/library.json
              </code>
              .
            </p>
          </Placeholder>
        )}
      </Section>

      {siblings.length ? (
        <Section tone="tint">
          <SectionHeader
            eyebrow={dict.nav.library}
            title={libraryTypeLabel(item.type, locale)}
            action={
              <ButtonLink
                href={localePath(locale, INDEX_PATH[item.type])}
                variant="secondary"
              >
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
<<<<<<< HEAD
            {siblings.map((other) => (
=======
            {related.map((other) => (
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
              <LibraryCard key={other.slug} item={other} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
<<<<<<< HEAD

/* --------------------------------------------------------------- indexes */

function TypeIndex({
  locale,
  type,
  title,
  slug,
}: {
  locale: Locale;
  type: LibraryType;
  title: string;
  slug: string;
}) {
  const dict = getDictionary(locale);
  const items = libraryByType(type);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.library}
        title={title}
        description={type === "video" ? dict.library.videosBody : dict.library.intro}
        crumbs={[
          ...crumbs(locale, ["nav.library", "/library"]),
          { name: title, href: localePath(locale, `/library/${slug}`) },
        ]}
      />

      <Section tone="canvas">
        {items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <LibraryCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        ) : (
          <Placeholder title={dict.common.comingSoon} contact={site.contact.email} />
        )}

        {type === "audio" ? (
          <div className="mt-10 rounded-card border border-hairline bg-surface-tint p-6">
            <Badge tone="accent">
              <Icon.Audio className="h-3.5 w-3.5" />
              {dict.common.comingSoon}
            </Badge>
            <p className="mt-3 text-muted">
              {t(
                {
                  en: "An in-page player is planned. For now the recordings download and play in whatever app your phone already uses, which is also what works best for an akhand jaap left running overnight.",
                  mr: "पानातच वाजवण्याची सोय नियोजित आहे. सध्या ध्वनिमुद्रणे डाउनलोड होतात आणि तुमच्या फोनवरील अॅपमध्ये वाजतात — रात्रभर चालू ठेवलेल्या अखंड जपासाठीही तेच सर्वात सोयीचे.",
                },
                locale,
              )}
            </p>
          </div>
        ) : null}
      </Section>
    </>
  );
}
=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
