import type { Metadata } from "next";
import Image from "next/image";
import { MarkdownPage, markdownMetadata } from "@/components/site/MarkdownPage";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card } from "@/components/ui";
import { getLibraryItem } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return markdownMetadata("shri-gajanan-maharaj", await resolveLocale(params));
}

export default async function MaharajPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const grantha = getLibraryItem("gajanan-vijay-grantha");

  return (
    <MarkdownPage
      slug="shri-gajanan-maharaj"
      locale={locale}
      crumbs={crumbs(
        locale,
        ["nav.about", "/about"],
        ["navGroups.maharaj", "/about/shri-gajanan-maharaj"],
      )}
      aside={
        <div className="flex flex-col gap-5 lg:sticky lg:top-32">
          <figure>
            <div className="overflow-hidden rounded-card border-4 border-gold-400 shadow-lift">
              <Image
                src="/images/shri-gajanan-maharaj.jpg"
                alt="Shri Gajanan Maharaj of Shegaon, seated in padmasana beneath a tree"
                width={701}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 22rem"
                className="h-auto w-full"
              />
            </div>
          </figure>

          {grantha ? <LibraryCard item={grantha} locale={locale} /> : null}

          <Card className="bg-surface-raised p-6">
            <h2 className="text-lg">{dict.dailySeva.jaapTitle}</h2>
            <p className="mt-3 font-deva text-2xl text-heading">गण गण गणात बोते</p>
            <p className="mt-1 text-sm text-muted italic">Gan Gan Ganat Bote</p>
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
