/* Regenerates the homepage brand-card tiles in public/images/cards/.
   Run from the repo root after adding product shots:  node scripts/normalize-brand-cards.mjs

   For every image in public/images/{farris,dynaflo,est}/ plus the three
   bestseller lead cut-outs, this:
     1. crops off the branded datasheet footer (detected via the full-width
        divider line above it; images without one pass through untouched),
     2. trims the white page margins down to the product's bounding box,
     3. re-centers the product at a uniform relative size on an identical
        15:16 white canvas (matching the card's aspect-15/16 frame), leaving
        the bottom strip clear for the white fade + "BRAND 01" label.

   It also flags frames whose corners aren't white (photographs, full-bleed
   illustrations) — list those in CARD_EXCLUDE in lib/brandProductImages.ts
   so the homepage rotation only shows clean product-on-white tiles. */

import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PROJECT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(PROJECT, "public", "images");
const OUT_ROOT = path.join(PUB, "cards");

// Canvas: 15:16 to match the card's aspect-15/16 frame.
const CANVAS_W = 900;
const CANVAS_H = 960;
// Product fit box: centered horizontally; vertically centered in the top 88%
// so the bottom strip stays clear for the white fade + "BRAND 01" label.
const FIT_W = Math.round(CANVAS_W * 0.8);
const FIT_H = Math.round(CANVAS_H * 0.72);
const V_BAND = 0.88;

const BRANDS = ["farris", "dynaflo", "est"];
const LEADS = {
  farris: "home/bestseller-farris.jpg",
  dynaflo: "home/bestseller-dynaflo.jpg",
  est: "home/bestseller-est.jpg",
};

/** Find the topmost full-width non-white row in the 55%..95% height band —
    the divider line above the branded footer. Returns original-y or null. */
async function findDividerY(file) {
  const SMALL_W = 220;
  const img = sharp(file);
  const meta = await img.metadata();
  const scale = meta.height / Math.round((meta.height * SMALL_W) / meta.width);
  const { data, info } = await img
    .resize({ width: SMALL_W })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  for (let y = Math.floor(h * 0.55); y < Math.floor(h * 0.95); y++) {
    let hits = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      if (min < 150) hits++;
    }
    if (hits / w > 0.97) return Math.max(0, Math.floor(y * scale) - 3);
  }
  return null;
}

/** Corner whiteness of the trimmed product box → cutout vs photograph. */
function classify(data, w, h) {
  const S = Math.max(4, Math.floor(Math.min(w, h) * 0.06));
  const corners = [
    [0, 0],
    [w - S, 0],
    [0, h - S],
    [w - S, h - S],
  ];
  let whiteCorners = 0;
  for (const [cx, cy] of corners) {
    let sum = 0;
    let n = 0;
    for (let y = cy; y < cy + S; y++)
      for (let x = cx; x < cx + S; x++) {
        const i = (y * w + x) * 3;
        sum += Math.min(data[i], data[i + 1], data[i + 2]);
        n++;
      }
    if (sum / n > 232) whiteCorners++;
  }
  return whiteCorners >= 3 ? "cutout" : "photo";
}

async function processOne(srcRel, outFile) {
  const src = path.join(PUB, srcRel);
  const dividerY = await findDividerY(src);

  // Footer crop must be its own pass: sharp always runs trim() before
  // extract() within one pipeline, which would shift the crop coordinates.
  let input = src;
  if (dividerY !== null) {
    const meta = await sharp(src).metadata();
    input = await sharp(src)
      .extract({ left: 0, top: 0, width: meta.width, height: dividerY })
      .toBuffer();
  }

  // Trim the white page margins down to the product's bounding box.
  let trimmed;
  try {
    trimmed = await sharp(input)
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 18 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    trimmed = await sharp(input)
      .flatten({ background: "#ffffff" })
      .toBuffer({ resolveWithObject: true });
  }
  const { data: tBuf, info: tInfo } = trimmed;

  const raw = await sharp(tBuf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const kind = classify(raw.data, raw.info.width, raw.info.height);

  // Scale into the fit box, keep aspect.
  const s = Math.min(FIT_W / tInfo.width, FIT_H / tInfo.height, 1.6);
  const w = Math.round(tInfo.width * s);
  const h = Math.round(tInfo.height * s);
  const left = Math.round((CANVAS_W - w) / 2);
  const top = Math.round((CANVAS_H * V_BAND - h) / 2);

  const product = await sharp(tBuf).resize(w, h).toBuffer();
  await sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: product, left, top }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outFile);

  return { src: srcRel, out: path.basename(outFile), kind };
}

for (const brand of BRANDS) {
  const outDir = path.join(OUT_ROOT, brand);
  await mkdir(outDir, { recursive: true });
  const rows = [];

  // Lead cut-out first.
  rows.push(await processOne(LEADS[brand], path.join(outDir, "lead.jpg")));

  const files = (await readdir(path.join(PUB, brand))).filter((f) => f.endsWith(".jpg"));
  for (const f of files) {
    rows.push(await processOne(`${brand}/${f}`, path.join(outDir, f)));
  }

  const photos = rows.filter((r) => r.kind === "photo").map((r) => r.out);
  console.log(
    `${brand}: ${rows.length} tiles | non-white frames (consider CARD_EXCLUDE): [${photos.join(", ")}]`
  );
}
