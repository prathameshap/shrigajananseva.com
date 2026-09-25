import type { Metadata } from "next";
<<<<<<< HEAD

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
=======
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { ConnectStrip } from "@/components/shared/ConnectStrip";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Badge, ButtonLink, Card, Section, SectionHeader } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, localePath } from "@/lib/i18n";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
<<<<<<< HEAD
  return pageMetadata({
    locale,
    title: dict.connect.title,
    description: dict.connect.intro,
    path: "/connect",
  });
=======
  return { title: dict.connect.title, description: dict.connect.intro };
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}

export default async function ConnectPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <>
<<<<<<< HEAD
      <PageHero
=======
      <PageHeader
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        eyebrow={dict.nav.connect}
        title={dict.connect.title}
        description={dict.connect.intro}
        crumbs={crumbs(locale, ["nav.connect", "/connect"])}
<<<<<<< HEAD
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
=======
        breadcrumbLabel={dict.nav.breadcrumb}
        actions={
          <ButtonLink href={localePath(locale, "/contact")} variant="secondary">
            <Icon.Mail className="h-5 w-5" />
            {dict.navGroups.contact}
          </ButtonLink>
        }
      />

      {/* Channels */}
      <Section tone="canvas">
        <SectionHeader
          eyebrow="Pick what suits you"
          title="Channels"
          description="Some people want every conversation; some want four announcements a year. Both are fine."
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        />
        <ConnectStrip locale={locale} />
      </Section>

<<<<<<< HEAD
      {/* ────────────────────────────────────────────────── newsletter ─── */}
      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
=======
      {/* Which channel */}
      <Section tone="raised">
        <SectionHeader
          title="Which one should I join?"
          description="An honest guide, since the difference is not obvious from the names."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: dict.connect.whatsappChannel,
              badge: "Quietest",
              body: "Announcements only, from us to you. A handful of messages a month: utsav dates, timing changes, seva drives. You cannot reply and nobody sees that you joined.",
              best: "Best if you want to stay informed and nothing more.",
            },
            {
              title: dict.connect.newsletterTitle,
              badge: "Monthly",
              body: "One email on the last day of each month. Seva reports, what the drives achieved, dates for the month ahead. Written by devotees, and it has run without interruption for close to two years.",
              best: "Best if you prefer email to messaging apps.",
            },
            {
              title: dict.connect.whatsappGroup,
              badge: "Busiest",
              body: "A real group chat. Coordination, lift-sharing to utsav, requests for a pair of hands on a Saturday morning, and a good deal of warmth.",
              best: "Best if you want to be part of the day-to-day.",
            },
          ].map((channel) => (
            <Card key={channel.title} className="flex flex-col p-6">
              <Badge tone="neutral">{channel.badge}</Badge>
              <h3 className="mt-4 text-lg">{channel.title}</h3>
              <p className="mt-2 flex-1 text-muted">{channel.body}</p>
              <p className="mt-4 border-t border-hairline pt-4 text-sm font-semibold text-accent">
                {channel.best}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Newsletter */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
            <SectionHeader
              eyebrow={dict.navGroups.newsletter}
              title={dict.connect.newsletterTitle}
              description={dict.connect.newsletterBody}
            />
<<<<<<< HEAD
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
=======
            <ul className="-mt-4 flex flex-col gap-2.5">
              {[
                "One email a month, on the last day of the month",
                "Unsubscribe link in every issue",
                "We never sell or share your address",
                "Double opt-in — you confirm before anything is sent",
              ].map((point) => (
                <li key={point} className="flex gap-2.5 text-muted">
                  <Icon.Check className="mt-1.5 h-4 w-4 shrink-0 text-tulsi-500" />
                  {point}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={localePath(locale, "/library/newsletters")}
              variant="secondary"
              className="mt-6"
            >
              {dict.navGroups.newsletterArchive}
              <Icon.ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="lg:col-span-6">
            <Card className="p-7">
              <h2 className="text-xl">{dict.connect.subscribeCta}</h2>
              <div className="mt-5">
                <NewsletterForm locale={locale} />
              </div>
              <p className="mt-5 text-sm text-muted">
                By subscribing you agree to our{" "}
                <a
                  className="font-semibold text-accent underline underline-offset-2"
                  href={localePath(locale, "/legal/privacy")}
                >
                  {dict.legal.privacy}
                </a>
                .
              </p>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
            </Card>
          </div>
        </div>
      </Section>

<<<<<<< HEAD
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
=======
      {/* Contact */}
      <Section tone="raised">
        <Card className="p-7 sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl">Rather just talk to someone?</h2>
              <p className="mt-3 text-muted">
                Call during darshan hours, or send a message and a trustee will reply.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href={`tel:${site.contact.phoneE164}`}>
                <Icon.Phone className="h-5 w-5" />
                {site.contact.phone}
              </ButtonLink>
              <ButtonLink href={localePath(locale, "/contact")} variant="secondary">
                {dict.connect.contactTitle}
              </ButtonLink>
            </div>
          </div>
        </Card>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      </Section>
    </>
  );
}
