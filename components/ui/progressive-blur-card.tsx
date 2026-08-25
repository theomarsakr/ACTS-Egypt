"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ProgressiveBlurCard — a media-led profile card built on the "progressive
 * blur modal" pattern (the Apple-Music-style album card), keeping that
 * reference's anatomy rather than this site's usual white card:
 *
 *   - a rounded media panel INSET from the card edge, not full-bleed;
 *   - a heavily blurred, brightened copy of the same image bleeding out
 *     behind it, which is what produces the ambient colour glow around the
 *     panel (the reference does this with a second <img>);
 *   - a shallow gradient grounding the media's bottom edge against the card
 *     (see the note at the element for why it stays shallow here);
 *   - a title row with the name left and its metadata right, on one baseline;
 *   - a stack of bordered rows beneath, each label-left / value-right.
 *
 * Rebuilt on this site's own primitives: motion/react for the expand/collapse
 * (same library dock.tsx and floating-nav.tsx already use), this site's
 * `.mesh` glow and `.glass-dark` treatments, next/image, and real
 * buttons/aria attributes rather than div onClick handlers.
 */

export type CardRow = { label: string; value: string };

/** A pull-quote row: the line itself, plus the fuller thought behind it. */
export type CardQuote = { short: string; full: string };

export function ProgressiveBlurCard({
  name,
  role,
  initials,
  photoSrc,
  rows,
  quotes = [],
  quotesLabel = "In his words",
  bio,
  bioLabel = "Full profile",
  className,
}: {
  name: string;
  role: string;
  /** Shown on the media panel until a real photo is supplied. */
  initials: string;
  photoSrc?: string;
  /** Label-left / value-right rows beneath the title. */
  rows: CardRow[];
  /**
   * Quote rows beneath `rows`, each opening in place to the fuller thought.
   * This is the reference's second interaction: its song rows expand into a
   * detail panel, independently of the "+" that opens the artist bio.
   */
  quotes?: CardQuote[];
  /** Group heading above `quotes`. */
  quotesLabel?: string;
  /** One paragraph per array entry, revealed on expand. */
  bio: string[];
  /** Group heading above `bio` once revealed. */
  bioLabel?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  // Accordion, matching the reference: its song detail panel is exclusive, so
  // only one quote is ever open and the card cannot grow without bound.
  const [openQuote, setOpenQuote] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div
      className={cn(
        "card-lift overflow-hidden rounded-3xl border border-white/10 bg-ink shadow-2xl shadow-black/50",
        className
      )}
    >
      {/* Media panel — inset, with the blurred bleed copy behind it. */}
      <div className="relative p-3">
        {photoSrc && (
          /* The bleed: same image, blown out and blurred well past the
             panel's edges, so the panel sits in its own colour glow. Clipped
             by the card's overflow-hidden. */
          <div className="absolute inset-0 scale-110" aria-hidden>
            <Image
              src={photoSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="scale-110 object-cover opacity-60 blur-3xl brightness-150"
            />
          </div>
        )}

        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl">
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
              priority
            />
          ) : (
            /* Monogram stand-in. A progressive blur dissolves *detail*, so
               over a flat fill it does nothing visible — the texture and glow
               give it something to act on until a real portrait lands. */
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-navy-700 via-navy to-ink">
              <div className="blueprint absolute inset-0 opacity-50" aria-hidden />
              <div
                className="mesh mesh-brass"
                style={{ width: "60%", height: "90%", bottom: "-20%", left: "55%" }}
                aria-hidden
              />
              <div
                className="mesh mesh-steel"
                style={{ width: "55%", height: "80%", top: "-20%", left: "-10%" }}
                aria-hidden
              />
              <span className="font-display relative select-none text-[5.5rem] leading-none font-extrabold tracking-tight text-white/90 sm:text-[6.5rem]">
                {initials}
              </span>
            </div>
          )}

          {/* Ground the panel's bottom edge against the card below it.

              Deliberately shallow and never fully opaque. The album-cover
              treatment this card is modelled on assumes artwork with nothing
              to lose at the bottom; an environmental portrait is the opposite
              case, and a deep blurred dissolve here erased the desk, the
              engraved nameplate and the subject's own torso into a dark smear
              that read as a rendering fault rather than a design. */}
          <div
            className="absolute inset-x-0 bottom-0 h-[14%]"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(6,13,28,0.38) 60%, rgba(6,13,28,0.72) 100%)",
            }}
            aria-hidden
          />

          {/* Inset hairline: keeps the panel's edge crisp where the photo is
              light, which the card's own outer border cannot do from behind. */}
          <div
            className="absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset"
            aria-hidden
          />
        </div>

        {/* Reference puts this in the media's top-left corner. Given a real
            backing tint and hairline rather than `glass-dark` alone: at 6%
            white it vanished against the bright window in this photograph,
            and it is the only way into the full profile. */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={expanded ? `Collapse ${name}'s bio` : `Read more about ${name}`}
          className="absolute top-6 left-6 flex h-11 w-11 items-center justify-center rounded-full bg-ink/55 text-white shadow-lg shadow-black/25 ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-ink/75 focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
        >
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex"
          >
            <Plus size={20} strokeWidth={2.5} />
          </motion.span>
        </button>
      </div>

      <div className="px-6 pt-3 pb-6 sm:px-8 sm:pb-8">
        {/* Name on its own line at display size, role as a spec label beneath.
            The reference's one-line "title … metadata" row suits an album,
            where the metadata is a list of facts of equal weight; a person's
            title is subordinate to their name, so it reads better stacked. */}
        <h3 className="font-display text-[1.75rem] leading-none font-bold tracking-tight text-white sm:text-[2.125rem]">
          {name}
        </h3>
        <p className="eyebrow mt-2.5 text-[11px] text-amber">{role}</p>

        {/* Credential strip, in this site's own datasheet language: hairline
            rules and spec labels rather than the filled pills this card used
            to stack here. Three facts about the remit, not a product list. */}
        {rows.length > 0 && (
          <dl className="mt-7 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {rows.map((r) => (
              <div key={r.label} className="py-4 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                {/* Not the `.eyebrow` class: it is unlayered in globals.css,
                    so it outranks every Tailwind utility and pins these to
                    14px — the same size as the value underneath, which
                    flattens the hierarchy. Spelled out here so the label can
                    sit smaller than what it labels. */}
                <dt className="font-display text-[10px] leading-none font-bold tracking-[0.18em] text-white/50 uppercase">
                  {r.label}
                </dt>
                <dd className="mt-2.5 text-[14px] leading-snug font-medium text-white/80">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Quotes as a numbered editorial index: hairline rules and an amber
            numeral instead of a filled pill per line. Six stacked pills (three
            rows plus three quotes) read as a settings screen; ruled entries
            read as a page. */}
        {quotes.length > 0 && (
          <div className="mt-8">
            <p className="font-display text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
              {quotesLabel}
            </p>
            <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
              {quotes.map((q, i) => {
                const open = openQuote === i;
                return (
                  <li key={q.short}>
                    <button
                      type="button"
                      onClick={() => setOpenQuote(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`${panelId}-quote-${i}`}
                      className="group flex w-full items-start gap-4 py-4 text-left focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-inset focus-visible:outline-none"
                    >
                      <span className="w-5 shrink-0 pt-[3px] text-[11px] font-semibold tracking-[0.15em] text-amber/70 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {/* Typographic quotes, not the straight " character. */}
                      <span className="flex-1 text-[16px] leading-snug font-medium text-white/85 transition-colors group-hover:text-white">
                        &ldquo;{q.short}&rdquo;
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex shrink-0 pt-1 text-white/30 transition-colors group-hover:text-white/60"
                        aria-hidden
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`${panelId}-quote-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: reduced ? 0 : 0.35,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          {/* Indented to the quote's own left edge, clearing
                              the numeral column. */}
                          <p className="pr-8 pb-5 pl-9 text-[14.5px] leading-relaxed text-white/60">
                            {q.full}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="font-display text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                  {bioLabel}
                </p>
                <div className="mt-4 space-y-3.5 text-[15px] leading-relaxed text-white/65">
                  {bio.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
