// Cinematic brand-film assets. The looping clip plays behind the brand detail
// hero, with the poster as its first paint and reduced-motion fallback. Brands
// not listed here keep the still photo hero (Brand.image).

export type BrandMedia = {
  /** Muted, looping hero clip (H.264, +faststart for progressive streaming). */
  src: string;
  /** Poster still — first paint for the hero and the reduced-motion fallback. */
  poster: string;
  /**
   * Optional Tailwind classes that dim the whole media layer (poster + clip)
   * over the section's navy base — same trick as the still-photo hero's
   * opacity-45. Calibrated per film: clips with bright slides or embedded
   * title text need more navy wash to keep the overlaid copy legible.
   */
  dim?: string;
};

/**
 * Stable in-page anchor id for a gallery item, derived from its image path
 * (unique within a brand's gallery). Lets the product-line strip deep-link to the
 * exact card in the gallery below. Used both to id the gallery card and to build
 * the strip's links, so the two always agree.
 */
export function galleryAnchorId(src: string): string {
  const file = src.split("/").pop() ?? src;
  return `gallery-${file.replace(/\.[a-z0-9]+$/i, "")}`;
}

export const brandHeroVideo: Record<string, BrandMedia> = {
  "farris-engineering": {
    src: "/videos/farris-hero.mp4",
    poster: "/videos/farris-hero-poster.jpg",
    // Film trimmed to its clean slides (title-card intro/outro cut with
    // ffmpeg); only small lower-third captions remain, which the hero's bottom
    // scrim swallows — so just a light wash for copy contrast.
    dim: "opacity-75",
  },
  "dyna-flo": {
    src: "/videos/dyna-flo-hero.mp4",
    poster: "/videos/dyna-flo-hero-poster.jpg",
    // Dark macro footage — reads perfectly behind the scrims at full strength.
  },
  est: {
    src: "/videos/est-hero.mp4",
    poster: "/videos/est-hero-poster.jpg",
    // Opens on a near-white product slide that blows out the hero copy —
    // needs the strongest navy wash of the three films.
    dim: "opacity-50",
  },
};
