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
          className="pointer-events-none select-none absolute end-gutter top-1/2 -translate-y-1/2 w-[min(45%,22rem)] opacity-20"
        />
      </Container>
      <div className="dark-vignette" />
    </div>
  );
}
