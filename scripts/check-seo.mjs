/* Guards the search-result copy. Run from the repo root:
       node scripts/check-seo.mjs
   (or `npm run check:seo`)

   Titles and descriptions are the only part of the site a searcher sees
   before deciding whether to click, and they fail silently: a product added
   to lib/brandHub without an entry in lib/productSeo still renders a page, it
   just renders one with generic, generated copy that will not win the query.
   The same goes for a title that runs past Google's truncation point, or two
   products that accidentally share a description — nothing breaks, the page
   simply competes worse. So they are checked here instead.

   Dependency-free and source-parsing, matching scripts/check-product-links.mjs
   — these are .ts modules and the repo has no TS loader wired up for scripts.
*/

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/* Normalize CRLF away. .gitattributes sets `* text=auto`, so these files check
   out with CRLF on Windows, and every `\n` in the patterns below would
   otherwise fail to match — reporting "the file's shape changed" for a line
   ending rather than for anything about the content. */
const read = async (...p) =>
  (await readFile(path.join(root, ...p), "utf8")).replace(/\r\n/g, "\n");

const [hubSrc, seoSrc, dataSrc] = await Promise.all([
  read("lib", "brandHub.ts"),
  read("lib", "productSeo.ts"),
  read("lib", "data.ts"),
]);

const SUFFIX = " | ACTS Egypt";
/* Google renders roughly 600px of title, which is ~60-65 characters at its
   default face. Past that the tail is dropped — acceptable when the tail is
   the company name, fatal when it is the series number. */
const TITLE_MAX = 65;
/* Descriptions are truncated near 160 characters on desktop and shorter on
   mobile. The floor catches copy that is too thin to say anything. */
const DESC_MAX = 165;
const DESC_MIN = 70;

const errors = [];
const warnings = [];

// ── 1. Every hub product has hand-tuned SEO copy ────────────────────────────

// Product catalogs are `const FARRIS: HubProduct[] = [` ... keyed into
// PRODUCTS by brand slug at the bottom of the file.
const catalogs = new Map();
for (const m of hubSrc.matchAll(/^const ([A-Z]+): HubProduct\[\] = \[/gm)) {
  const name = m[1];
  const rest = hubSrc.slice(m.index);
  const end = rest.indexOf("\n];");
  const ids = [...rest.slice(0, end).matchAll(/^ {4}id: "([^"]+)",$/gm)].map(
    (x) => x[1]
  );
  catalogs.set(name, ids);
}

const productsBlock = hubSrc.slice(
  hubSrc.indexOf("const PRODUCTS: Record<string, HubProduct[]> = {")
);
const slugToCatalog = new Map();
for (const m of productsBlock
  .slice(0, productsBlock.indexOf("\n};"))
  .matchAll(/^ {2}"?([a-z-]+)"?: ([A-Z]+),$/gm)) {
  slugToCatalog.set(m[1], m[2]);
}

if (slugToCatalog.size === 0) {
  console.error("✗ Parsed no brand catalogs out of lib/brandHub.ts — its shape changed.");
  process.exit(1);
}

const expectedKeys = [];
for (const [slug, catalog] of slugToCatalog) {
  const ids = catalogs.get(catalog);
  if (!ids?.length) {
    errors.push(`No products parsed for catalog ${catalog} (brand "${slug}").`);
    continue;
  }
  for (const id of ids) expectedKeys.push(`${slug}:${id}`);
}

// ── 2. Read the authored entries ────────────────────────────────────────────

const entries = new Map();
for (const m of seoSrc.matchAll(
  /^ {2}"([a-z0-9:-]+)": \{\n {4}title:\s*\n?\s*"((?:[^"\\]|\\.)*)",\n {4}description:\n\s*"((?:[^"\\]|\\.)*)",\n {2}\},$/gm
)) {
  entries.set(m[1], {
    title: m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
    description: m[3].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
  });
}

if (entries.size === 0) {
  console.error("✗ Parsed no entries out of lib/productSeo.ts — its shape changed.");
  process.exit(1);
}

for (const key of expectedKeys) {
  if (!entries.has(key)) {
    errors.push(
      `${key}: no entry in lib/productSeo.ts — the page would fall back to generated copy.`
    );
  }
}
for (const key of entries.keys()) {
  if (!expectedKeys.includes(key)) {
    errors.push(`${key}: entry in lib/productSeo.ts names no product in lib/brandHub.ts.`);
  }
}

// ── 3. Length and uniqueness ────────────────────────────────────────────────

const seenTitles = new Map();
const seenDescriptions = new Map();

function checkPair(label, title, description) {
  const rendered = title.endsWith("ACTS Egypt") ? title : title + SUFFIX;
  if (rendered.length > TITLE_MAX) {
    warnings.push(
      `${label}: title is ${rendered.length} chars (>${TITLE_MAX}) — "${rendered}"`
    );
  }
  if (description.length > DESC_MAX) {
    warnings.push(
      `${label}: description is ${description.length} chars (>${DESC_MAX}) — Google will cut it.`
    );
  }
  if (description.length < DESC_MIN) {
    warnings.push(`${label}: description is only ${description.length} chars.`);
  }
  if (!/egypt|مصر/i.test(description)) {
    warnings.push(`${label}: description never says Egypt — the whole geographic intent is missing.`);
  }
  const priorTitle = seenTitles.get(rendered);
  if (priorTitle) errors.push(`${label} and ${priorTitle} share a title: "${rendered}"`);
  else seenTitles.set(rendered, label);

  const priorDesc = seenDescriptions.get(description);
  if (priorDesc) errors.push(`${label} and ${priorDesc} share a description.`);
  else seenDescriptions.set(description, label);
}

for (const [key, { title, description }] of entries) {
  checkPair(key, title, description);
}

// ── 4. Brand pages carry their own SEO fields ───────────────────────────────

const brandSlugs = [...dataSrc.matchAll(/^ {4}slug: "([a-z-]+)",$/gm)].map((m) => m[1]);

/* Pull the three SEO fields per brand block rather than requiring them to sit
   adjacent — `productHeadingPrefix` legitimately lands between them for two of
   the three brands, and an over-tight regex here would fail the build for a
   formatting reason rather than a content one. */
const brandsBlockSrc = dataSrc.slice(
  dataSrc.indexOf("export const brands: Brand[] = ["),
  dataSrc.indexOf("\nexport function getBrand")
);
const brandSeo = [];
const brandStarts = [...brandsBlockSrc.matchAll(/^ {4}slug: "([a-z-]+)",$/gm)];
for (let i = 0; i < brandStarts.length; i++) {
  const slug = brandStarts[i][1];
  const chunk = brandsBlockSrc.slice(
    brandStarts[i].index,
    brandStarts[i + 1]?.index
  );
  const title = chunk.match(/^ {4}seoTitle: "((?:[^"\\]|\\.)*)",$/m)?.[1];
  const heading = chunk.match(/^ {4}seoHeading: "((?:[^"\\]|\\.)*)",$/m)?.[1];
  const description = chunk.match(
    /^ {4}seoDescription:\n\s*"((?:[^"\\]|\\.)*)",$/m
  )?.[1];
  if (!title || !heading || !description) {
    errors.push(
      `brand "${slug}": missing ${[
        !title && "seoTitle",
        !heading && "seoHeading",
        !description && "seoDescription",
      ]
        .filter(Boolean)
        .join(", ")} in lib/data.ts.`
    );
    continue;
  }
  brandSeo.push({ slug, title, heading, description });
}

const declaredBrands = [...slugToCatalog.keys()];
for (const slug of declaredBrands) {
  if (!brandSeo.some((b) => b.slug === slug)) {
    errors.push(`brand "${slug}" has a product catalog but no complete SEO copy.`);
  }
}
for (const { slug, title, description } of brandSeo) {
  checkPair(`brand "${slug}"`, title, description.replace(/\\'/g, "'"));
}

// ── Report ──────────────────────────────────────────────────────────────────

if (warnings.length) {
  console.warn(`⚠ ${warnings.length} SEO copy warning(s):\n`);
  for (const w of warnings) console.warn(`  - ${w}`);
  console.warn("");
}

if (errors.length) {
  console.error(`✗ ${errors.length} SEO copy error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `✓ ${entries.size} product pages and ${brandSeo.length} brand pages have unique, ` +
    `length-checked titles and descriptions across ${brandSlugs.length} data blocks.`
);
