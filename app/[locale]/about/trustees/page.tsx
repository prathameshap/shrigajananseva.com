import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { LotusMark } from "@/components/decor";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink, Card, Placeholder, Section, SectionHeader } from "@/components/ui";
import { people, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.about.trusteesTitle,
    description: dict.about.trusteesIntro,
    path: "/about/trustees",
  });
}

export default async function TrusteesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.about}
        title={dict.about.trusteesTitle}
        description={dict.about.trusteesIntro}
        crumbs={crumbs(
          locale,
          ["nav.about", "/about"],
          ["navGroups.trustees", "/about/trustees"],
        )}
      />

      <Section tone="canvas">
        {people.trustees.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {people.trustees.map((trustee) => (
              <Card as="li" key={trustee.name} className="p-6">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-saffron-500 to-kumkum-600 text-sandal-50">
                  <LotusMark className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg">{trustee.name}</h2>
                <p className="mt-1 font-semibold text-accent">{t(trustee.role, locale)}</p>
                {trustee.bio ? (
                  <p className="mt-3 text-muted">{t(trustee.bio, locale)}</p>
                ) : null}
              </Card>
            ))}
          </ul>
        ) : (
          <Placeholder
            title="The trustees are not listed here yet"
            contact={site.contact.email}
          >
            <p>
              The board has not yet decided which names and photographs may be published. The
              governance arrangements below are accurate and complete in the meantime — they are
              what actually determines how decisions get made and how money is spent.
            </p>
            <p className="mt-2">
              To publish the board, add entries to{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
                content/data/people.json
              </code>{" "}
              under <code className="rounded bg-surface px-1.5 py-0.5 text-sm">trustees</code>.
            </p>
          </Placeholder>
        )}
      </Section>

      <Section tone="tint" width="narrow">
        <SectionHeader eyebrow={dict.nav.about} title={dict.about.governanceTitle} />
        <div className="prose-sgs max-w-none">
          <p>{t(people.governanceNote, locale)}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={localePath(locale, "/about/transparency")}>
            {dict.navGroups.transparency}
            <Icon.ArrowRight className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/contact")} variant="secondary">
            <Icon.Mail className="h-5 w-5" />
            {dict.navGroups.contact}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
