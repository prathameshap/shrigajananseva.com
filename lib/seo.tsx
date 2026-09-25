/**
 * Structured data.
 *
 * Event schema is the point of this file: it is what puts utsav dates into
 * Google's event listings, which is where most people in the Bay Area will
 * first discover that Pragat Din is happening at all.
 */

import { liveSocial, site, type Occasion } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
}

function openingHours() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return site.hours.map((entry) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${names[entry.day]}`,
    opens: entry.opens,
    closes: entry.closes,
  }));
}

export function organizationJsonLd(locale: Locale) {
  const sameAs = liveSocial().map((channel) => channel.url);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "PlaceOfWorship", "LocalBusiness"],
        "@id": `${site.url}/#organization`,
        name: site.legalName,
        alternateName: t(site.displayName, locale),
        url: site.url,
        description: `A 501(c)(3) non-profit in ${site.address.locality}, California, rooted in the teachings of Shri Gajanan Maharaj of Shegaon.`,
        telephone: site.contact.phoneE164,
        email: site.contact.email,
        address: postalAddress(),
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.address.latitude,
          longitude: site.address.longitude,
        },
        openingHoursSpecification: openingHours(),
        nonprofitStatus: "https://schema.org/Nonprofit501c3",
        ...(site.nonprofit.ein ? { taxID: site.nonprofit.ein } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: t(site.displayName, locale),
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: locale === "mr" ? "mr-IN" : "en-US",
      },
    ],
  };
}

export function occasionJsonLd(occasion: Occasion, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: t(occasion.title, locale),
    description: t(occasion.summary, locale),
    startDate: occasion.start,
    endDate: occasion.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: occasion.onlineJoin
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: occasion.locationName,
      address: postalAddress(),
    },
    organizer: { "@id": `${site.url}/#organization` },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/${locale}/occasions/${occasion.slug}`,
      validFrom: new Date().toISOString(),
    },
    url: `${site.url}/${locale}/occasions/${occasion.slug}`,
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  trail: { name: string; href: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.href}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Renders any of the above into the page. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
