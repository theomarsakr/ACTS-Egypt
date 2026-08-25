import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import PageHeroBackground from "@/components/PageHeroBackground";

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
      className={cn("relative overflow-hidden bg-navy", id && "scroll-mt-28")}
    >
      <PageHeroBackground />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-28">
        <Reveal>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.03] text-white text-balance">
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
            <p className="mt-6 max-w-xl text-[17px] md:text-lg leading-relaxed text-white/60">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
