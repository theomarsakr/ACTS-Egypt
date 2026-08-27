import type { MetadataRoute } from "next";
import { SITE_URL as siteUrl } from "@/lib/seo";

/* Deliberately permissive.
 *
 * Everything that earns traffic — brand pages, the 45 product pages, the PDF
 * library under /Data, and the product photography — must stay crawlable, so
 * nothing here touches them. Blocking /Data would be the easy mistake: it
 * holds the manufacturer literature that gives the product pages their
 * topical depth.
 *
 * The two disallows are genuinely useless to a crawler:
 *   /api/  — the RFQ endpoint. POST-only, returns JSON, no content.
 *   /en/   — proxy.ts 308-redirects the whole prefix to the unprefixed
 *            English tree. Nothing links there; it exists only so an old or
 *            hand-typed /en/* URL still resolves.
 *
 * `host` is kept: it names www.actsegypt.com as the preferred host, which
 * matters because the apex and www both resolve.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
