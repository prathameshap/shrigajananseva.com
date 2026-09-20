import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { LibraryCard } from "@/components/shared/LibraryCard";
import { ButtonLink, Card, Container, GoldRule, Section, SectionHeader } from "@/components/ui";
import { dailySeva, libraryByType, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    title: dict.dailySeva.jaapTitle,
    description:
      "Gan Gan Ganat Bote — the nam Shri Gajanan Maharaj gave to those who asked him for a practice. How to begin, and recordings to sit with.",
  };
}

export default async function NamJaapPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const audio = libraryByType("audio");

  return (
    <>
      <PageHeader
        eyebrow={dict.nav.dailySeva}
        title={dict.dailySeva.jaapTitle}
        description={dict.dailySeva.jaapBody}
        crumbs={crumbs(
          locale,
          ["nav.dailySeva", "/daily-seva"],
          ["navGroups.namJaap", "/daily-seva/nam-jaap"],
        )}
        breadcrumbLabel={dict.nav.breadcrumb}
      />

      {/* The nam */}
      <Section tone="canvas">
        <Container width="narrow" className="px-0 text-center">
          <p className="font-deva text-5xl leading-tight text-heading sm:text-6xl">
            {dailySeva.namJaap.mantra}
          </p>
          <p className="mt-3 font-display text-xl text-accent italic">
            {dailySeva.namJaap.transliteration}
          </p>
          <GoldRule className="mx-auto mt-8 max-w-40" />
          <p className="mt-8 text-left text-lg leading-relaxed text-body">
            {t(dailySeva.namJaap.guidance, locale)}
          </p>
        </Container>
      </Section>

      {/* How to begin */}
      <Section tone="raised">
        <SectionHeader
          eyebrow="If you have never done this before"
          title="How to begin"
          description="There is no wrong way to do this, which is the part people find hardest to believe."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Start absurdly small",
              body: "One mala — 108 repetitions — takes about eleven minutes. Do that, once, and see how it sits with you. Do not commit to a year on day one.",
            },
            {
              title: "Use whatever time already exists",
              body: "The commute, the dishes, the walk from the car park. The nam does not require a cushion and a free hour; it fits into the hour you already have.",
            },
            {
              title: "When the mind wanders, begin again",
              body: "It will wander. Every practitioner's mind wanders. Noticing and returning is not the interruption of the practice — it is the practice.",
            },
          ].map((step) => (
            <Card key={step.title} className="p-6">
              <h3 className="text-lg">{step.title}</h3>
              <p className="mt-2 text-muted">{step.body}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-7">
          <h3 className="flex items-center gap-2 text-lg">
            <Icon.Users className="h-5 w-5 text-gold-500" />
            Together, on Zoom
          </h3>
          <p className="mt-3 text-muted">
            Collective nam jaap is offered every evening, and the morning Zoom session ends with
            it. Sitting with others carries you on the days when sitting alone will not.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={localePath(locale, "/daily-seva")}>
              {dict.dailySeva.scheduleTitle}
            </ButtonLink>
            {site.zoom.joinUrl ? (
              <ButtonLink href={site.zoom.joinUrl} variant="secondary" external>
                {dict.dailySeva.joinZoom}
              </ButtonLink>
            ) : (
              <ButtonLink
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Please send me the daily seva Zoom link")}`}
                variant="secondary"
              >
                Request the Zoom link
              </ButtonLink>
            )}
          </div>
        </Card>
      </Section>

      {/* Recordings */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.navGroups.audio}
          title="Recordings to sit with"
          description="Continuous jap for akhand sankalp, and a single mala for beginning."
          action={
            <ButtonLink href={localePath(locale, "/library/audio")} variant="secondary">
              {dict.common.viewAll}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {audio.slice(0, 3).map((item) => (
            <LibraryCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </Section>
    </>
  );
}
