import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import PageHeroBackground from "@/components/PageHeroBackground";
import Container from "@/components/layout/Container";

/* The one page-hero pattern, shared by every top-level section page.
   Before this, each page hand-rolled its own: two different heading scales,
   two different heading components, an amber kicker on one page only, and a
   six-line body paragraph standing in for a lede. The structure here is fixed
   at title -> subtitle -> lede so the pages read as one system; the lede stays
   a short column (max-w-xl) because a hero lede that wraps six times stops
   being a lede. */
export default function PageHero({
  id,
  title,
  subtitle,
  lede,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  lede?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden bg-navy", id && "scroll-anchor")}
    >
      <PageHeroBackground />
      {/* py-24 md:py-28 kept as-is — this hero band's own hand-tuned rhythm,
          not the generic section spacing scale (Section's `space` prop),
          so migrating onto Container only replaces the max-w/gutter chain. */}
      <Container className="relative py-24 md:py-28">
        <Reveal>
          {/* text-fluid-h1 (36->60) matches this heading's old three-step
              chain (text-4xl md:text-5xl lg:text-6xl) at both endpoints,
              scaling continuously between instead of jumping twice. */}
          <h1 className="text-fluid-h1 font-extrabold tracking-[-0.03em] text-white text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="font-display mt-4 max-w-2xl text-xl md:text-2xl font-semibold leading-snug text-white/70 text-balance">
              {subtitle}
            </p>
          )}
        </Reveal>
        {lede && (
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-fluid-lede leading-relaxed text-white/60">
              {lede}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
