// Server-only join between the Industries page and the PDF library on disk.
//
// The Industries page already names, per sector, exactly which product lines
// ACTS sells into it (lib/data's IndustryProductLines). Until now those were
// dead-ends as far as documentation went: a chip linking to the brand page,
// and a separate trip to /brands#document-library to hunt for the matching
// datasheet. This resolves each line reference to BOTH destinations up front —
// the product's card on its brand page, and the line's own PDFs — so the
// dropdown on the Industries page can offer either without a detour.
//
// Documents are matched by name rather than hand-listed per line, for the same
// reason lib/brandHub matches them per product: the library is scanned off
// disk at build time, so a hand-written list would silently rot the first time
// a manufacturer adds or renames a file. Never import this into a client
// component — it reaches the filesystem through lib/documents.

import {
  getBrand,
  getProductLine,
  productLineAnchorId,
  type Industry,
} from "@/lib/data";
import {
  getBrandDocuments,
  docSearchText,
  docTokenMatches,
} from "@/lib/documents";

/** One PDF, flattened to just what the Industries dropdown renders. */
export type LibraryDoc = {
  title: string;
  /** Manufacturer doc code (EST's MK/DC references), shown as a small badge. */
  ref?: string;
  href: string;
  /** Human category label it was filed under, e.g. "Product Bulletins". */
  category: string;
};

/** One product line an industry names, resolved to a product link and its
 *  documents. */
export type LibraryEntry = {
  /** Unique within one industry — the <details> group name and React key. */
  id: string;
  /** The line's tag as written in lib/data, e.g. "SERIES 2600 / 2700". */
  tag: string;
  brandName: string;
  /** The line's own name and generic description, from the brand's data. */
  lineName: string;
  lineDescription: string;
  /** What this line specifically does in THIS industry. */
  note: string;
  /** The line's card on its brand page. */
  productHref: string;
  /** This brand's section of the full document library. */
  libraryHref: string;
  docs: LibraryDoc[];
  /** Matches before the display cap, so the UI can offer "view all N". */
  docTotal: number;
  /** True when `docs` are the brand's general catalogs rather than sheets for
   *  this line — the line has no PDF of its own in the library. */
  brandLevelDocs: boolean;
};

/** How many PDFs a dropdown lists before deferring to the full library. Some
 *  lines (EST's GripTight®) match 30+; a dropdown is a shortcut, not a second
 *  copy of /brands#document-library. */
const DISPLAY_LIMIT = 8;

/** Which documents lead. A visitor opening a product line wants the catalog or
 *  bulletin that describes it before the installation manual, and the manual
 *  well before a TÜV certificate or a shop procedure. Keyed by the category
 *  slugs in lib/documents' CONFIG; anything unlisted sorts last. */
const CATEGORY_RANK: Record<string, number> = {
  brochures: 0,
  "series-catalogs": 1,
  bulletins: 1,
  marketing: 1,
  insure: 2,
  iprsm: 2,
  instructions: 3,
  iomm: 3,
  "case-studies": 4,
  certs: 5,
  procedures: 6,
  articles: 7,
  "overview-ml": 8,
};

/** Search terms for lines the manufacturer never spells out in its filenames.
 *  EST sells its vacuum testers as one "G-Series" but names every PDF for the
 *  individual model, so the tag alone matches nothing. */
const TAG_ALIASES: Record<string, string[]> = {
  "G-SERIES": ["g-160", "g-250", "g-650"],
};

/** The brand-wide catalogs to fall back on for a line with no PDF of its own.
 *  Dyna-Flo publishes no per-valve bulletin for its sliding-stem, rotary or
 *  integral bodies, and Farris none for the 2850 — those lines are documented
 *  only inside the brand's overview. Matched against the humanized titles
 *  lib/documents produces, so a renamed file degrades to "no documents" rather
 *  than quietly attaching the wrong ones. */
const BRAND_OVERVIEW: Record<string, RegExp> = {
  "farris-engineering": /^product overview brochure$/i,
  "dyna-flo": /^product overview$/i,
  est: /^(product catalog|heat exchanger product line guide|test and isolation product line guide)$/i,
};

type RankedDoc = LibraryDoc & { rank: number };

/** Per-brand, per-build: the library is scanned once and six industries reach
 *  into it for the same three brands. */
const libraryCache = new Map<string, RankedDoc[]>();

/** Every English/neutral PDF for one brand, ranked and de-duplicated.
 *  Translations are dropped here: the dropdown shows at most eight documents,
 *  and a Polish copy of a catalog whose English original is already listed
 *  would only crowd out a different document. The full library still has them.
 *  A handful of files are filed under two scan directories (Farris's iNSURE
 *  catalog is both a series catalog and an iNSURE document) — the first,
 *  higher-ranked copy wins. */
function brandLibrary(brandSlug: string): RankedDoc[] {
  const cached = libraryCache.get(brandSlug);
  if (cached) return cached;

  const brand = getBrandDocuments().find((b) => b.slug === brandSlug);
  const docs: RankedDoc[] = [];
  const seen = new Set<string>();

  for (const category of brand?.categories ?? []) {
    for (const doc of category.docs) {
      if (doc.lang) continue;
      const key = `${doc.title}|${doc.ref ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      docs.push({
        title: doc.title,
        ref: doc.ref,
        href: doc.href,
        category: category.label,
        rank: CATEGORY_RANK[category.slug] ?? 9,
      });
    }
  }

  docs.sort(
    (a, b) => a.rank - b.rank || a.title.localeCompare(b.title, undefined, { numeric: true })
  );
  libraryCache.set(brandSlug, docs);
  return docs;
}

/** The searchable pieces of a line tag. Lines that cover several series are
 *  written as one tag ("360 / 390 / 350 / 370 / 380 / DF2000", "SIZEMASTER™ ·
 *  INSURE® · FAST NETWORK"), so the tag is split on its separators and each
 *  piece matched on its own. "Series" is dropped as a word — it prefixes half
 *  the tags and appears in unrelated filenames. */
function tagFragments(tag: string): string[] {
  const alias = TAG_ALIASES[tag];
  if (alias) return alias;
  return tag
    .replace(/[®™]/g, " ")
    .split(/[/·,]/)
    .map((part) =>
      part
        .replace(/\bseries\b/gi, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
    )
    .filter((part) => part.length >= 2);
}

function docsForLine(
  brandSlug: string,
  tag: string
): { docs: RankedDoc[]; brandLevelDocs: boolean } {
  const library = brandLibrary(brandSlug);
  const fragments = tagFragments(tag);
  const matches = library.filter((doc) => {
    const text = docSearchText(doc);
    return fragments.some((fragment) => docTokenMatches(text, fragment));
  });
  if (matches.length) return { docs: matches, brandLevelDocs: false };

  const overview = BRAND_OVERVIEW[brandSlug];
  return {
    docs: overview ? library.filter((doc) => overview.test(doc.title)) : [],
    brandLevelDocs: true,
  };
}

/**
 * Every product line one industry names, in the order lib/data declares them,
 * each resolved to its product page and its documents. Skips a reference whose
 * brand or line no longer exists rather than throwing — the same degradation
 * the chips and Key Applications cards already use, and `npm run check:links`
 * fails the build on any such reference anyway.
 */
export function getIndustryLibrary(industry: Industry): LibraryEntry[] {
  const entries: LibraryEntry[] = [];

  for (const group of industry.productLines) {
    const brand = getBrand(group.brandSlug);
    if (!brand) continue;
    const anchor =
      getBrandDocuments().find((b) => b.slug === brand.slug)?.anchor ??
      "document-library";

    for (const { tag, note } of group.lines) {
      const line = getProductLine(group.brandSlug, tag);
      if (!line) continue;
      const { docs, brandLevelDocs } = docsForLine(group.brandSlug, tag);

      entries.push({
        id: `${industry.slug}-${brand.slug}-${productLineAnchorId(line)}`,
        tag,
        brandName: brand.name,
        lineName: line.name,
        lineDescription: line.description,
        note,
        productHref: `/brands/${brand.slug}#${productLineAnchorId(line)}`,
        libraryHref: `/brands#${anchor}`,
        docs: docs
          .slice(0, DISPLAY_LIMIT)
          .map((doc) => ({
            title: doc.title,
            ref: doc.ref,
            href: doc.href,
            category: doc.category,
          })),
        docTotal: docs.length,
        brandLevelDocs,
      });
    }
  }

  return entries;
}
