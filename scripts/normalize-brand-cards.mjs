/* Regenerates the homepage brand-card tiles in public/images/cards/.
   Run from the repo root after adding product shots:  node scripts/normalize-brand-cards.mjs

   For every image in public/images/{farris,dynaflo,est}/ plus the three
   bestseller lead cut-outs, this:
     1. crops off the branded datasheet footer (detected via the full-width
        divider line above it; images without one pass through untouched),
     2. trims the white page margins down to the product's bounding box,
     3. re-centers the product at a uniform relative size on an identical
        5:3 white canvas (matching the card's aspect-5/3 frame), leaving
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

// Canvas: 5:3 to match the card's aspect-5/3 frame.
const CANVAS_W = 1200;
const CANVAS_H = 720;

/* Safe area the product may occupy. The bottom edge clears the "BRAND 01"
   label (bottom-3.5, ~11.5px caps => its top lands near y=632 here), so the
   label always sits on clean canvas rather than relying on the card's white
   bottom fade — that fade is only ~9% opaque where the text starts, far too
   little to carry contrast over a dark product. */
const SAFE_TOP = 26;
const SAFE_BOTTOM = 624;
const SAFE_LEFT = 40;
const SAFE_RIGHT = 1160;
const SAFE_W = SAFE_RIGHT - SAFE_LEFT;
const SAFE_H = SAFE_BOTTOM - SAFE_TOP;

/* The card overlays a brand logo badge in the top-right corner. Its painted
   box (top-3.5 right-3.5, px-3 py-2, a 24px-tall logo up to ~85px wide) maps
   to roughly x>=815, y<=176 on this canvas; these carry a few px of margin on
   top of that. A product placed into that corner reads as colliding with the
   badge however the card is styled, so placement below treats it as a keep-out
   rather than relying on the card's own white corner fade to hide the clash. */
const BADGE_X0 = 810;
const BADGE_Y1 = 182;
/* Where a product gets dropped to when it would otherwise hit the badge. */
const BELOW_BADGE_TOP = 196;

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

  /* Largest centered placement that fits the given box, keeping aspect. */
  const place = (maxW, maxH, bandTop) => {
    const s = Math.min(maxW / tInfo.width, maxH / tInfo.height, 1.6);
    const w = Math.round(tInfo.width * s);
    const h = Math.round(tInfo.height * s);
    return {
      w,
      h,
      left: Math.round((CANVAS_W - w) / 2),
      top: Math.round(bandTop + (maxH - h) / 2),
    };
  };
  const hitsBadge = (p) => p.left + p.w > BADGE_X0 && p.top < BADGE_Y1;

  /* Prefer the full safe area — tall, narrow products (most valves) never
     reach the badge corner there and stay as large as the frame allows. Only
     the wide ones that would run under the badge get dropped into the shorter
     band beneath it, which costs some size but is always collision-free. */
  let p = place(SAFE_W, SAFE_H, SAFE_TOP);
  if (hitsBadge(p)) {
    p = place(SAFE_W, SAFE_BOTTOM - BELOW_BADGE_TOP, BELOW_BADGE_TOP);
  }
  const { w, h, left, top } = p;

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

  // Sources may be .jpg or .png (higher-res re-exports); tiles are always .jpg.
  const files = (await readdir(path.join(PUB, brand))).filter((f) =>
    /\.(jpe?g|png)$/i.test(f)
  );
  for (const f of files) {
    const outName = f.replace(/\.(jpe?g|png)$/i, ".jpg");
    rows.push(await processOne(`${brand}/${f}`, path.join(outDir, outName)));
  }

  const photos = rows.filter((r) => r.kind === "photo").map((r) => r.out);
  console.log(
    `${brand}: ${rows.length} tiles | non-white frames (consider CARD_EXCLUDE): [${photos.join(", ")}]`
  );
}
