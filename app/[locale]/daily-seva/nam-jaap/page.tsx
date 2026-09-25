import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { MandalaField } from "@/components/decor";
import { PageHero } from "@/components/shared/PageHero";
import { LibraryCard } from "@/components/shared/LibraryCard";
import {
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  GoldRule,
  NumberedStep,
  Section,
  SectionHeader,
} from "@/components/ui";
import { dailySeva, libraryByType } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.dailySeva.jaapTitle,
    description: t(dailySeva.namJaap.guidance, locale).slice(0, 180),
    path: "/daily-seva/nam-jaap",
  });
}

export default async function NamJaapPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { namJaap, sankalp } = dailySeva;
  const recordings = libraryByType("audio").filter((item) =>
    item.slug.startsWith("gan-gan-ganat-bote"),
  );

  const howTo = [
    {
      title: { en: "Say it", mr: "म्हणा" },
      body: {
        en: "Aloud, under your breath, or silently in your head. All three count and no authority has ever ranked them.",
        mr: "मोठ्याने, हळू, किंवा मनात. तिन्ही चालतात आणि कोणत्याही अधिकाऱ्याने त्यांचा क्रम लावलेला नाही.",
      },
    },
    {
      title: { en: "Anywhere, at any time", mr: "कुठेही, कधीही" },
      body: {
        en: "Cooking, driving on 880, waiting for a scan result. There is no prescribed hour, no required posture, no need to have bathed first.",
        mr: "स्वयंपाक करताना, ८८० वर गाडी चालवताना, तपासणीच्या निकालाची वाट पाहताना. ठरलेली वेळ नाही, आवश्यक आसन नाही, आधी स्नान केलेच पाहिजे असे नाही.",
      },
    },
    {
      title: { en: "Count if it helps, or do not", mr: "मोजणी उपयोगी वाटली तर करा, नाहीतर नको" },
      body: {
        en: "A mala of 108 gives the mind something to hold on to. Plenty of devotees never use one. If you lose count you have lost nothing — begin again from where you are.",
        mr: "१०८ ची माळ मनाला धरून ठेवायला काहीतरी देते. अनेक भक्त कधीही माळ वापरत नाहीत. मोजणी चुकली तर काही गमावले नाही — जिथे आहात तिथून पुन्हा सुरू करा.",
      },
    },
    {
      title: { en: "That is the whole of it", mr: "एवढेच सर्व" },
      body: {
        en: "There is no next stage, no initiation to seek and nobody to get permission from. Maharaj gave no other method and appointed no intermediary.",
        mr: "पुढचा टप्पा नाही, मागायची दीक्षा नाही आणि परवानगी घ्यायला कोणी नाही. महाराजांनी दुसरी कोणतीही पद्धत दिली नाही आणि मध्यस्थ नेमला नाही.",
      },
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.nav.dailySeva}
        title={dict.dailySeva.jaapTitle}
        description={dict.dailySeva.jaapIntro}
        crumbs={crumbs(
          locale,
          ["nav.dailySeva", "/daily-seva"],
          ["navGroups.namJaap", "/daily-seva/nam-jaap"],
        )}
      />

      {/* ─────────────────────────────────────────────────── the mantra ─── */}
      <section className="relative isolate overflow-hidden bg-night-900 py-16 text-sandal-100 night-wash sm:py-20">
        <MandalaField className="top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 text-marigold-300 opacity-25" />
        <Container width="narrow">
          <div className="relative text-center">
            <Icon.Sparkle className="mx-auto h-9 w-9 text-marigold-300" />
            <p className="mt-6 font-deva text-5xl leading-tight text-sandal-50 sm:text-6xl">
              {namJaap.mantra}
            </p>
            <p className="mt-4 font-display text-2xl text-marigold-300 italic">
              {namJaap.transliteration}
            </p>
            <GoldRule className="mx-auto mt-8 max-w-40" />
            <p className="mt-8 text-lg leading-relaxed text-sandal-200">
              {t(namJaap.guidance, locale)}
            </p>
          </div>
        </Container>
      </section>

      {/* ──────────────────────────────────────────────────── how to do it ─── */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.dailySeva.jaapTitle}
              title={t({ en: "How it is done", mr: "कसे करावे" }, locale)}
              description={t(
                {
                  en: "There is almost nothing to explain, which is the point. Written out only so that nobody holds back for fear of doing it wrong.",
                  mr: "समजावण्यासारखे जवळपास काहीच नाही, आणि तोच मुद्दा आहे. चुकीचे होईल या भीतीने कोणी मागे राहू नये म्हणूनच हे लिहिले आहे.",
                },
                locale,
              )}
            />
          </div>
          <div className="lg:col-span-7">
            <ol className="flex flex-col gap-4">
              {howTo.map((step, index) => (
                <NumberedStep
                  key={step.title.en}
                  index={index + 1}
                  title={t(step.title, locale)}
                >
                  {t(step.body, locale)}
                </NumberedStep>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────── sankalp ─── */}
      <Section tone="tint" width="narrow">
        <Card tone="gold" className="p-8">
          <Eyebrow>{dict.dailySeva.sankalpTitle}</Eyebrow>
          <h2 className="mt-2 text-2xl">{t(sankalp.title, locale)}</h2>
          <p className="mt-4 text-lg text-muted">{t(sankalp.description, locale)}</p>
          <ButtonLink href={localePath(locale, "/contact")} className="mt-6">
            <Icon.Mail className="h-5 w-5" />
            {t(
              { en: "Tell us about your sankalp", mr: "तुमच्या संकल्पाविषयी सांगा" },
              locale,
            )}
          </ButtonLink>
        </Card>
      </Section>

      {/* ───────────────────────────────────────────────────── recordings ─── */}
      {recordings.length ? (
        <Section tone="canvas">
          <SectionHeader
            eyebrow={dict.navGroups.audio}
            title={t({ en: "Recordings of the jaap", mr: "जपाची ध्वनिमुद्रणे" }, locale)}
            description={t(
              {
                en: "Continuous recordings devotees leave playing in the house, for an akhand jaap or during a sankalp.",
                mr: "अखंड जपासाठी किंवा संकल्पाच्या काळात भक्त घरात लावून ठेवतात अशी अखंड ध्वनिमुद्रणे.",
              },
              locale,
            )}
            action={
              <ButtonLink href={localePath(locale, "/library/audio")} variant="secondary">
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {recordings.map((item) => (
              <LibraryCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
