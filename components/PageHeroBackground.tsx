import Image from "next/image";
import Container from "@/components/layout/Container";

/* Shared dark-hero backdrop: blueprint grid + brass glow + the full ACTS logo,
   tagline and brand colours included, aligned to the content column so it reads
   as a brand watermark rather than a stock photo. Saturation is boosted in the
   asset itself (x2.2) because at watermark opacity the brand blue/yellow/green/
   red otherwise collapse into indistinguishable greys against the navy. Used on
   every page hero on bg-navy (brands, industries, products, projects) and on the
   closing CTA band that bookends the Projects page.

   `priority` is on by default because every page hero is the LCP element; the
   closing CTA passes false, since preloading a below-the-fold watermark only
   competes with the hero's own. */
export default function PageHeroBackground({
  priority = true,
}: {
  priority?: boolean;
}) {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0 blueprint opacity-50" />
      <div className="mesh mesh-brass w-152 h-152 top-1/2 -translate-y-1/2 -right-24 opacity-60" />
      <Container className="absolute inset-0">
        <Image
          src="/images/acts-logo-watermark.png"
          alt=""
          width={1310}
          height={422}
          priority={priority}
          className="pointer-events-none select-none absolute end-gutter top-1/2 -translate-y-1/2 w-[min(45%,22rem)] opacity-20"
        />
      </Container>
      <div className="dark-vignette" />
    </div>
  );
}
