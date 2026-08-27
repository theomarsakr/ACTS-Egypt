import type { MetadataRoute } from "next";
import { brands } from "@/lib/data";
import { HUB_BRANDS, getBrandHubData } from "@/lib/brandHub";
import { arRoutes } from "@/lib/i18n/routing";
import { SITE_URL as siteUrl } from "@/lib/seo";

/* Priorities reflect what ACTS actually needs to rank for.
 *
 * The brand and product pages were previously below the static pages (0.6 and
 * 0.5, under /about at 0.7) — backwards, given that "farris egypt",
 * "dyna-flo control valve egypt" and "pop-a-plug egypt" are the queries with
 * both intent and no incumbent. They lead now.
 *
 * `priority` is only a hint about relative importance WITHIN this site, and
 * `changeFrequency` is close to ignored by Google — neither buys ranking. They
 * are set honestly here and nothing more is claimed by them.
 */
const BRAND_PRIORITY = 0.9;
const PRODUCT_PRIORITY = 0.8;

const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/brands", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
  { path: "/quote", priority: 0.7, changeFrequency: "yearly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/projects", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

/**
 * Arabic alternates for a path, but only where an Arabic page genuinely
 * exists (lib/i18n `arRoutes`, mirrored by proxy.ts). Every other /ar/* URL
 * 307-redirects to English; listing those as alternates would point Google at
 * redirects, which is how hreflang clusters get discarded wholesale.
 */
function alternates(path: string) {
  if (!arRoutes.has(path || "/")) return undefined;
  const arSuffix = path === "" ? "/ar" : `/ar${path}`;
  return {
    languages: {
      en: `${siteUrl}${path}`,
      "ar-EG": `${siteUrl}${arSuffix}`,
      "x-default": `${siteUrl}${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: alternates(r.path),
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${siteUrl}/brands/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: BRAND_PRIORITY,
  }));

  const productEntries: MetadataRoute.Sitemap = HUB_BRANDS.flatMap((slug) => {
    const hub = getBrandHubData(slug);
    return (hub?.products ?? []).map((p) => ({
      url: `${siteUrl}/brands/${slug}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: PRODUCT_PRIORITY,
    }));
  });

  // The Arabic pages get their own rows as well as being named as alternates
  // above — a hreflang cluster only resolves if both sides are crawlable and
  // both point back at each other.
  const arabicEntries: MetadataRoute.Sitemap = [...arRoutes].map((path) => {
    const enPath = path === "/" ? "" : path;
    const arUrl = path === "/" ? `${siteUrl}/ar` : `${siteUrl}/ar${path}`;
    return {
      url: arUrl,
      lastModified: now,
      changeFrequency: path === "/" ? ("monthly" as const) : ("yearly" as const),
      priority: path === "/" ? 0.9 : 0.6,
      alternates: alternates(enPath),
    };
  });

  return [...staticEntries, ...brandEntries, ...productEntries, ...arabicEntries];
}
