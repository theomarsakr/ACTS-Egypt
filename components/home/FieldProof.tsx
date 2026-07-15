"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type FieldProofItem = {
  slug: string;
  sector: string;
  title: string;
  text: string;
};

/* Engagement-highlight carousel. Deliberately NOT fake testimonials: these are
   the real (anonymized) engagement types ACTS supports, from lib/data.ts. */
export default function FieldProof({ items }: { items: FieldProofItem[] }) {
  const [[index, dir], setIndex] = useState<[number, number]>([0, 1]);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hovering = useRef(false);

  const go = useCallback(
    (delta: number) =>
      setIndex(([i]) => [(i + delta + items.length) % items.length, delta]),
    [items.length]
  );

  useEffect(() => {
    if (reduced) return;
    timer.current = setInterval(() => {
      if (!hovering.current) go(1);
    }, 5200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go, reduced]);

  const item = items[index];

  return (
    <div
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-ink text-white min-h-[21rem] md:min-h-[17rem]">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <div
          className="mesh mesh-steel w-96 h-96 -top-40 -right-24 opacity-70"
          aria-hidden
        />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={item.slug}
            custom={dir}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 48 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -48 * dir }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="relative p-8 md:p-12 cursor-grab active:cursor-grabbing"
          >
            <figcaption className="eyebrow text-amber">{item.sector}</figcaption>
            <blockquote className="mt-4 max-w-3xl">
              <div className="text-2xl md:text-[1.9rem] font-extrabold tracking-tight leading-snug">
                {item.title}
              </div>
              <p className="mt-3.5 text-[16.5px] text-white/70 leading-relaxed max-w-2xl">
                {item.text}
              </p>
            </blockquote>
            <div className="mt-6 flex items-center gap-3 text-[13.5px] text-white/45">
              <span className="w-8 h-px bg-white/20" />
              Client details confidential ·{" "}
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 font-semibold text-white/75 hover:text-amber transition-colors"
              >
                See who we work with <ArrowRight size={14} />
              </Link>
            </div>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.slug}
              aria-label={`Show: ${it.title}`}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === index
                  ? "w-7 bg-brand"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white text-navy flex items-center justify-center transition-all hover:border-brand/50 hover:text-brand hover:-translate-y-0.5 shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white text-navy flex items-center justify-center transition-all hover:border-brand/50 hover:text-brand hover:-translate-y-0.5 shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
