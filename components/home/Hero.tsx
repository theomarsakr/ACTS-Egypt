"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import Counter from "@/components/Counter";
import Magnetic from "@/components/ui/Magnetic";
import ShimmerButton from "@/components/ui/ShimmerButton";
import HeroInteractiveBackground from "@/components/HeroInteractiveBackground";
import HeroProductCards from "@/components/home/HeroProductCards";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import type { Dict } from "@/lib/i18n/en";

const heroBrands = [
  { name: "Farris Engineering", slug: "farris-engineering" },
  { name: "Dyna-Flo", slug: "dyna-flo" },
  { name: "EST Group", slug: "est" },
];

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.08 * i,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Hero({
  t,
  lang = "en",
}: {
  t: Dict["home"]["hero"];
  lang?: Locale;
}) {
  const heroStats = t.stats;
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Whole stack drifts up slightly slower than the page (parallax)
  const stackY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 56]);

  // Cursor tilt on the spec-card stack — the catalog reacts like an instrument panel
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 24, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [4.5, -4.5]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-4.5, 4.5]),
    springConfig
  );

  function handleStackMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleStackMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink text-white"
    >
      {/* Interactive dot-mesh field: navy base, blueprint grid, amber glow, and
          a live particle canvas that lights up amber toward the cursor. */}
      <HeroInteractiveBackground />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-16 lg:pt-28">
        {/* Badge sits in normal flow above the heading at every breakpoint —
            its own bottom margin is what keeps a clean gap above the H1. */}
        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-7"
        >
          <div className="inline-flex w-fit max-w-full items-center gap-2.5 text-[12.5px] font-semibold text-white uppercase tracking-[0.18em] glass-dark rounded-full px-4 py-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-white" />
            </span>
            {t.badge}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 lg:gap-10 items-center">
          {/* Copy column */}
          <div className="max-w-2xl">
            <motion.h1
              variants={rise}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-[2.7rem] leading-[1.04] md:text-6xl lg:text-[4.35rem] tracking-[-0.03em] text-balance"
            >
              <span className="font-medium text-white/80">{t.titleA}</span>{" "}
              <span className="font-extrabold text-shimmer">{t.titleB}</span>
            </motion.h1>

            <motion.p
              variants={rise}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 text-lg md:text-xl text-white/75 leading-relaxed max-w-xl"
            >
              {t.lede}
            </motion.p>

            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Magnetic>
                <ShimmerButton
                  href={localeHref(lang, "/quote")}
                  className="group px-8 py-4 text-base shadow-lg shadow-brand/25"
                >
                  {t.ctaQuote}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  />
                </ShimmerButton>
              </Magnetic>
              <Link href="/brands" className="btn btn-ghost-dark px-8 py-4 text-base">
                {t.ctaBrands}
              </Link>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
              style={{ "--chip-count": heroBrands.length } as React.CSSProperties}
            >
              {heroBrands.map((b, i) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  style={{ "--i": i } as React.CSSProperties}
                  className="hero-brand-chip text-[12.5px] font-semibold text-white/60 glass-dark rounded-full px-3.5 py-1.5 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/70"
                >
                  {b.name}
                </Link>
              ))}
              <span className="text-[12.5px] text-white/40">
                {t.exclusiveNote}
              </span>
            </motion.div>
          </div>

          {/* Floating spec-card stack — tilts toward the cursor like an
              instrument panel. Cards orbit through front/middle/back, preview
              the brand's range on hover, and link to each brand's page (see
              HeroProductCards) — interactive, so not aria-hidden.
              Heights clear the lowest card (EST, top-24) plus its foot rail
              and orbit swing at every width; the sm/md steps exist because
              that card is the only one that would otherwise run past the
              stage into the stat strip below. */}
          <motion.div
            style={{ y: stackY, rotateX, rotateY, transformPerspective: 1000 }}
            onMouseMove={handleStackMouseMove}
            onMouseLeave={handleStackMouseLeave}
            className="relative h-[376px] sm:h-[420px] md:h-[464px] lg:h-[520px]"
          >
            <HeroProductCards />
          </motion.div>
        </div>
      </div>

      {/* Gauge-readout stat strip */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 max-md:[&>*:nth-child(2n+1)]:border-l-0 max-md:[&>*:nth-child(n+3)]:border-t max-md:[&>*]:border-white/10">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
              className="py-7 md:py-8 px-4 md:px-8"
            >
              <div className="text-3xl md:text-[2.6rem] leading-none font-extrabold tracking-tight tabular-nums">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[13px] text-white/50">{s.label}</div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.75 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 h-px w-8 origin-left bg-amber/50"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
