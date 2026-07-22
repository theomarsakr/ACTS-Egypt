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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
