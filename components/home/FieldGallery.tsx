"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Reveal from "@/components/Reveal";

export type FieldGalleryItem = {
  src: string;
  label: string;
  sub: string;
  href: string;
  aspect: string;
  /** Filter-chip category, e.g. "Field sites" */
  group: string;
};

export type FieldGalleryLabels = {
  allPhotos: string;
  learnMore: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  /** Templates with {n}, {total}, {title} placeholders. */
  openLabel: string;
  thumbLabel: string;
  dialogLabel: string;
};

const defaultLabels: FieldGalleryLabels = {
  allPhotos: "All photos",
  learnMore: "Learn more",
  closeLabel: "Close gallery",
  prevLabel: "Previous photo",
  nextLabel: "Next photo",
  openLabel: "Open photo {n} of {total}: {title}",
  thumbLabel: "Photo {n}: {title}",
  dialogLabel: "Field photo gallery",
};

function tfill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in values ? String(values[k]) : `{${k}}`
  );
}

/* "Where our equipment works" masonry, upgraded into a gallery. The grid keeps
   its exact look; each tile now opens a full-screen lightbox with prev/next
   arrows, keyboard navigation (arrows / Escape), swipe on touch, a counter, a
   caption, and a thumbnail strip. Each slide keeps a "Learn more" link to the
   page the tile used to navigate to, so the original destinations stay one
   tap away. Respects prefers-reduced-motion (fades instead of slides). */
export default function FieldGallery({
  items,
  labels = defaultLabels,
}: {
  items: FieldGalleryItem[];
  labels?: FieldGalleryLabels;
}) {
  const reduced = useReducedMotion();
  // [index, direction] into the *visible* (filtered) list; -1 → closed.
  const [[active, dir], setActive] = useState<[number, number]>([-1, 0]);
  // null → all photos; otherwise a group name from the items.
  const [filter, setFilter] = useState<string | null>(null);
  const open = active >= 0;
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const groups = [...new Set(items.map((i) => i.group))];
  const visible = filter ? items.filter((i) => i.group === filter) : items;

  const close = useCallback(() => setActive([-1, 0]), []);
  const go = useCallback(
    (delta: number) =>
      setActive(([i]) => [(i + delta + visible.length) % visible.length, delta]),
    [visible.length]
  );

  // Keyboard: arrows navigate, Escape closes, Tab cycles inside the dialog.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const nodes =
          dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  // Scroll lock + focus hand-off while the lightbox is up.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => {
      document.body.style.overflow = prev;
      lastFocused.current?.focus();
    };
  }, [open]);

  // Live direction for enter/exit so mid-browse direction flips stay correct.
  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : 56 * d }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : -56 * d }),
  };

  const item = open ? visible[active] : null;

  return (
    <>
      {/* Category filter chips — All + one per group, with photo counts. */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {[null, ...groups].map((g) => {
          const count = g ? items.filter((i) => i.group === g).length : items.length;
          const selected = filter === g;
          return (
            <button
              key={g ?? "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setFilter(g);
                setActive([-1, 0]);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                selected
                  ? "border-navy bg-navy text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-brand/40 hover:bg-brand-light hover:text-brand"
              }`}
            >
              {g ?? labels.allPhotos}
              <span className={selected ? "text-white/50" : "text-gray-400"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry — visually identical to the original, but tiles open the
          lightbox instead of navigating away. Keyed by filter so the reveal
          stagger replays when the set changes. */}
      <div
        key={filter ?? "all"}
        className="mt-7 columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5"
      >
        {visible.map((a, i) => (
          <Reveal key={a.src} delay={(i % 3) * 90} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setActive([i, 0])}
              aria-label={tfill(labels.openLabel, {
                n: i + 1,
                total: visible.length,
                title: `${a.label} — ${a.sub}`,
              })}
              className={`group relative block w-full overflow-hidden rounded-2xl text-left cursor-zoom-in ${a.aspect}`}
            >
              <Image
                src={a.src}
                alt={`${a.label}: ${a.sub}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-amber uppercase tracking-[0.18em]">
                    {a.label}
                  </div>
                  <div className="mt-1 text-[15.5px] font-bold text-white leading-snug">
                    {a.sub}
                  </div>
                </div>
                <span className="w-9 h-9 rounded-full glass-dark flex items-center justify-center text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <Expand size={15} />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox — portaled to <body> so no ancestor transform can trap it. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {item && (
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={labels.dialogLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
                className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
              >
                {/* Top bar: counter + close */}
                <div className="flex items-center justify-between px-5 py-4 md:px-8">
                  <div className="text-[13px] font-semibold text-white/60 tabular-nums">
                    {active + 1} <span className="text-white/30">/ {visible.length}</span>
                  </div>
                  <button
                    data-close
                    type="button"
                    onClick={close}
                    aria-label={labels.closeLabel}
                    className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Stage */}
                <div
                  className="relative flex-1 min-h-0"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                  }}
                >
                  <AnimatePresence custom={dir}>
                    <motion.div
                      key={active}
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      drag={reduced ? false : "x"}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60) go(1);
                        else if (info.offset.x > 60) go(-1);
                      }}
                      className="absolute inset-y-0 inset-x-2 md:inset-x-16 cursor-grab active:cursor-grabbing"
                    >
                      <Image
                        src={item.src}
                        alt={`${item.label}: ${item.sub}`}
                        fill
                        sizes="100vw"
                        draggable={false}
                        className="object-contain select-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={labels.prevLabel}
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-dark flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={labels.nextLabel}
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-dark flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Caption + link out to the related page */}
                <div className="px-5 md:px-8 pt-4 pb-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold text-amber uppercase tracking-[0.18em]">
                      {item.label}
                    </div>
                    <div className="mt-1 text-[16px] font-bold text-white">
                      {item.sub}
                    </div>
                  </div>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/70 hover:text-amber transition-colors"
                  >
                    {labels.learnMore}{" "}
                    <ArrowRight size={15} className="rtl:rotate-180" />
                  </Link>
                </div>

                {/* Thumbnail strip */}
                <div className="px-5 md:px-8 pb-5">
                  <div className="flex gap-2 overflow-x-auto pb-1 md:justify-center">
                    {visible.map((t, i) => (
                      <button
                        key={t.src}
                        type="button"
                        onClick={() => setActive([i, i > active ? 1 : -1])}
                        aria-label={tfill(labels.thumbLabel, {
                          n: i + 1,
                          title: t.label,
                        })}
                        aria-current={i === active}
                        className={`relative w-14 h-11 shrink-0 rounded-lg overflow-hidden transition-all ${
                          i === active
                            ? "ring-2 ring-amber opacity-100"
                            : "opacity-45 hover:opacity-80"
                        }`}
                      >
                        <Image
                          src={t.src}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
