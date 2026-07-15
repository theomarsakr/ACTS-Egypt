"use client";

import Link from "next/link";
import Image from "next/image";
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

const heroStats = [
  { value: 20, suffix: "+", label: "Years in business" },
  { value: 3, suffix: "", label: "Exclusive brand divisions" },
  { value: 10, suffix: "+", label: "Major operators served" },
  { value: 24, suffix: "h", label: "Typical quote turnaround" },
];

/* The three real product spec-cards (Farris red / Dyna-Flo blue / EST black)
   float as parallax layers — the catalog itself is the hero imagery. */
const specCards = [
  {
    src: "/images/farris/pilot-operated.jpg",
    alt: "Farris Engineering pilot-operated safety relief valve — ACTS product card",
    className: "left-0 top-10 w-56 lg:w-64 -rotate-6",
    depth: -36,
    duration: 7,
  },
  {
    src: "/images/dynaflo/df400-rotary-plug.jpg",
    alt: "Dyna-Flo DF400 rotary plug valve and actuator — ACTS product card",
    className: "left-1/2 -translate-x-1/2 -top-2 w-60 lg:w-72 rotate-2 z-10",
    depth: -70,
    duration: 8.5,
  },
  {
    src: "/images/est/griptight-max.jpg",
    alt: "EST Group GripTight MAX test plug — ACTS product card",
    className: "right-0 top-24 w-56 lg:w-64 rotate-6",
    depth: -24,
    duration: 7.8,
  },
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

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Whole stack drifts up slightly slower than the page (parallax)
  const stackY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);

  // Cursor tilt on the spec-card stack — the catalog reacts like an instrument panel
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 22, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [7, -7]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-7, 7]),
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
      {/* Blueprint grid + drifting gradient mesh */}
      <div className="absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0 blueprint"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
        <div className="mesh mesh-steel w-184 h-184 -top-56 -right-40" />
        <div className="mesh mesh-brass w-152 h-152 -bottom-64 -left-48" />
        <div className="dark-vignette" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-16 lg:pt-28">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 lg:gap-10 items-center">
          {/* Copy column */}
          <div className="max-w-2xl">
            <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
              <div className="inline-flex items-center gap-2.5 text-[12.5px] font-semibold text-amber uppercase tracking-[0.18em] glass-dark rounded-full px-4 py-2">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber opacity-60 animate-ping" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber" />
                </span>
                Sole Curtiss-Wright agent · Egypt
              </div>
            </motion.div>

            <motion.h1
              variants={rise}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-7 text-[2.7rem] leading-[1.04] md:text-6xl lg:text-[4.35rem] tracking-[-0.03em] text-balance"
            >
              <span className="font-medium text-white/80">
                Engineering trust into
              </span>{" "}
              <span className="font-extrabold text-shimmer">every process</span>
            </motion.h1>

            <motion.p
              variants={rise}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 text-lg md:text-xl text-white/75 leading-relaxed max-w-xl"
            >
              Since 2006, ACTS has been Egypt&apos;s trusted partner for valves,
              flow control, and critical process services — the sole agent for
              Farris Engineering, Dyna-Flo, and EST, all divisions of
              Curtiss-Wright.
            </motion.p>

            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Magnetic>
                <Link
                  href="/quote"
                  className="btn btn-primary group px-8 py-4 text-base"
                >
                  Request a quote
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
              <Link href="/brands" className="btn btn-ghost-dark px-8 py-4 text-base">
                Explore our brands
              </Link>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              {["Farris Engineering", "Dyna-Flo", "EST Group"].map((b) => (
                <span
                  key={b}
                  className="text-[12.5px] font-semibold text-white/60 glass-dark rounded-full px-3.5 py-1.5"
                >
                  {b}
                </span>
              ))}
              <span className="text-[12.5px] text-white/40">
                exclusive to ACTS in Egypt
              </span>
            </motion.div>
          </div>

          {/* Floating spec-card stack — tilts toward the cursor like an instrument panel */}
          <motion.div
            style={{ y: stackY, rotateX, rotateY, transformPerspective: 1000 }}
            onMouseMove={handleStackMouseMove}
            onMouseLeave={handleStackMouseLeave}
            className="relative h-[420px] lg:h-[520px] hidden md:block"
            aria-hidden
          >
            {specCards.map((c, i) => (
              <motion.div
                key={c.src}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.25 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`absolute ${c.className}`}
              >
                <motion.div
                  animate={
                    reduced
                      ? undefined
                      : { y: [0, c.depth / 4, 0] }
                  }
                  transition={{
                    duration: c.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/60 bg-white"
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={288}
                    height={384}
                    sizes="(max-width: 1024px) 240px, 288px"
                    className="w-full h-auto"
                    priority={i === 1}
                  />
                </motion.div>
              </motion.div>
            ))}
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
