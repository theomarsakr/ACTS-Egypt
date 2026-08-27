"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export type SpecField = {
  label: string;
  value: ReactNode;
  /** Spans both columns of the 2-up field grid at `sm:`+, instead of sharing
   *  a row — for a field whose value needs room to wrap (a chip list) rather
   *  than being squeezed into a half-width column. */
  wide?: boolean;
};
export type SpecRecord = {
  /** Bold record title — e.g. a valve category or a department name. */
  title: string;
  /** Optional small kicker above the title (e.g. a rating or spec code). */
  tag?: string;
  fields: SpecField[];
};

/**
 * SpecSheet — the site's "engineering datasheet" primitive. Replaces flat HTML
 * data tables with a list of spec-cards that read like rows of an instrument
 * datasheet: a numbered index gutter, a category header with a brass accent
 * rule, and labeled field blocks. Cards stagger in on scroll and lift under the
 * cursor. Fully responsive — fields reflow to a single column on mobile, fixing
 * the horizontal-scroll problem plain tables have on narrow screens.
 *
 * Motion is spring-eased and disabled under prefers-reduced-motion.
 */
export default function SpecSheet({ records }: { records: SpecRecord[] }) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.08 },
    },
  };
  // Under reduced motion the entrance is instant, not merely un-staggered.
  // This previously kept `hidden: { opacity: 0 }` and the 0.55s fade, which
  // contradicts the contract in the docblock above — a half-second opacity
  // ramp is still motion, and it is the part vestibular-sensitive users are
  // most likely to notice on a nine-row datasheet. It also made the a11y gate
  // non-deterministic: axe samples computed color, so a row caught mid-fade
  // reports the blended value (#987c49) rather than the --color-brand token
  // (#8a6a30), failing contrast at 3.95:1 even though the token itself clears
  // 4.5:1 at rest (5.02:1 on white, and gray-500 at 5.98:1).
  const row: Variants = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: reduced ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    // Animate on mount rather than on scroll: whileInView can leave content
    // stuck at opacity:0 when the tab panel mounts off-screen or the observer
    // never fires (hidden tabs, headless renders). Mount-triggered entrance
    // always completes, so the datasheet is never invisible.
    <motion.ol
      variants={container}
      initial="hidden"
      animate="show"
      className="overflow-hidden rounded-2xl border border-brand/20 bg-white shadow-[0_1px_2px_rgba(10,22,40,0.04),0_18px_40px_-24px_rgba(10,22,40,0.18)] divide-y divide-gray-100"
    >
      {records.map((rec, i) => (
        <motion.li
          key={rec.title}
          variants={row}
          className="group relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 px-5 py-5 sm:px-6 transition-colors hover:bg-brand-light/40"
        >
          {/* Index gutter + growing accent bar */}
          <div className="relative flex flex-col items-center">
            <span className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-y-100" />
            <span className="pl-3 text-[13px] font-bold tabular-nums text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Record body */}
          <div className="min-w-0">
            {rec.tag && (
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                {rec.tag}
              </div>
            )}
            <h4 className="text-fluid-h5 font-bold text-navy leading-snug">
              {rec.title}
            </h4>
            <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {rec.fields.map((f) => (
                <div key={f.label} className={`min-w-0 ${f.wide ? "sm:col-span-2" : ""}`}>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-[14.5px] text-gray-600 leading-relaxed break-words">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
