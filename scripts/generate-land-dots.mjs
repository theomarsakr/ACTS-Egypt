/* Precomputes RotatingEarth's halftone-dot field at build time.
   Run from the repo root after touching public/geo/ne_110m_land.json:
     node scripts/generate-land-dots.mjs

   The globe used to run a point-in-polygon scan over the land outline in
   the browser, on first scroll into view — a fixed cost paid by every
   visitor for a result that's the same every time (the land outline and
   dot spacing are both fixed). This produces byte-identical dots by running
   the exact same algorithm here instead, so components/home/RotatingEarth.tsx
   only has to fetch and draw public/geo/land-dots.json. Keep this file's
   pointInRing/pointInFeature/generateDotsInFeature in sync with that
   component if either ever changes the dot-spacing algorithm. */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { geoBounds } from "d3-geo";

const PROJECT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(PROJECT, "public", "geo", "ne_110m_land.json");
const OUT = path.join(PROJECT, "public", "geo", "land-dots.json");

const pointInRing = (point, ring) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

const pointInFeature = (point, feature) => {
  const { geometry } = feature;
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const rings of polygons) {
    if (!pointInRing(point, rings[0])) continue;
    const inHole = rings.slice(1).some((ring) => pointInRing(point, ring));
    if (!inHole) return true;
  }
  return false;
};

const generateDotsInFeature = (feature, dotSpacing = 16) => {
  const dots = [];
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(feature);
  const step = dotSpacing * 0.08;
  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      const point = [lng, lat];
      if (pointInFeature(point, feature)) dots.push(point);
    }
  }
  return dots;
};

const collection = JSON.parse(await readFile(SRC, "utf8"));
const dots = [];
for (const feature of collection.features) {
  dots.push(...generateDotsInFeature(feature));
}

// Coordinates round-trip through JSON at full float precision already; six
// decimal places (~11cm at the equator) is far past what a halftone dot on
// a <600px canvas can show, and roughly halves the file size.
const rounded = dots.map(([lng, lat]) => [
  Math.round(lng * 1e6) / 1e6,
  Math.round(lat * 1e6) / 1e6,
]);

await writeFile(OUT, JSON.stringify(rounded));
console.log(`Wrote ${rounded.length} dots to ${path.relative(PROJECT, OUT)}`);
