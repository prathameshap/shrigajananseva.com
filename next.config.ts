import type { NextConfig } from "next";

/**
 * 301 map from the legacy WordPress site.
 *
 * Every one of these URLs currently ranks for real queries ("Gajanan Maharaj
 * Bay Area" and similar). They must all resolve at cutover — see
 * docs/FEATURES-WEBSITE.md §5. Destinations are locale-less; middleware
 * adds the visitor's locale prefix.
 */
const legacyRedirects: { source: string; destination: string }[] = [
  // About
  { source: "/about-shri-gajanan-seva", destination: "/about" },
  { source: "/maharaj", destination: "/about/shri-gajanan-maharaj" },

  // Donate
  { source: "/qr-codes", destination: "/donate" },

  // Daily seva
  { source: "/daily-upasana", destination: "/daily-seva" },
  { source: "/daily-upasana-instructions", destination: "/daily-seva/upasana" },
  { source: "/bhupali-aarti", destination: "/daily-seva/bhupali-aarti" },
  { source: "/shejarati", destination: "/daily-seva/shejarati" },

  // Library (was "Downloads")
  { source: "/downloads", destination: "/library" },
  { source: "/upasana", destination: "/library/upasana-booklet" },
  { source: "/shri-gajanan-stotra", destination: "/library/shri-gajanan-stotra" },
  { source: "/shriram-vandana", destination: "/library/shriram-vandana" },
  { source: "/pradakshina", destination: "/library/pradakshina-and-prasad" },
  { source: "/gajanan-vijay-grantha", destination: "/library/gajanan-vijay-grantha" },

  // Audio. Every library item lives at /library/<slug> regardless of media
  // type; /library/audio is the filtered index, not a path prefix.
  { source: "/gan-gan-ganat-botey-24-hr-jap", destination: "/library/gan-gan-ganat-bote-24hr" },
  { source: "/12-hour-jap", destination: "/library/gan-gan-ganat-bote-12hr" },
  { source: "/gan-gan-ganat-botey", destination: "/library/gan-gan-ganat-bote-108" },

  // Connect
  { source: "/newsletter", destination: "/connect/newsletter" },
  { source: "/youtube-gallery", destination: "/library/videos" },

  // Legal
  { source: "/privacy-policy", destination: "/legal/privacy" },

  // Removed WP Booking Calendar plugin pages — see spec §4
  { source: "/wp-booking-calendar-full-day", destination: "/contact" },
  { source: "/wp-booking-calendar-time-slots", destination: "/contact" },
  { source: "/wp-booking-calendar-time-appointments", destination: "/contact" },
  { source: "/wp-booking-calendar-contact", destination: "/contact" },
  { source: "/wpbc-appointment-booking", destination: "/contact" },
];

const nextConfig: NextConfig = {
  async redirects() {
    // 301 rather than `permanent: true`, which emits 308. The spec calls for
    // 301s, the legacy URLs are all GET, and 301 is the status every SEO tool
    // and crawler handles most predictably.
    //
    // Destinations are locale-less by design, so a Marathi speaker following an
    // old link still lands in Marathi. That costs one extra hop
    // (301 -> 307 locale redirect); well within what crawlers follow.
    return legacyRedirects.map(({ source, destination }) => ({
      source,
      destination,
      statusCode: 301,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
