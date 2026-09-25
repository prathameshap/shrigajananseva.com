import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";

import { HeaderShell } from "@/components/site/HeaderShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { site } from "@/lib/content";
import { getDictionary, isLocale, localeTags, locales, type Locale } from "@/lib/i18n";
import { organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-deva",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffcf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a120e" },
  ],
  // No maximum-scale: pinch-zoom must keep working at 200%+.
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((code) => [localeTags[code], `/${code}`])),
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      description: dict.meta.defaultDescription,
      locale: localeTags[locale],
      url: `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteName,
      description: dict.meta.defaultDescription,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Applies the stored theme before first paint.
 *
 * Without this the page renders light, then snaps to dark a frame later —
 * unpleasant at 6am when someone opens Bhupali Aarti in a dark room.
 */
const noFlashTheme = `(function(){try{var t=localStorage.getItem('sgs_theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  return (
    <html
      lang={localeTags[typedLocale]}
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${notoDevanagari.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(typedLocale)),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <HeaderShell locale={typedLocale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={typedLocale} />

        {/*
          Vercel Analytics and Speed Insights set no cookies and build no
          cross-site profile, which is what allows this site to run without a
          cookie consent banner. Keep it that way — adding Google Analytics
          here would make a banner legally necessary.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
