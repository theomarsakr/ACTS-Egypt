import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { SectorArtwork, SectorImageSize } from "@/lib/data";

/* ------------------------------------------------------------------ *
 * SectorPanel
 *
 * The illustrated 2/5-width column that opens every sector tab — the industry
 * tabs on /industries and the client-portfolio tabs on /projects. Both pages
 * rendered this markup independently and identically; it lives here so the two
 * tab strips cannot drift apart.
 *
 * It renders two kinds of artwork, because ACTS' sector art is two kinds of
 * picture (see scripts/normalize-sector-images.mjs, which produces both):
 *
 *   emblem — a square line-art/3D icon, held object-contain on the brand-light
 *            cream its canvas is already baked against.
 *   photo  — a wide establishing shot of a plant, mounted (not full-bleed) on
 *            a mat made from a blurred copy of itself.
 *
 * Why a photo is mounted rather than full-bleed, which is what it used to be:
 * this column is a grid cell whose height is set by the text column beside it,
 * so it is always far taller than it is wide — measured 434x714 (0.61) on
 * /industries at 1440px, and 388x797 (0.49) at 1024px. object-cover in a
 * window that shape scales a 16:9 photograph to *cover the height*, which left
 * only 27-46% of the source width on screen: Oil & Gas showed a vertical slice
 * through the middle of the pumpjack with the refinery panorama cropped away
 * entirely, and Water Treatment lost the sea the plant sits on. The four photo
 * sectors are all landscape establishing shots whose whole subject is the
 * width, so there is no object-position that rescues them — a landscape photo
 * needs a landscape window.
 *
 * So the photo is given one: it keeps its own proportions at the full width of
 * the column, and the leftover height (which varies per tab, since it is the
 * text column that sets it) is filled by a scaled, blurred, darkened copy of
 * the same photo. That fills the column at any height without cropping the
 * picture and without a dead void, so it needs no per-sector tuning and does
 * not care how tall the neighbouring content grows.
 * ------------------------------------------------------------------ */

export default function SectorPanel({
  src,
  alt,
  artwork = "photo",
  imageSize,
  icon: Icon,
}: {
  src: string;
  alt: string;
  artwork?: SectorArtwork;
  imageSize?: SectorImageSize;
  icon: LucideIcon;
}) {
  const emblem = artwork === "emblem";
  return (
    <div
      className={`relative min-h-56 lg:col-span-2 isolate flex items-center justify-center overflow-hidden ${
        emblem
          ? // A shaded cream plate, so a column this tall does not read as a
            // flat slab. The emblem's own canvas is baked white and multiplied
            // over it (see the <Image> below), which is what lets the plate be
            // shaded at all — the canvas takes the plate's colour wherever it
            // lands instead of showing as a square of its own.
            // `isolate` confines that blend to this panel rather than letting
            // it reach whatever the card is sitting on.
            "bg-brand-light bg-[radial-gradient(circle_at_50%_38%,#fdfaf1,var(--color-brand-light)_58%,#ece2ca)] p-8 sm:p-10"
          : "bg-navy p-5 sm:p-6"
      }`}
    >
      {emblem ? (
        <Image
          src={src}
          alt={alt}
          width={900}
          height={900}
          /* The emblem is square and height-capped (max-h-72, lg:max-h-80), so
             it is never painted wider than 320 CSS px however wide the column
             gets. Expressing that as `30vw` had a 1440px desktop fetching 640w
             for a 320px paint, and 1080w at 2x. */
          sizes="(min-width: 1024px) 320px, 288px"
          className="h-auto max-h-72 w-auto max-w-full object-contain mix-blend-multiply lg:max-h-80"
        />
      ) : (
        <>
          {/* The mat. Same file as the photo above it, so it costs no extra
              request, and blurred past the point where its content reads —
              it is a colour field derived from the picture, not a second
              copy of it. Its `sizes` must stay character-identical to the
              photo's below, or the two resolve to different srcset widths and
              the free second copy becomes a paid one. scale-125 keeps the blur's soft edge outside the
              panel; brightness holds it well under the mounted photo so the
              photo stays the brightest thing here. Decorative, hence alt=""
              — the real photo below carries the description. */}
          <Image
            src={src}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1024px) 100vw, 512px"
            className="scale-125 object-cover blur-2xl brightness-[0.55] saturate-150"
          />
          <div className="absolute inset-0 bg-navy/40" />
          {/* The picture itself, at its own proportions and nothing cropped —
              `imageSize` is the file's real pixel size, so the box reserved
              before it decodes is the box it ends up occupying. Falling back
              to 16:10 keeps a sector that forgets the field from reserving a
              wildly wrong box; it is a floor, not the intended path.

              512px, not 40vw: the panel is 2 of 5 columns inside a max-w-7xl
              container, so it tops out near 512 CSS px. At 40vw a 1440px
              desktop asked for 1920w at 2x — upscaling a 1600px source. */}
          <div className="img-zoom relative w-full overflow-hidden rounded-xl shadow-xl shadow-navy/40 ring-1 ring-white/15">
            <Image
              src={src}
              alt={alt}
              width={imageSize?.width ?? 1600}
              height={imageSize?.height ?? 1000}
              sizes="(max-width: 1024px) 100vw, 512px"
              className="h-auto w-full"
            />
          </div>
        </>
      )}
      <div className="absolute top-4 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-brand shadow-lg">
        <Icon size={20} className="text-white" strokeWidth={2.25} />
      </div>
    </div>
  );
}
