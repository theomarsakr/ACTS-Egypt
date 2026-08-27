/* Regenerates the sector artwork in public/images/sectors/ used by the
   industry tabs (/industries) and the client-portfolio tabs (/projects).
   Run from the repo root after adding sector art:
     node scripts/normalize-sector-images.mjs

   The nine source files ACTS supplied are two different kinds of picture, and
   the tab panel can only render one of them full-bleed:

     - PHOTOS fill the panel edge to edge under a navy gradient, exactly as the
       stock shots they replace did. They are only re-encoded here: capped at
       MAX_W and written as mozjpeg, which takes the 2.2 MB "Oil and Gas.png"
       down to a couple of hundred KB.

     - EMBLEMS are square line-art/3D icons sitting on their own white or cream
       plate. object-cover in a tall 2/5-width column would crop them to a
       vertical slice of themselves, so they get a different treatment: the
       source plate is normalised to pure white, trimmed away, and the artwork
       re-centered at one uniform relative size on an identical white square.
       <SectorPanel> then renders it object-contain with mix-blend-multiply
       over its cream plate, so the canvas vanishes into that plate and the
       three cream-plated sources and the two white-plated ones come out
       matching, with no halo where the anti-aliased edges used to meet white.

   Source filenames are kept verbatim below (spaces, "Fertlizers",
   "Water Treatement") because that is what is on disk; everything downstream
   references only the kebab-case slugs in the `out` column. */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PROJECT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
/* The sources live outside public/ on purpose: they are 7 MB of full-size
   originals that nothing on the site loads, so shipping them to the CDN would
   be pure deploy weight (and would leave them publicly downloadable). Only the
   derivatives below are served. */
const SRC_DIR = path.join(PROJECT, "2026-08-14", "images", "sector-sources");
const OUT_DIR = path.join(PROJECT, "public", "images", "sectors");

/** Widest the panel is ever asked to render a photo (40vw of a 2xl container
    on a 2x display), rounded up. Sources narrower than this are left alone
    rather than upscaled into softness. */
const MAX_W = 1600;

/** Emblem canvas — square, because every emblem source is, and the panel
    renders them object-contain so the canvas aspect is not load-bearing. */
const EMBLEM = 900;
/** Share of the canvas the trimmed artwork spans, so all five emblems read at
    one size next to each other rather than each at its own source scale. */
const EMBLEM_FILL = 0.84;
/** Emblems are baked on pure white and rendered with mix-blend-multiply, which
    is what lets <SectorPanel> put them on a *shaded* cream plate seamlessly:
    multiply against white is the identity, so the canvas disappears into
    whatever the panel paints beneath it and only the artwork survives. Baking
    them on the cream itself would instead multiply cream by cream and leave
    the canvas showing as a darker square. */
const PLATE = "#ffffff";

/** out = the slug every consumer references; src = what is actually on disk. */
const SOURCES = [
  // Photographs — industries
  { out: "oil-gas", src: "Oil and Gas.png", kind: "photo" },
  { out: "petrochemicals", src: "Petrochemicals.jpg", kind: "photo" },
  { out: "water-treatment", src: "Water Treatement.jpg", kind: "photo" },
  { out: "fertilizers", src: "Fertlizers.jpg", kind: "photo" },
  // Emblems — industries
  { out: "power-generation", src: "Power Generation.jpg", kind: "emblem" },
  { out: "general-industrial", src: "General industries.jpg", kind: "emblem" },
  // Emblems — projects & clients
  { out: "upstream", src: "Oil and gas logo.jpg", kind: "emblem" },
  { out: "midstream", src: "Oil and gas logo midstreaming.jpg", kind: "emblem" },
  { out: "epc", src: "EPC.jpg", kind: "emblem" },
];

async function photo(src, outFile) {
  const img = sharp(src);
  const { width } = await img.metadata();
  return img
    .resize({ width: Math.min(width, MAX_W), withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outFile);
}

/** The source's own plate colour, as the median of a ring of border pixels.
    Median rather than a corner sample: one stray dark pixel on an edge would
    drag a mean far enough to matter at the gains below. */
async function plateColour(src) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const chans = [[], [], []];
  const push = (x, y) => {
    const i = (y * w + x) * 3;
    for (let c = 0; c < 3; c++) chans[c].push(data[i + c]);
  };
  const STEP = Math.max(1, Math.floor(Math.min(w, h) / 64));
  for (let x = 0; x < w; x += STEP) {
    push(x, 1);
    push(x, h - 2);
  }
  for (let y = 0; y < h; y += STEP) {
    push(1, y);
    push(w - 2, y);
  }
  return chans.map((v) => v.sort((a, b) => a - b)[Math.floor(v.length / 2)] || 255);
}

async function emblem(src, outFile) {
  /* Map the source's own plate to pure white before anything else. The five
     sources do not share a plate — three sit on a warm ~#F2F3ED cream and two
     on pure white — and without this step a single trim threshold either
     leaves the cream ones a visibly paler rectangle inside the panel or eats
     into the white ones' artwork. Normalising first means one threshold and
     one multiply work identically for all five. The gain is ~1.05 at most, so
     the artwork itself is only imperceptibly lifted. */
  const [pr, pg, pb] = await plateColour(src);
  const levelled = await sharp(src)
    .flatten({ background: "#ffffff" })
    .linear([255 / pr, 255 / pg, 255 / pb], [0, 0, 0])
    .toBuffer();

  let trimmed;
  try {
    trimmed = await sharp(levelled)
      .trim({ background: "#ffffff", threshold: 18 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    trimmed = await sharp(levelled).toBuffer({ resolveWithObject: true });
  }
  const { data, info } = trimmed;

  const box = EMBLEM * EMBLEM_FILL;
  const scale = Math.min(box / info.width, box / info.height);
  const w = Math.max(1, Math.round(info.width * scale));
  const h = Math.max(1, Math.round(info.height * scale));
  const art = await sharp(data).resize(w, h).toBuffer();

  return sharp({
    create: { width: EMBLEM, height: EMBLEM, channels: 3, background: PLATE },
  })
    .composite([
      {
        input: art,
        left: Math.round((EMBLEM - w) / 2),
        top: Math.round((EMBLEM - h) / 2),
        // Belt and braces: the source plate is already white by this point,
        // so this only guarantees any residual anti-aliased fringe stays white
        // rather than becoming a grey rim on the canvas.
        blend: "multiply",
      },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outFile);
}

await mkdir(OUT_DIR, { recursive: true });

for (const { out, src, kind } of SOURCES) {
  const inFile = path.join(SRC_DIR, src);
  const outFile = path.join(OUT_DIR, `${out}.jpg`);
  const { size, width, height } = await (kind === "photo" ? photo : emblem)(inFile, outFile);
  console.log(
    `${kind.padEnd(6)} ${out.padEnd(19)} ${String(width).padStart(4)}x${String(height).padEnd(4)} ` +
      `${(size / 1024).toFixed(0).padStart(4)} KB   <- ${src}`
  );
}
