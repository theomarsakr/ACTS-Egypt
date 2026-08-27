/* Single source of truth for page metadata and structured data.
 *
 * Before this existed, each page hand-rolled `alternates.canonical` and
 * nothing else — which meant every page inherited the ROOT layout's
 * `openGraph` block verbatim. The live site was serving
 *   og:title   = "ACTS Egypt | Valves, Flow Control & Process Equipment"
 *   og:url     = "https://www.actsegypt.com"
 * on /projects, /about, every brand page and all 45 product pages. Google
 * was rendering the homepage title against the /projects URL in its results
 * (verified in the SERP), and og:url disagreed with rel=canonical on every
 * page but the homepage. `buildMetadata` closes that off: one call emits
 * title, description, canonical, hreflang, Open Graph and Twitter together,
 * so they cannot drift apart again.
 *
 * Everything here composes copy from `lib/data` / `lib/brandHub` facts. No
 * claim is introduced that the site does not already make.
 */

import type { Metadata } from "next";
import { arRoutes } from "@/lib/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.actsegypt.com";

export const SITE_NAME = "ACTS Egypt";
export const LEGAL_NAME = "Advanced Company for Trading Services (ACTS)";
export const LEGAL_NAME_AR = "الشركة المتقدمة للخدمات التجارية";

/* Suffix every title carries. Kept out of `title.template` because the
 * template does not apply to `openGraph.title`, and the two drifting apart is
 * exactly the bug this module exists to prevent — so titles are composed once,
 * here, and passed through as absolute strings.
 *
 * Brand-name queries in Egypt are typed both ways ("ACTS Egypt" and "ACTS
 * مصر"), so each locale's pages end on the form that locale's searchers use.
 * The Latin "ACTS" is in both, which is the part that actually anchors the
 * brand match. */
const TITLE_SUFFIXES: Record<string, string> = {
  en: " | ACTS Egypt",
  ar: " | ACTS مصر",
};

export const TITLE_SUFFIX = TITLE_SUFFIXES.en;

const DEFAULT_OG_IMAGE = "/images/refinery-blue.jpg";
const DEFAULT_OG_ALT =
  "ACTS, industrial valve and process equipment supplier in Egypt";

/** Google truncates around 60-65 characters. Titles longer than this still
 *  work (the head of the title is what matters, and it is always the
 *  product/brand term), but the check keeps new copy honest in review. */
export const TITLE_SOFT_LIMIT = 65;

type BuildMetadataInput = {
  /** Page-specific part of the title — " | ACTS Egypt" is appended unless the
   *  title already ends in "ACTS Egypt" (the homepage). */
  title: string;
  description: string;
  /** Locale-independent path, always the English one, e.g. "/brands/est". */
  path: string;
  lang?: string;
  /** Page-specific social image. Relative to the site root. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  /** Set for pages that must never be indexed (none today; the escape hatch
   *  exists so a future thank-you or utility page cannot be forgotten). */
  noindex?: boolean;
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path.replace(/\/+$/, "") : `/${path}`;
}

function arPath(path: string): string {
  return path === "/" ? "/ar" : `/ar${path}`;
}

/** Full absolute title, e.g. "Farris 2600 Series … | ACTS Egypt". Idempotent,
 *  so a title that already carries the suffix is not given a second one. */
export function fullTitle(title: string, lang = "en"): string {
  const suffix = TITLE_SUFFIXES[lang] ?? TITLE_SUFFIXES.en;
  return title.endsWith(suffix.trim().replace(/^\|\s*/, ""))
    ? title
    : `${title}${suffix}`;
}

/**
 * Builds a complete, self-consistent metadata object for one page.
 *
 * hreflang is emitted ONLY for the routes that genuinely have an Arabic page
 * (lib/i18n `arRoutes`, mirrored by proxy.ts). Every other /ar/* URL 307s to
 * its English page, so advertising an Arabic alternate for those would point
 * Google at a redirect — the classic way to get hreflang silently dropped.
 */
export function buildMetadata({
  title,
  description,
  path,
  lang = "en",
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_ALT,
  type = "website",
  noindex = false,
}: BuildMetadataInput): Metadata {
  const enPath = normalizePath(path);
  const isAr = lang === "ar";
  const hasArabic = arRoutes.has(enPath);
  const canonical = isAr && hasArabic ? arPath(enPath) : enPath;
  const resolved = fullTitle(title, lang);

  return {
    title: { absolute: resolved },
    description,
    alternates: {
      canonical,
      ...(hasArabic
        ? {
            languages: {
              en: enPath,
              "ar-EG": arPath(enPath),
              "x-default": enPath,
            },
          }
        : {}),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: resolved,
      description,
      url: `${SITE_URL}${canonical === "/" ? "" : canonical}`,
      locale: isAr ? "ar_EG" : "en_US",
      ...(hasArabic
        ? { alternateLocale: isAr ? ["en_US"] : ["ar_EG"] }
        : {}),
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolved,
      description,
      images: [image],
    },
  };
}

// ── Entity graph ────────────────────────────────────────────────────────────

/* The three manufacturers ACTS represents are all Curtiss-Wright divisions.
 * Stating that relationship in structured data (rather than only in prose) is
 * what lets Google connect "Curtiss-Wright Egypt", "Curtiss-Wright Farris
 * Egypt" and "Curtiss-Wright Dyna-Flo Egypt" to ACTS's pages. It is also
 * simply true — see each brand's own description in lib/data. */
export const CURTISS_WRIGHT = {
  "@type": "Organization",
  name: "Curtiss-Wright Corporation",
  url: "https://www.curtisswright.com/",
} as const;

export const BRAND_ENTITIES = [
  {
    slug: "farris-engineering",
    name: "Farris Engineering",
    url: "https://valves.curtisswright.com/en-us/Farris",
  },
  {
    slug: "dyna-flo",
    name: "Dyna-Flo",
    url: "https://valves.curtisswright.com/en-us/Dynaflo",
  },
  {
    slug: "est",
    name: "EST Group",
    url: "https://valves.curtisswright.com/en-us/EST",
  },
] as const;

/** The brand as a schema.org Organization — a Curtiss-Wright division with a
 *  page on this site. Referenced by `@id` from the product pages so a product,
 *  its brand and ACTS all resolve to the same three nodes site-wide. */
export function brandEntitySchema(slug: string, description?: string) {
  const entity = BRAND_ENTITIES.find((b) => b.slug === slug);
  if (!entity) return null;
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/brands/${slug}#brand`,
    name: entity.name,
    url: `${SITE_URL}/brands/${slug}`,
    sameAs: [entity.url],
    parentOrganization: CURTISS_WRIGHT,
    ...(description ? { description } : {}),
  };
}

// ── Structured data ─────────────────────────────────────────────────────────

export type Crumb = { name: string; path: string };

/**
 * BreadcrumbList for one page. `crumbs` excludes the site root, which is
 * always prepended — so a product page passes Brands → <Brand> → <Product>.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

/** An ordered list of internal URLs — used for the brand index and for each
 *  brand's product catalog, so search engines see the catalog as a set rather
 *  than 45 unrelated leaf pages. */
export function itemListSchema(
  name: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}

/** CollectionPage wrapper for the index pages (brands, products, industries). */
export function collectionPageSchema({
  name,
  description,
  path,
  lang = "en",
}: {
  name: string;
  description: string;
  path: string;
  lang?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: fullTitle(name, lang),
    description,
    url: `${SITE_URL}${normalizePath(path)}`,
    inLanguage: lang === "ar" ? "ar-EG" : "en",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}
