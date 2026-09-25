import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  formatDuration,
  LibraryCard,
  libraryIcon,
  libraryTypeLabel,
} from "@/components/shared/LibraryCard";
import {
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Placeholder,
  Section,
  SectionHeader,
} from "@/components/ui";
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
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {siblings.map((other) => (
              <LibraryCard key={other.slug} item={other} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

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
