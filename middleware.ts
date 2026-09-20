import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";
import { checkGate, gateResponse } from "@/lib/site-auth";

const LOCALE_COOKIE = "sgs_locale";

/** Paths that carry no content and only add noise if locale logic touches them. */
const NON_PAGE = /^\/(?:_next\/|api\/|favicon\.ico|robots\.txt|sitemap\.xml|assets\/)|\.[^/]+$/;

export function middleware(request: NextRequest) {
  // 1. The pre-launch gate, before anything else.
  //
  // Applied to every path including static assets and API routes, so there is
  // no way to read content by guessing a URL. Once a browser has authenticated
  // it attaches the header to subresource requests automatically.
  const gate = checkGate(request);
  if (!gate.allow) return gateResponse(gate.reason);

  // 2. Locale routing, for page requests only.
  const { pathname } = request.nextUrl;
  if (NON_PAGE.test(pathname)) return NextResponse.next();

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : preferredLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

function preferredLocale(header: string | null) {
  if (!header) return defaultLocale;
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

/**
 * Everything. The gate has to see every request, so the previous
 * static-asset exclusions have moved into the handler as NON_PAGE.
 */
export const config = {
  matcher: ["/:path*"],
};
