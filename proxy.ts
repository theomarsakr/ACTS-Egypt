import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Locale routing (phase 1).
 *
 * The app tree lives under app/[lang]/. Public URLs stay exactly as they were
 * for English (no /en prefix — existing indexed URLs keep working); Arabic
 * lives under /ar. Only the translated conversion path exists in Arabic so
 * far; any other /ar URL falls back to its English page.
 */

// Pages translated to Arabic so far (keep in sync with lib/i18n arRoutes).
const AR_PAGES = new Set(["/ar", "/ar/contact", "/ar/quote"]);

/* Sector slugs that used to be reachable only as `/industries?sector=<slug>`,
 * before each got a page of its own. External links and bookmarks in that
 * form still exist, so they are redirected rather than quietly landing on the
 * hub — kept in sync with lib/data `industries`. */
const INDUSTRY_SLUGS = new Set([
  "oil-gas",
  "petrochemical",
  "power-generation",
  "water-treatment",
  "fertilizers",
  "general-industrial",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /industries?sector=oil-gas -> /industries/oil-gas (301, permanent: the
  // parameter form is not coming back).
  if (pathname === "/industries" || pathname === "/ar/industries") {
    const sector = request.nextUrl.searchParams.get("sector");
    if (sector && INDUSTRY_SLUGS.has(sector)) {
      const url = request.nextUrl.clone();
      url.pathname = `/industries/${sector}`;
      url.search = "";
      url.hash = "";
      return NextResponse.redirect(url, 301);
    }
  }

  // Canonicalize: the English tree is served unprefixed, so /en/* redirects
  // to the clean URL.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    // Untranslated Arabic URL → its English page (interim until phase 2).
    if (!AR_PAGES.has(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/ar/, "") || "/";
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  // Everything else renders the English tree internally.
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, and any file with an extension
  // (images, fonts, robots.txt, sitemap.xml, favicons, …).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
