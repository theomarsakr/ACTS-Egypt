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

const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 90: hero photos (contact/quote) with 4:2:0 chroma subsampling band
    // visibly at the default 75 once the scrim opens up to show them.
    qualities: [75, 90],
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
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
