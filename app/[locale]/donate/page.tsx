import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/shared/PageHero";
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  DefinitionRow,
  Eyebrow,
  Section,
  SectionHeader,
  SpinedCard,
} from "@/components/ui";
import { funds, givingMethods, site } from "@/lib/content";
import { getDictionary, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { crumbs, localeStaticParams, resolveLocale } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ fund?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.donate.title,
    description: dict.donate.intro,
    path: "/donate",
  });
}

export default async function DonatePage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { fund: requestedFund } = await searchParams;

  const selected = funds.find((fund) => fund.slug === requestedFund);
  const ordered = selected
    ? [selected, ...funds.filter((fund) => fund.slug !== selected.slug)]
    : funds;

  const recommended = givingMethods.filter((method) => method.recommended);
  const others = givingMethods.filter((method) => !method.recommended);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.donate}
        title={dict.donate.title}
        description={dict.donate.intro}
        crumbs={crumbs(locale, ["nav.donate", "/donate"])}
        aside={
          <Card tone="gold" className="p-6">
            <Eyebrow>{dict.donate.onlineTitle}</Eyebrow>
            <p className="mt-3 text-muted">{dict.donate.onlineBody}</p>
            <ButtonLink href="#how-to-give" className="mt-5">
              <Icon.Heart className="h-5 w-5" />
              {dict.donate.methodsTitle}
            </ButtonLink>
            <p className="mt-5 border-t border-gold-400/40 pt-4 text-sm text-muted">
              {dict.donate.taxNote}
            </p>
          </Card>
        }
      />

      {/* ─────────────────────────────────────────────────────── funds ─── */}
      <Section tone="canvas" id="funds">
        <SectionHeader
          eyebrow={dict.nav.donate}
          title={dict.donate.fundsTitle}
          description={t(
            {
              en: "Pick the one you want your gift to go to and name it in the payment memo. A restricted fund is spent on that activity and nothing else.",
              mr: "तुमची देणगी कुठे जावी ते निवडा आणि पेमेंटच्या मेमोमध्ये त्याचे नाव लिहा. राखीव निधी त्याच कामावर खर्च होतो, अन्य कशावरही नाही.",
            },
            locale,
          )}
        />

        {selected ? (
          <div className="mb-8">
            <Alert tone="info" title={t(selected.title, locale)}>
              <p>
                {t(
                  {
                    en: "You arrived from a link for this fund. Write its name in the payment memo and it will be recorded against it.",
                    mr: "तुम्ही या निधीच्या दुव्यावरून आले आहात. पेमेंटच्या मेमोमध्ये त्याचे नाव लिहा, म्हणजे तशी नोंद होईल.",
                  },
                  locale,
                )}
              </p>
            </Alert>
          </div>
        ) : null}

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ordered.map((fund) => (
            <SpinedCard
              as="li"
              key={fund.slug}
              spine={fund.slug === selected?.slug ? "marigold" : "saffron"}
              id={fund.slug}
            >
              <div className="flex h-full flex-col p-6">
                <h3 className="text-lg">{t(fund.title, locale)}</h3>
                <p className="mt-2 flex-1 text-muted">{t(fund.description, locale)}</p>

                {fund.suggested.length ? (
                  <>
                    <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                      {dict.donate.suggestedLabel}
                    </p>
                    <ul className="mt-2 flex flex-col gap-2">
                      {fund.suggested.map((option) => (
                        <li
                          key={option.amount}
                          className="flex items-baseline gap-3 border-b border-hairline pb-2 last:border-0"
                        >
                          <span className="w-16 shrink-0 font-display text-xl tabular-nums text-heading">
                            ${option.amount}
                          </span>
                          <span className="text-sm text-muted">
                            {t(option.impact, locale)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </SpinedCard>
          ))}
        </ul>
      </Section>

      {/* ───────────────────────────────────────────────── how to give ─── */}
      <Section tone="tint" id="how-to-give">
        <SectionHeader
          eyebrow={dict.nav.donate}
          title={dict.donate.methodsTitle}
          description={t(
            {
              en: "Fees come out of the gift, so the method matters. Zelle costs the centre nothing.",
              mr: "शुल्क देणगीतून कापले जाते, म्हणून पद्धत महत्त्वाची. झेलचे केंद्राला काहीही शुल्क नाही.",
            },
            locale,
          )}
        />

        <ul className="grid gap-5 lg:grid-cols-2">
          {[...recommended, ...others].map((method) => (
            <SpinedCard
              as="li"
              key={method.id}
              spine={method.recommended ? "tulsi" : "peacock"}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl">{t(method.title, locale)}</h3>
                  {method.recommended ? (
                    <Badge tone="success">{dict.donate.recommendedLabel}</Badge>
                  ) : null}
                </div>

                <dl className="mt-4">
                  <DefinitionRow term={dict.donate.handleLabel}>
                    {method.handle ? (
                      <span className="font-semibold text-heading">{method.handle}</span>
                    ) : (
                      <span className="italic">
                        {t(
                          {
                            en: "Not published yet — email or call and we will give it to you",
                            mr: "अद्याप प्रकाशित नाही — ईमेल करा किंवा फोन करा, आम्ही सांगू",
                          },
                          locale,
                        )}
                      </span>
                    )}
                  </DefinitionRow>
                  <DefinitionRow term={dict.donate.feeLabel}>
                    {t(method.feeNote, locale)}
                  </DefinitionRow>
                </dl>

                <p className="mt-4 flex-1 text-muted">{t(method.instructions, locale)}</p>

                {!method.handle && method.id !== "in-person" ? (
                  <ButtonLink
                    href={`mailto:${site.contact.charityEmail}?subject=${encodeURIComponent(
                      `${t(method.title, locale)} details`,
                    )}`}
                    variant="secondary"
                    className="mt-5 self-start"
                  >
                    <Icon.Mail className="h-5 w-5" />
                    {dict.contact.mailtoFallback}
                  </ButtonLink>
                ) : null}
              </div>
            </SpinedCard>
          ))}
        </ul>

        <div className="mt-8">
          <Alert tone="info" title={dict.donate.receiptNote}>
            <p>
              <a
                className="font-semibold text-accent underline underline-offset-2"
                href={`mailto:${site.contact.charityEmail}`}
              >
                {site.contact.charityEmail}
              </a>
            </p>
          </Alert>
        </div>
      </Section>

      {/* ───────────────────────────────────────────── employer matching ─── */}
      <Section tone="canvas" id="employer-matching">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow={dict.nav.donate}
              title={dict.donate.employerMatchTitle}
              description={dict.donate.employerMatchBody}
            />
          </div>
          <div className="lg:col-span-6">
            <Card className="p-7">
              <h3 className="text-lg">
                {t(
                  { en: "Details to enter in the portal", mr: "पोर्टलमध्ये भरायचे तपशील" },
                  locale,
                )}
              </h3>
              <dl className="mt-4">
                <DefinitionRow term={dict.about.legalNameLabel}>
                  {site.legalName}
                </DefinitionRow>
                <DefinitionRow term={dict.about.einLabel}>
                  {site.nonprofit.ein ?? (
                    <span className="italic">
                      {t(
                        {
                          en: "Not published yet — email us and we will send it",
                          mr: "अद्याप प्रकाशित नाही — आम्हाला ईमेल करा, आम्ही पाठवू",
                        },
                        locale,
                      )}
                    </span>
                  )}
                </DefinitionRow>
                <DefinitionRow term={t({ en: "Address", mr: "पत्ता" }, locale)}>
                  {site.address.street}, {site.address.locality}, {site.address.region}{" "}
                  {site.address.postalCode}
                </DefinitionRow>
                <DefinitionRow term={dict.about.statusLabel}>
                  {site.nonprofit.status}
                </DefinitionRow>
                <DefinitionRow term={t({ en: "Contact", mr: "संपर्क" }, locale)}>
                  {site.contact.charityEmail}
                </DefinitionRow>
              </dl>
              <ButtonLink
                href={localePath(locale, "/about/transparency")}
                variant="secondary"
                className="mt-5"
              >
                {dict.navGroups.transparency}
                <Icon.ArrowRight className="h-5 w-5" />
              </ButtonLink>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
