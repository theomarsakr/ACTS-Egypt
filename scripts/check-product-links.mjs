/* Verifies every product-line reference on the Industries page resolves to a
   real product line on the brand it names.  Run from the repo root:
       node scripts/check-product-links.mjs

   The Industries page links each "relevant product line" straight to that
   line's card on the brand page, addressing it by the line's `tag` (see
   IndustryProductLines in lib/data.ts).  A tag renamed on the brand side —
   or a typo here — would silently render as a missing chip rather than a
   visible error, so this fails loudly instead.  Also guards the anchor ids
   those links point at: two lines on one brand slugifying to the same id
   would make one of them unreachable. */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "lib", "data.ts");

// data.ts is TypeScript, and this script stays dependency-free, so read the
// two structures out of the source rather than importing it.
const src = await readFile(dataPath, "utf8");

/** Slice the source between a top-level `export const <name>` and the next
 *  top-level `export`, so the regex scans below stay inside that one block. */
function block(name) {
  const start = src.indexOf(`export const ${name}`);
  if (start === -1) throw new Error(`Could not find "export const ${name}" in lib/data.ts`);
  const next = src.indexOf("\nexport ", start + 1);
  return src.slice(start, next === -1 ? undefined : next);
}

// Brand slug -> the product-line tags declared under its `productLines:`.
// Product lines sit at 8-space indent; the gallery entries further down use
// 10, which is what keeps those out of this map.
const brandsBlock = block("brands");
const brandLineTags = new Map();
for (const brandMatch of brandsBlock.matchAll(/^ {4}slug: "([^"]+)",$/gm)) {
  const slug = brandMatch[1];
  const from = brandMatch.index;
  const rest = brandsBlock.slice(from);
  const linesStart = rest.indexOf("productLines: [");
  const linesEnd = rest.indexOf("\n    externalUrl:");
  if (linesStart === -1 || linesEnd === -1) continue;
  const tags = [...rest.slice(linesStart, linesEnd).matchAll(/^ {8}tag: "([^"]+)",$/gm)].map(
    (m) => m[1]
  );
  brandLineTags.set(slug, tags);
}

if (brandLineTags.size === 0) {
  console.error("✗ Parsed no brands out of lib/data.ts — the file's shape changed.");
  process.exit(1);
}

// Mirrors productLineAnchorId() in lib/data.ts.
const anchorId = (tag) =>
  `line-${tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;

const errors = [];

// 1. Anchor ids must be unique within a brand, or a deep link is ambiguous.
for (const [slug, tags] of brandLineTags) {
  const seen = new Map();
  for (const tag of tags) {
    const id = anchorId(tag);
    if (seen.has(id)) {
      errors.push(
        `${slug}: "${tag}" and "${seen.get(id)}" both slugify to #${id} — one would be unreachable.`
      );
    }
    seen.set(id, tag);
  }
}

// 2. Every industry lineTags entry must name a real line on that brand.
const industriesBlock = block("industries");
let checked = 0;
for (const group of industriesBlock.matchAll(
  /brandSlug: "([^"]+)",\s*\n?\s*lineTags: \[([\s\S]*?)\]/g
)) {
  const [, slug, body] = group;
  const known = brandLineTags.get(slug);
  if (!known) {
    errors.push(`Unknown brandSlug "${slug}" referenced in industries.`);
    continue;
  }
  for (const tagMatch of body.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
    const tag = tagMatch[1];
    checked++;
    if (!known.includes(tag)) {
      errors.push(
        `${slug}: no product line tagged "${tag}".\n    Available: ${known.map((t) => `"${t}"`).join(", ")}`
      );
    }
  }
}

if (checked === 0) {
  console.error("✗ Found no industry lineTags references — the data shape changed.");
  process.exit(1);
}

if (errors.length) {
  console.error(`✗ ${errors.length} broken product-line link(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const lineCount = [...brandLineTags.values()].reduce((n, t) => n + t.length, 0);
console.log(
  `✓ ${checked} industry product-line links resolve across ${brandLineTags.size} brands (${lineCount} lines, all anchor ids unique).`
);
