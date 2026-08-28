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

          `pt-14` below `sm` is the one part that is not hand-tuned desktop
          rhythm: 96px above AND below on a 664px-tall phone screen is 192px
          — nearly a third of the viewport — of empty navy before the reader
          reaches a single word, on every page but the homepage. 56px reads
          as the same deliberate band at phone scale. `sm:pt-24` restores the
          original at 640px, so 640px and up is byte-identical to before.

          `pb-30` is the other half of PageHeroBackground's phone placement:
          below `lg` the ACTS lockup moves out from beside the copy — where it
          printed straight through the lede — and into a lane under it. 120px
          holds the 208px-wide mark (67px tall) at its `bottom-8` offset with
          a 21px gap above it, and it is stated as a pair with that offset
          rather than derived, because the band's height is content-driven and
          differs per page.

          It runs to `lg`, not to `sm`, because that is where the mark moves
          back beside the copy: the old `sm:py-24` left a 96px lane against a
          99px mark and clipped the lede by 3px at 640-767px. `lg:pb-28` is
          the 112px `md:py-28` used to resolve to from 1024px up, so every
          width the desktop treatment covers is unchanged.

          Written as explicit pt/pb rather than `py-*`: a longhand base under
          a shorthand variant relies on utility sort order to resolve, which
          is exactly the ambiguity the phone-spacing pass set out to remove. */}
      <Container
        className={cn(
          "relative pt-14 pb-30 sm:pt-24 md:pt-28 lg:pb-28",
          className
        )}
      >
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
