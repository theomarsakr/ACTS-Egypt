"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useOnscreen, useReducedMotion } from "@/lib/hooks";

export type FieldProofItem = {
  slug: string;
  sector: string;
  title: string;
  text: string;
};

/* Engagement-highlight carousel. Deliberately NOT fake testimonials: these are
   the real (anonymized) engagement types ACTS supports, from lib/data.ts.
   `dark` renders it for a dark band: the card goes translucent (the band's
   blueprint grid shows through) and the controls switch to glass/amber. */
export default function FieldProof({
  items,
  dark = false,
  labels = {
    confidential: "Client details confidential ·",
    seeWho: "See who we work with",
  },
}: {
  items: FieldProofItem[];
  dark?: boolean;
  labels?: { confidential: string; seeWho: string };
}) {
  const [[index, dir], setIndex] = useState<[number, number]>([0, 1]);
  // Explicit, persistent pause (the actual WCAG 2.2.2 control — this
  // autoplays every 5.2s, past the 5s threshold that requires one).
  // `null` = the reader has not chosen yet, so follow their OS preference:
  // reduced motion arrives paused, everyone else arrives playing. Derived
  // rather than written from an effect so there is no cascading render, and
  // safe to derive because the hook below reports false through hydration.
  const [pauseOverride, setPauseOverride] = useState<boolean | null>(null);
  // NOT motion/react's useReducedMotion — that one reports false on the server
  // and the reader's real setting on the client's first render, and this
  // component used to gate the pause BUTTON on it (`{!reduced && ...}`), which
  // put a different control in the SSR markup than in the hydration render and
  // regenerated this whole subtree (React #418). The local hook is
  // useSyncExternalStore-based with a server snapshot, so both passes agree.
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Transient courtesy pause — pointer over, keyboard focus inside, or
  // mid-drag — checked inside the tick rather than tearing the interval
  // down, so it doesn't reset the 5.2s phase on every hover in and out.
  const paused = useRef(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const { onscreen } = useOnscreen(hostRef);

  const autoplayPaused = pauseOverride ?? reduced;

  const go = useCallback(
    (delta: number) =>
      setIndex(([i]) => [(i + delta + items.length) % items.length, delta]),
    [items.length]
  );

  useEffect(() => {
    if (autoplayPaused || !onscreen) return;
    timer.current = setInterval(() => {
      if (!paused.current) go(1);
    }, 5200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go, autoplayPaused, onscreen]);

  const item = items[index];

  return (
    <div
      ref={hostRef}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") paused.current = false;
      }}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      className="relative"
    >
      <div
        className={`relative overflow-hidden rounded-3xl text-white min-h-[21rem] md:min-h-[17rem] ${
          dark ? "bg-white/3 ring-1 ring-white/10" : "bg-ink"
        }`}
      >
        {!dark && (
          <>
            <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
            {/* hostRef above already tracks onscreen for this whole card, so
                the blob just needs the pause class — no separate observer. */}
            <div
              className="mesh motion-ambient mesh-steel w-96 h-96 -top-40 -right-24 opacity-70"
              aria-hidden
            />
          </>
        )}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={item.slug}
            custom={dir}
            // `initial` and `drag` are both written into the server-rendered
            // markup (`drag` contributes touch-action, user-select and
            // draggable), so neither may branch on `reduced` — the server
            // cannot know the reader's OS setting, and disagreeing with the
            // client's first render is a hydration mismatch. The reduced
            // contract is met on `transition`: same frames, crossed instantly.
            // Drag stays available either way; it is direct manipulation the
            // reader asks for by hand, not motion inflicted on them.
            initial={{ opacity: 0, x: 48 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -48 * dir }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            }
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={() => (paused.current = true)}
            onDragEnd={(_, info) => {
              paused.current = false;
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="relative p-6 sm:p-8 md:p-12 cursor-grab active:cursor-grabbing"
          >
            <figcaption className="font-display text-2xl xs:text-3xl md:text-5xl font-extrabold uppercase leading-[1.05] text-amber">
              {item.sector}
            </figcaption>
            <blockquote className="mt-3 max-w-3xl">
              <div className="text-lg md:text-xl font-bold tracking-tight leading-snug text-white/90">
                {item.title}
              </div>
              <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-2xl">
                {item.text}
              </p>
            </blockquote>
            <div className="mt-5 flex items-center gap-3 text-xs text-white/40">
              {labels.confidential}{" "}
              <Link
                href="/projects"
                className="tap-target inline-flex items-center gap-1 font-semibold text-white/70 hover:text-amber transition-colors"
              >
                {labels.seeWho} <ArrowRight size={12} className="rtl:rotate-180" />
              </Link>
            </div>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between">
        {/* The dots are 10×6px of paint. `tap-target` gives each one a 44px-tall
            invisible hit area on touch, and the wider coarse-pointer gap pushes
            their centres 26px apart so those areas stay distinguishable — a
            10px dot on an 18px pitch fails even WCAG 2.5.8's 24px spacing
            exception. Painted size is unchanged at every width. */}
        <div className="flex items-center gap-2 pointer-coarse:gap-4">
          {items.map((it, i) => (
            <button
              key={it.slug}
              aria-label={`Show: ${it.title}`}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className={`tap-target h-1.5 rounded-full transition-all duration-400 ${
                i === index
                  ? `w-7 ${dark ? "bg-amber" : "bg-brand"}`
                  : `w-2.5 ${
                      dark
                        ? "bg-white/25 hover:bg-white/40"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {/* The actual WCAG 2.2.2 pause mechanism — persists regardless of
              hover/focus, unlike the transient `paused` ref above, and
              works identically for a mouse or a touch visitor. */}
          <button
            onClick={() => setPauseOverride(!autoplayPaused)}
            aria-pressed={autoplayPaused}
            aria-label={autoplayPaused ? "Resume autoplay" : "Pause autoplay"}
            className={`w-10 h-10 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5 ${
              dark
                ? "glass-dark border border-white/15 text-white/80 hover:border-amber/50 hover:text-amber"
                : "border border-gray-200 bg-white text-navy shadow-sm hover:border-brand/50 hover:text-brand"
            }`}
          >
            {autoplayPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          {[
            { delta: -1, label: "Previous", Icon: ChevronLeft },
            { delta: 1, label: "Next", Icon: ChevronRight },
          ].map(({ delta, label, Icon }) => (
            <button
              key={label}
              onClick={() => go(delta)}
              aria-label={label}
              className={`w-10 h-10 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5 ${
                dark
                  ? "glass-dark border border-white/15 text-white/80 hover:border-amber/50 hover:text-amber"
                  : "border border-gray-200 bg-white text-navy shadow-sm hover:border-brand/50 hover:text-brand"
              }`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
