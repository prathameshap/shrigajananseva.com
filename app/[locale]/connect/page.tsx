import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { ConnectStrip } from "@/components/shared/ConnectStrip";
import { PageHero } from "@/components/shared/PageHero";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import {
  ButtonLink,
  Card,
  DefinitionRow,
  Section,
  SectionHeader,
} from "@/components/ui";
import { site } from "@/lib/content";
import { newsletterLabels } from "@/lib/form-labels";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.connect.title,
    description: dict.connect.intro,
    path: "/connect",
  });
}

export default async function ConnectPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.connect}
        title={dict.connect.title}
        description={dict.connect.intro}
        crumbs={crumbs(locale, ["nav.connect", "/connect"])}
      />

      {/* ─────────────────────────────────────────────────── channels ─── */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow={dict.nav.connect}
          title={dict.connect.channelsTitle}
          description={t(
            {
              en: "Different channels carry different things. The newsletter is the only one that reaches everyone, so nothing important goes out on WhatsApp alone.",
              mr: "वेगवेगळ्या माध्यमांतून वेगवेगळी माहिती येते. वार्तापत्र हे एकमेव सर्वांपर्यंत पोहोचणारे माध्यम आहे, म्हणून महत्त्वाचे काहीही केवळ व्हॉट्सअॅपवर जात नाही.",
            },
            locale,
          )}
        />
        <ConnectStrip locale={locale} />
      </Section>

      {/* ────────────────────────────────────────────────── newsletter ─── */}
      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.navGroups.newsletter}
              title={dict.connect.newsletterTitle}
              description={dict.connect.newsletterBody}
            />
            <Card className="p-6">
              <dl>
                <DefinitionRow
                  term={t({ en: "How often", mr: "किती वेळा" }, locale)}
                >
                  {t(
                    { en: "Once a month, plus festival notices", mr: "महिन्यातून एकदा, तसेच उत्सवाच्या सूचना" },
                    locale,
                  )}
                </DefinitionRow>
                <DefinitionRow term={t({ en: "Languages", mr: "भाषा" }, locale)}>
                  {t({ en: "English and Marathi", mr: "इंग्रजी व मराठी" }, locale)}
                </DefinitionRow>
                <DefinitionRow
                  term={t({ en: "Unsubscribe", mr: "सदस्यता रद्द" }, locale)}
                >
                  {t(
                    { en: "One link in every issue", mr: "प्रत्येक अंकात एक दुवा" },
                    locale,
                  )}
                </DefinitionRow>
              </dl>
              <ButtonLink
                href={localePath(locale, "/legal/privacy")}
                variant="ghost"
                className="mt-4"
              >
                {dict.legal.privacy}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card tone="gold" className="p-7">
              <NewsletterForm
                labels={newsletterLabels(locale)}
                fallbackEmail={site.contact.email}
              />
            </Card>
          </div>
        </div>
      </Section>

      {/* ──────────────────────────────────────────────────── in person ─── */}
      <Section tone="canvas" width="narrow">
        <SectionHeader
          eyebrow={dict.navGroups.contact}
          title={t(
            { en: "Or simply come on a Thursday", mr: "किंवा गुरुवारी सहज येऊन जा" },
            locale,
          )}
          description={t(
            {
              en: "No channel replaces standing in the hall. The evening aarti is the easiest first visit — arrive a little before it starts and someone will show you round.",
              mr: "कोणतेही माध्यम सभागृहात उभे राहण्याची जागा घेऊ शकत नाही. संध्याकाळची आरती ही पहिल्या भेटीसाठी सर्वात सोपी वेळ — थोडे आधी यावे, कोणीतरी फिरवून दाखवेल.",
            },
            locale,
          )}
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={localePath(locale, "/visit")} size="lg">
            <Icon.MapPin className="h-5 w-5" />
            {dict.visit.title}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/contact")} variant="secondary" size="lg">
            <Icon.Mail className="h-5 w-5" />
            {dict.contact.title}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
