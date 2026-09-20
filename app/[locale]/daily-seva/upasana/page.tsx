import type { Metadata } from "next";
import { MarkdownPage, markdownMetadata } from "@/components/site/MarkdownPage";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getLibraryItem, site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return markdownMetadata("daily-upasana", await resolveLocale(params));
}

export default async function UpasanaPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const booklet = getLibraryItem("upasana-booklet");

  return (
    <MarkdownPage
      slug="daily-upasana"
      locale={locale}
      crumbs={crumbs(
        locale,
        ["nav.dailySeva", "/daily-seva"],
        ["navGroups.upasana", "/daily-seva/upasana"],
      )}
      aside={
        <div className="flex flex-col gap-5 lg:sticky lg:top-32">
          {booklet ? <LibraryCard item={booklet} locale={locale} /> : null}

          <Card className="bg-surface-raised p-6">
            <h2 className="flex items-center gap-2 text-lg">
              <Icon.Video className="h-5 w-5 text-gold-500" />
              {dict.dailySeva.online}
            </h2>
            <p className="mt-2 text-muted">
              Ram Raksha, Maruti Stotra and nam jaap, together on Zoom every morning.
            </p>
            {site.zoom.joinUrl ? (
              <ButtonLink href={site.zoom.joinUrl} external className="mt-5 w-full">
                {dict.dailySeva.joinZoom}
              </ButtonLink>
            ) : (
              <ButtonLink
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Please send me the daily seva Zoom link")}`}
                variant="secondary"
                className="mt-5 w-full"
              >
                Request the Zoom link
              </ButtonLink>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg">{dict.dailySeva.jaapTitle}</h2>
            <p className="mt-3 font-deva text-2xl text-heading">गण गण गणात बोते</p>
            <ButtonLink
              href={localePath(locale, "/daily-seva/nam-jaap")}
              variant="secondary"
              className="mt-5 w-full"
            >
              {dict.common.learnMore}
            </ButtonLink>
          </Card>
        </div>
      }
    />
  );
}
