import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import { LibraryCard } from "@/components/shared/LibraryCard";
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Eyebrow,
  NumberedStep,
  Section,
  SectionHeader,
} from "@/components/ui";
import { getSevaSlot, libraryByType, site } from "@/lib/content";
import { formatTime, zonedToInstant } from "@/lib/datetime";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale, type LocaleParams } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.dailySeva.upasanaTitle,
    description: t(site.zoom.note, locale).slice(0, 180),
    path: "/daily-seva/upasana",
  });
}

const CLOCK_REFERENCE = "2026-01-01";

export default async function UpasanaPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  const slot = getSevaSlot("ram-raksha-upasana");
  const texts = libraryByType("text").filter((item) =>
    ["upasana-booklet", "shriram-vandana", "shri-gajanan-stotra"].includes(item.slug),
  );

  const start = slot
    ? formatTime(
        zonedToInstant(CLOCK_REFERENCE, slot.time, site.timezone),
        locale,
        site.timezone,
      )
    : null;

  const order = [
    {
      title: { en: "Shriram Vandana", mr: "श्रीराम वंदना" },
      body: {
        en: "The session opens with the vandana. Two or three minutes.",
        mr: "वंदनेने सुरुवात होते. दोन-तीन मिनिटे.",
      },
    },
    {
      title: { en: "Shri Ram Raksha Stotra", mr: "श्री रामरक्षा स्तोत्र" },
      body: {
        en: "Recited together. If you do not know it, follow in the Upasana Booklet or simply listen — most people learn it this way over a few months.",
        mr: "एकत्र म्हटले जाते. माहीत नसेल तर उपासना पुस्तिकेत पाहा किंवा फक्त ऐका — बहुतेक लोक काही महिन्यांत अशाच पद्धतीने शिकतात.",
      },
    },
    {
      title: { en: "Maruti Stotra", mr: "मारुती स्तोत्र" },
      body: {
        en: "Follows immediately after, and is the shorter of the two.",
        mr: "लगेच नंतर, आणि दोहोंपैकी छोटे.",
      },
    },
    {
      title: { en: "Nam jaap and closing aarti", mr: "नामजप व समाप्ती आरती" },
      body: {
        en: "Gan Gan Ganat Bote together, then the aarti. The host closes the room; nobody is asked to speak.",
        mr: "एकत्र गण गण गणात बोते, नंतर आरती. यजमान खोली बंद करतात; कोणालाही बोलायला सांगितले जात नाही.",
      },
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.nav.dailySeva}
        title={dict.dailySeva.upasanaTitle}
        description={t(
          {
            en: "Shri Ram Raksha Stotra and Maruti Stotra on Zoom, every single day of the year. Twenty-five minutes. Camera off is fine, and you do not need to know the words.",
            mr: "श्री रामरक्षा स्तोत्र व मारुती स्तोत्र झूमवर, वर्षातील प्रत्येक दिवशी. पंचवीस मिनिटे. कॅमेरा बंद असला तरी चालतो, आणि शब्द माहीत असायची गरज नाही.",
          },
          locale,
        )}
        crumbs={crumbs(
          locale,
          ["nav.dailySeva", "/daily-seva"],
          ["navGroups.upasana", "/daily-seva/upasana"],
        )}
        aside={
          <Card tone="gold" className="p-6">
            <Eyebrow>{dict.dailySeva.zoomTitle}</Eyebrow>
            {start ? (
              <p className="mt-2 font-display text-3xl tabular-nums text-heading">
                {start}{" "}
                <span className="text-base font-normal text-muted">
                  {t({ en: "Pacific", mr: "पॅसिफिक" }, locale)}
                </span>
              </p>
            ) : null}
            <dl className="mt-4">
              <DefinitionRow term={t({ en: "Days", mr: "दिवस" }, locale)}>
                {t({ en: "Every day of the year", mr: "वर्षातील प्रत्येक दिवशी" }, locale)}
              </DefinitionRow>
              <DefinitionRow term={dict.dailySeva.durationLabel}>
                {slot?.durationMinutes ?? 25} {dict.dailySeva.minutes}
              </DefinitionRow>
              <DefinitionRow term={t({ en: "Where", mr: "कुठे" }, locale)}>
                <Badge tone="accent">
                  <Icon.Video className="h-3.5 w-3.5" />
                  {dict.dailySeva.online}
                </Badge>
              </DefinitionRow>
            </dl>
            {site.zoom.joinUrl ? (
              <ButtonLink href={site.zoom.joinUrl} external className="mt-5 w-full">
                <Icon.Video className="h-5 w-5" />
                {dict.dailySeva.joinZoom}
              </ButtonLink>
            ) : (
              <ButtonLink
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                  "Zoom link for daily upasana",
                )}`}
                className="mt-5 w-full"
              >
                <Icon.Mail className="h-5 w-5" />
                {t({ en: "Ask us for the link", mr: "दुव्यासाठी विचारा" }, locale)}
              </ButtonLink>
            )}
          </Card>
        }
      />

      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={dict.dailySeva.upasanaTitle}
              title={t({ en: "The order of the upasana", mr: "उपासनेचा क्रम" }, locale)}
              description={t(
                {
                  en: "The same sequence every evening, for years. Nothing is announced and nothing changes.",
                  mr: "वर्षानुवर्षे प्रत्येक संध्याकाळी तोच क्रम. काही जाहीर होत नाही आणि काही बदलत नाही.",
                },
                locale,
              )}
            />
            <Alert tone="info">
              <p>{t(site.zoom.note, locale)}</p>
            </Alert>
          </div>

          <div className="lg:col-span-7">
            <ol className="flex flex-col gap-4">
              {order.map((step, index) => (
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

      {texts.length ? (
        <Section tone="tint">
          <SectionHeader
            eyebrow={dict.navGroups.texts}
            title={t({ en: "What to follow along with", mr: "सोबत काय वापरावे" }, locale)}
            description={t(
              {
                en: "Free to download and free to print. The Upasana Booklet carries the whole sequence in order.",
                mr: "विनामूल्य डाउनलोड व छपाई. उपासना पुस्तिकेत संपूर्ण क्रम आहे.",
              },
              locale,
            )}
            action={
              <ButtonLink href={localePath(locale, "/library/texts")} variant="secondary">
                {dict.common.viewAll}
                <Icon.ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {texts.map((item) => (
              <LibraryCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
