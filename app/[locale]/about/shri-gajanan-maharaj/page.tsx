import type { Metadata } from "next";

import { ShrineNiche } from "@/components/decor";
import { ProsePage } from "@/components/shared/ProsePage";
import { dailySeva } from "@/lib/content";
import { pageMetadata } from "@/lib/meta";
import { requirePage } from "@/lib/pages";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = requirePage("shri-gajanan-maharaj", locale);
  return pageMetadata({
    locale,
    title: page.title,
    description: page.description,
    path: "/about/shri-gajanan-maharaj",
  });
}

export default async function MaharajPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const page = requirePage("shri-gajanan-maharaj", locale);

  return (
    <ProsePage
      page={page}
      locale={locale}
      crumbs={crumbs(
        locale,
        ["nav.about", "/about"],
        ["navGroups.maharaj", "/about/shri-gajanan-maharaj"],
      )}
      aside={
        <div className="mx-auto max-w-xs">
          <ShrineNiche>
            <p className="font-deva text-xl leading-snug text-marigold-200">
              {dailySeva.namJaap.mantra}
            </p>
          </ShrineNiche>
        </div>
      }
    />
  );
}
