import Image from "next/image";
import Container from "@/components/layout/Container";
import MeshBlob from "@/components/ui/MeshBlob";

/* Shared dark-hero backdrop: blueprint grid + brass glow + the full ACTS logo,
   tagline and brand colours included, aligned to the content column so it reads
   as a brand watermark rather than a stock photo. Saturation is boosted in the
   asset itself (x2.2) because at watermark opacity the brand blue/yellow/green/
   red otherwise collapse into indistinguishable greys against the navy. Used on
   every page hero on bg-navy (brands, industries, products, projects) and on the
   closing CTA band that bookends the Projects page.

   `eager` is on by default because the hero instance is above the fold on
   arrival; the closing CTA passes false so its copy of the watermark waits for
   the viewport. It is deliberately *not* preloaded (`priority`, deprecated in
   Next 16): this is a 20%-opacity decoration, and putting it in the preload
   queue only takes bandwidth priority away from the hero's real content. */
export default function PageHeroBackground({
  eager = true,
}: {
  eager?: boolean;
}) {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0 blueprint opacity-50" />
      <MeshBlob variant="brass" className="w-152 h-152 top-1/2 -translate-y-1/2 -right-24 opacity-60" />
      <Container className="absolute inset-0">
        <Image
          src="/images/acts-logo-watermark.png"
          alt=""
          width={1310}
          height={422}
          loading={eager ? "eager" : "lazy"}
          /* It paints at `min(45%, 22rem)` of the content column, i.e. never
             wider than 352px. Without this the optimizer is asked for the
             lockup's intrinsic 1310px — rounded up to a 1920w (and 3840w at
             2x) transformation — on every dark-hero page. */
          sizes="(max-width: 48rem) 45vw, 352px"
          /* `hidden lg:block` is a legibility fix, and the breakpoint is
             measured rather than chosen. The lockup is pinned to the vertical
             centre of the band at min(45%, 352px) of the content column, which
             clears the copy only while there is empty gutter beside it. The
             lede is `max-w-xl` (576px), so the lockup's leading edge —
             W - min(0.45W, 352) for a content width W — only passes 576px once
             the viewport is ~990px. Below that it sits ON the words, and the
             collision is not marginal: measuring the lede's real glyph rects
             on /industries, the lockup covers two of its lines by 236px and
             188px at 640px, and by 177px and 129px at 768px. At 1024px the
             overlap is exactly zero, which is where this now switches on.

             Repositioning it instead is not available: the band's height is
             content-driven and differs per page, so there is no fixed offset
             that clears the copy everywhere. A decorative, aria-hidden
             watermark does not get to cost the hero's only paragraph its
             contrast — and the real logo is in the header on every page.
             `lg:` and up is pixel-identical to before. */
          className="pointer-events-none select-none absolute end-gutter top-1/2 -translate-y-1/2 w-[min(45%,22rem)] opacity-20 hidden lg:block"
        />
      </Container>
      <div className="dark-vignette" />
    </div>
  );
}
