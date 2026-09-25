import type { NewsletterLabels } from "@/components/forms/NewsletterForm";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * The form components are client components and take their strings as props, so
 * the dictionary itself never crosses into the browser bundle.
 *
 * The newsletter form is mounted on three pages, which makes this mapping the
 * one place to change a label rather than three places to forget one.
 */
export function newsletterLabels(locale: Locale): NewsletterLabels {
  const dict = getDictionary(locale);
  return {
    emailLabel: dict.connect.newsletterEmailLabel,
    nameLabel: dict.connect.newsletterNameLabel,
    consent: dict.connect.newsletterConsent,
    consentNote: dict.connect.newsletterConsentNote,
    cta: dict.connect.newsletterCta,
    sending: dict.contact.sending,
    thanksTitle: dict.connect.newsletterThanksTitle,
    thanksBody: dict.connect.newsletterThanksBody,
    required: dict.forms.required,
    invalidEmail: dict.forms.invalidEmail,
    genericError: dict.forms.genericError,
    honeypotLabel: dict.forms.honeypotLabel,
    optional: dict.common.optional,
    mailtoFallback: dict.contact.mailtoFallback,
  };
}
