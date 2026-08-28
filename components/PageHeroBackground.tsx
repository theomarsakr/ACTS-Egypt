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
          /* It paints at `min(45%, 22rem)` of the content column from `lg`,
             and `min(58%, 13rem)` below it — never wider than 352px, and
             never wider than 208px on a phone. Without this the optimizer is
             asked for the lockup's intrinsic 1310px — rounded up to a 1920w
             (and 3840w at 2x) transformation — on every dark-hero page. Both
             arms are stated in px rather than vw for the same reason: 58vw
             would ask for a 593px slot at 1023px wide to paint 208px. */
          sizes="(max-width: 63.9375rem) 208px, 352px"
          /* Two placements, because a band centred on the copy only has a
             free gutter beside it at desktop widths. From `lg` the lockup is
             pinned to the vertical centre at min(45%, 352px) of the content
             column, which is where it has always sat and is pixel-identical
             here.

             Below `lg` that same position lands ON the words. The lede is
             `max-w-xl` (576px) and the lockup's leading edge is
             W - min(0.45W, 352) for a content width W, so it only passes
             576px once the viewport is ~990px; measuring the lede's real
             glyph rects on /industries, it covered two of its lines by 236px
             and 188px at 640px and by 177px and 129px at 768px. It was hidden
             there, which fixed the legibility and left every phone hero with
             no brand mark at all.

             So on a phone it moves under the copy instead of beside it, at
             58% of the column — 208px against desktop's 352px, i.e. close to
             the same physical size, not a shrunken token — in the band's own
             bottom lane. Both call sites reserve that lane (see PageHero and
             the Projects closing CTA): a content-driven band cannot be
             cleared by a fixed offset, so the offset and the padding that
             answers it are stated together. The one thing that must not
             happen is the mark going back over the paragraph. */
          className="pointer-events-none select-none absolute end-gutter bottom-8 w-[min(58%,13rem)] opacity-20 lg:bottom-auto lg:top-1/2 lg:w-[min(45%,22rem)] lg:-translate-y-1/2"
        />
      </Container>
      <div className="dark-vignette" />
    </div>
  );
}
