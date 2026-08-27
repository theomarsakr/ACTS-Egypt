import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import PageHeroBackground from "@/components/PageHeroBackground";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/SectionHeading";

/* The one page-hero pattern, shared by every top-level section page.
   Before this, each page hand-rolled its own: two different heading scales,
   two different heading components, an amber kicker on one page only, and a
   six-line body paragraph standing in for a lede. The structure is fixed at
   eyebrow -> title -> subtitle -> lede and rendered by <SectionHeading>, so
   the hero steps down on exactly the scale every section below it uses.
   The lede stays a short column (max-w-xl) because a hero lede that wraps six
   times stops being a lede.

   The contact and quote heroes stand on a photograph rather than on
   PageHeroBackground's lockup, so they keep their own <section> — but they
   render their copy through the same <SectionHeading> tier. Being off this
   pattern is how both ended up rendering the hierarchy backwards: a 60px
   amber category label above a 30px <h1>. */
export default function PageHero({
  id,
  eyebrow,
  title,
  subtitle,
  lede,
  className,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden bg-navy", id && "scroll-anchor")}
    >
      <PageHeroBackground />
      {/* This hero band's own hand-tuned rhythm, not the generic section
          spacing scale (Section's `space` prop), so migrating onto Container
          only replaced the max-w/gutter chain.

          `py-14` below `sm` is the one part that is not hand-tuned desktop
          rhythm: 96px above AND below on a 664px-tall phone screen is 192px
          — nearly a third of the viewport — of empty navy before the reader
          reaches a single word, on every page but the homepage. 56px reads
          as the same deliberate band at phone scale. `sm:py-24` restores the
          original at 640px, so 640px and up is byte-identical to before. */}
      <Container className={cn("relative py-14 sm:py-24 md:py-28", className)}>
        <Reveal>
          <SectionHeading
            as="h1"
            tier="page"
            tone="dark"
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            className="max-w-3xl"
          />
        </Reveal>
        {lede && (
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-fluid-lede text-white/65">{lede}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
