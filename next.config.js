/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

/* Content Security Policy.
 *
 * `script-src` carries 'unsafe-inline' deliberately. Next's App Router streams
 * hydration data through inline `self.__next_f.push(...)` scripts whose content
 * differs per page, so hashes cannot cover them, and the only alternative —
 * per-request nonces via proxy.ts — requires dynamic rendering (see
 * node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 * That would turn all 120 statically generated pages into per-request renders
 * and forfeit Vercel's static caching, to protect a site with no auth, no
 * sessions, no cookies, and no user-generated HTML. The directives that do the
 * real work here are object-src, base-uri, frame-ancestors and form-action,
 * and none of them cost anything.
 *
 * `application/ld+json` blocks are not executed, so script-src does not apply
 * to the structured data in app/[lang]/layout.tsx.
 */
const csp = [
  "default-src 'self'",
  // 'unsafe-eval' is development-only: React uses eval() to reconstruct
  // callstacks for its dev overlay and refuses to boot without it under a CSP.
  // It never reaches production. (Same caveat as the Next CSP guide, in
  // node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.)
  `script-src 'self' 'unsafe-inline'${
    isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""
  }`,
  // Inline styles: `motion` writes style attributes, and next/font injects a
  // <style> block. Far lower risk than inline script.
  "style-src 'self' 'unsafe-inline'",
  // data:/blob: for canvas + inline SVG; i.ytimg.com for YouTube poster frames
  // (components/brands/hub/ProductHub.tsx).
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  // The globe's land data is same-origin now (public/geo/). In dev this also
  // has to allow Turbopack's HMR socket.
  `connect-src 'self'${isDev ? " ws: http://localhost:*" : ""}`,
  "media-src 'self'",
  // YouTube embeds and the Google Maps facade on /contact.
  "frame-src https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Enforcing. Proven first in report-only across /, /ar, /about, /industries,
  // /products, /projects, /contact, /brands, a brand page, a product page and
  // /quote — every distinct page type, scrolled to the bottom so the lazy
  // globe and 3D showcases actually mounted — with zero violations reported.
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // frame-ancestors above supersedes this in modern browsers; kept for old ones.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Vercel terminates TLS but does not send HSTS on its own. Omitted in dev,
  // where it would pin localhost to https for two years.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

/* Long-lived caching for the static asset trees.
 *
 * Vercel serves everything in public/ with `max-age=0, must-revalidate` by
 * default, which does two expensive things here:
 *
 *   1. Every repeat visitor re-downloads the PDFs, videos and posters.
 *   2. It caps the *optimized* image TTL. Vercel's image cache expires at
 *      max(minimumCacheTTL, upstream Cache-Control max-age), and every MISS or
 *      STALE is billed as a transformation — so a short TTL re-bills the same
 *      variant over and over. (Next's own advice: "configure headers to set
 *      the Cache-Control header on the upstream image (e.g. /some-asset.jpg,
 *      not /_next/image itself)".)
 *
 * 31 days matches `minimumCacheTTL` below. The trade is that a file replaced
 * in place can stay cached for a month, so **change the filename when you
 * change the picture** (or purge with `vercel cache invalidate --srcimg`).
 * `immutable` is deliberately not set, so a hard reload still revalidates.
 */
/* The PDF library is 255 manufacturer documents, ~440MB, under public/Data.
 *
 * Every one of them is Curtiss-Wright's own literature, published verbatim by
 * the manufacturer and by every other distributor worldwide — so ACTS's copies
 * are duplicates that will not outrank the original, and left indexable they
 * compete with the HTML product pages that ARE meant to rank ("Make important
 * HTML product pages the primary SEO landing pages"). A PDF that wins the
 * query is a worse result too: it drops the reader into a datasheet with no
 * ACTS contact route, no Egypt context and no way through to a quote.
 *
 * `noindex` rather than a robots.txt Disallow, deliberately. Disallow would
 * stop Google reading them at all, which severs the product-page → document
 * relationship that gives those pages their topical depth; noindex keeps them
 * crawled, linked and downloadable while keeping them out of the results.
 * `nofollow` is NOT set — PDFs are leaves, but the crawl should still count
 * the pages pointing at them.
 *
 * Images under /Data/<brand>/images are deliberately NOT covered: product
 * photography should be in Google Images, which is a real entry point for
 * industrial hardware.
 *
 * To reverse: delete this block. Indexing resumes on the next recrawl.
 */
const pdfRobotsHeaders = [{ key: "X-Robots-Tag", value: "noindex" }];

const THIRTY_ONE_DAYS = 2678400;
const staticAssetHeaders = [
  { key: "Cache-Control", value: `public, max-age=${THIRTY_ONE_DAYS}` },
];

const nextConfig = {
  /* Image optimization.
   *
   * Sized against Vercel's Hobby allowance (5,000 transformations/month). A
   * transformation is billed per cache MISS *and* per STALE, and the cache key
   * is {project, source content hash, w, q, normalized Accept} — so the number
   * of billable variants per source image is
   *   (widths the srcset can ask for) x (allowed qualities) x (formats),
   * re-billed every time the TTL lapses. The four settings below attack each
   * factor in turn; `minimumCacheTTL` is by far the biggest.
   */
  images: {
    // One format, not two. AVIF is ~20% smaller than WebP but doubles the
    // billable variants, because a WebP-only browser and an AVIF browser send
    // different Accept headers and so key separately. WebP at the same quality
    // is visually indistinguishable and universally supported; the bytes saved
    // by AVIF are not worth paying twice for every image on the site.
    formats: ['image/webp'],
    // Trimmed from the 8-wide default. 750 and 1200 sat close enough to 828
    // and 1080 to be redundant, and 2048 close enough to 1920; 3840 stays so
    // 4K/DPR-2 screens still get a native-resolution hero. Fewer buckets means
    // visitors on different viewports share cache entries instead of each
    // minting their own.
    deviceSizes: [640, 828, 1080, 1920, 2560, 3840],
    // Nothing on the site renders below 56 CSS px (the lightbox filmstrip
    // thumbs), so 16/32/48 were unreachable by the layout but still reachable
    // by anyone hitting /_next/image by hand.
    imageSizes: [64, 96, 128, 256, 384],
    // 90: hero photos (contact/quote) with 4:2:0 chroma subsampling band
    // visibly at the default 75 once the scrim opens up to show them.
    qualities: [75, 90],
    // 31 days, up from the 4-hour default. At 4 hours every variant that keeps
    // getting requested goes STALE — and is re-billed — up to six times a day;
    // this is the single change that takes the monthly bill from "proportional
    // to traffic x time" down to "proportional to distinct variants".
    minimumCacheTTL: THIRTY_ONE_DAYS,
    // /_next/image is a public endpoint: without an allowlist anyone can point
    // it at any file under public/ — including the ~370 MB PDF library, which
    // would burn transformations and cache writes fetching documents no page
    // ever renders as an image. These cover every next/image src in the app
    // and nothing else: /videos/** is the poster stills (not the clips), and
    // /Data/*/images/** is the manufacturer photography the brand pages and
    // the homepage gallery pull from — deliberately narrower than /Data/**,
    // which would readmit the PDFs.
    localPatterns: [
      { pathname: '/images/**', search: '' },
      { pathname: '/videos/**', search: '' },
      { pathname: '/Data/*/images/**', search: '' },
      { pathname: '/logo-transparent.png', search: '' },
    ],
  },

  // Optimizations
  reactStrictMode: false,

  // Compress
  compress: true,

  // Powering
  poweredByHeader: false,

  // Production source maps (can disable to reduce bundle)
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Content-addressed by filename, never rewritten in place — see the note
      // on staticAssetHeaders. /_next/image is not matched by any of these;
      // its TTL comes from images.minimumCacheTTL.
      { source: "/images/:path*", headers: staticAssetHeaders },
      { source: "/videos/:path*", headers: staticAssetHeaders },
      { source: "/Data/:path*", headers: staticAssetHeaders },
      // Must come after the Cache-Control rule above: Next merges headers from
      // every matching rule, so this adds X-Robots-Tag without displacing it.
      { source: "/:path*.pdf", headers: pdfRobotsHeaders },
      { source: "/geo/:path*", headers: staticAssetHeaders },
      { source: "/logo-transparent.png", headers: staticAssetHeaders },
      { source: "/apple-touch-icon.png", headers: staticAssetHeaders },
    ];
  },
};

module.exports = nextConfig;
