"use client";

import { useEffect, useMemo, useState, memo } from "react";
import { useReducedMotion } from "motion/react";

/**
 * FlipDiskMatrix — a split-flap (Vestaboard/airport-departure-board) sign that
 * spells out the company name one word at a time, out of individually flipping
 * disks.
 *
 * Ported from a community "flip disk matrix" demo — a generic clock/text/
 * wave/noise display with a mode switcher and text input — and trimmed down
 * to what this page actually needs: a fixed brand sequence, not a playground
 * widget. Dropped the mode switcher, the text input, and the time/wave/noise
 * generators (dead code once the text is fixed); kept the one genuinely
 * good idea, the per-disk 3D flip.
 *
 * Lit disks carry the four logo colours, assigned per letter in the logo's own
 * left-to-right order (blue, yellow, green, red) — so the closing "ACTS" frame
 * reproduces the wordmark's colouring exactly, A blue through S red.
 *
 * Real flip-disk hardware re-flips its segments on a cycle even when the
 * content hasn't changed — that periodic re-flip is the whole tell that it's
 * mechanical, not a screen. This does the same: hold a word, flip to blank,
 * flip up the next one, with a per-column delay so the change sweeps across
 * the board rather than snapping over all at once.
 */

/* Sized to the longest word: 8 chars x (5 wide + 1 gap) - 1 = 47 columns, plus
   a column of margin each side. Every shorter word centres inside that. */
const COLS = 49;
const ROWS = 13;
const HOLD_MS = 2800;
const BLANK_MS = 700;
/* Per-column flip delay — the sweep that makes it read as mechanical. */
const STAGGER_MS = 10;
/* Below this, letting the 49 columns keep shrinking to fit stops being a
   crisp reflow and starts being illegible — at 360px each disk is ~5-6px, a
   smear rather than a letterform. Reducing COLS would be content removal
   (the board is genuinely 49 wide); this is the floor per disk instead, with
   the board panning horizontally under it. Matches the 3px gap ceiling used
   below (see MIN_GRID_WIDTH). */
const MIN_DISK_PX = 8;
const GAP_PX = 3;
const MIN_GRID_WIDTH = COLS * MIN_DISK_PX + (COLS - 1) * GAP_PX;

const WORDS = ["ADVANCED", "COMPANY", "FOR", "TRADING", "SERVICES", "ACTS"];

/* The logo's four slash colours, in the order they appear across the wordmark.
   Each is paired with a darker tone so a lit disk shades like a curved,
   polished cap rather than a flat dot. */
const COLORS: readonly (readonly [string, string])[] = [
  ["#0090c8", "#00688f"], // blue
  ["#f8e010", "#c2ad00"], // yellow
  ["#00a858", "#00713a"], // green
  ["#e02818", "#a11a0e"], // red
];

// 5x7 bitmap font — only the letters the words in WORDS actually need.
const GLYPHS: Record<string, number[]> = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01110, 0b10001, 0b10000, 0b01110, 0b00001, 0b10001, 0b01110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  " ": [0, 0, 0, 0, 0, 0, 0],
};

/** Grid of colour indices, or -1 for an unlit disk. */
function glyphBitmap(word: string, cols: number, rows: number): number[][] {
  const grid: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(-1)
  );
  const chars = word.toUpperCase().split("");
  const gw = 5;
  const gh = 7;
  const totalW = chars.length * (gw + 1) - 1;

  let ox = Math.max(0, Math.floor((cols - totalW) / 2));
  const oy = Math.max(0, Math.floor((rows - gh) / 2));

  chars.forEach((c, ci) => {
    const rowsBits = GLYPHS[c] ?? GLYPHS[" "];
    // Colour per letter, cycling the logo's four — so "ACTS" lands exactly on
    // the wordmark's blue / yellow / green / red.
    const color = ci % COLORS.length;
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        if (oy + y < rows && ox + x < cols) {
          if (rowsBits[y] & (1 << (gw - 1 - x))) grid[oy + y][ox + x] = color;
        }
      }
    }
    ox += gw + 1;
  });
  return grid;
}

const Disk = memo(({ color, delay }: { color: number; delay: number }) => {
  const on = color >= 0;
  const [light, dark] = COLORS[on ? color : 0];
  return (
    <div className="relative aspect-square w-full" style={{ perspective: "400px" }}>
      <div
        className="absolute inset-0 h-full w-full transition-transform duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:duration-100 hover:rotate-x-90"
        style={{
          transformStyle: "preserve-3d",
          transform: on ? "rotateX(180deg)" : "rotateX(0deg)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {/* Unlit face — ink, darker than the case around it, so the lit
            colours read as the only light in the room. */}
        <div
          className="absolute inset-0 rounded-full border border-navy-700 bg-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          style={{ backfaceVisibility: "hidden" }}
        />
        {/* Lit face — the letter's logo colour, shaded to read as a cap. */}
        <div
          className="absolute inset-0 rounded-full shadow-[inset_0_-2px_6px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.45)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
            backgroundImage: `linear-gradient(to bottom right, ${light}, ${dark})`,
            border: `1px solid ${dark}`,
          }}
        />
      </div>
    </div>
  );
});
Disk.displayName = "Disk";

export function FlipDiskMatrix({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const words = useMemo(
    () => WORDS.map((w) => glyphBitmap(w, COLS, ROWS)),
    []
  );
  const blankBits = useMemo(
    () => Array.from({ length: ROWS }, () => Array(COLS).fill(-1)),
    []
  );
  const [index, setIndex] = useState(WORDS.length - 1); // open on "ACTS"
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    if (reduced) return; // static wordmark, no cycle
    const timer = setTimeout(
      () => {
        if (showing) {
          setShowing(false);
        } else {
          setIndex((i) => (i + 1) % WORDS.length);
          setShowing(true);
        }
      },
      showing ? HOLD_MS : BLANK_MS
    );
    return () => clearTimeout(timer);
  }, [showing, reduced]);

  // Reduced motion settles on the wordmark itself rather than a mid-sequence word.
  const bits = reduced
    ? words[WORDS.length - 1]
    : showing
      ? words[index]
      : blankBits;

  return (
    <div
      role="img"
      aria-label="ACTS — Advanced Company for Trading Services"
      className={`relative w-full max-w-6xl rounded-3xl border border-navy-700 bg-linear-to-b from-navy-700 to-navy p-3 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),0_30px_70px_-15px_rgba(0,0,0,0.7),0_0_80px_-20px_rgba(138,106,48,0.35)] [content-visibility:auto] md:p-8 ${className}`}
    >
      {/* Below MIN_GRID_WIDTH the board scrolls rather than shrinking the
          disks past legibility — same overflow-x-auto + .scroll-fade-x
          pattern as the dock/tab scrollers, with --scroll-fade-bg set to
          match this panel's black rather than the default white. */}
      <div
        className="scroll-fade-x relative overflow-x-auto rounded-xl bg-black p-3 shadow-[inset_0_2px_14px_rgba(0,0,0,1)] [scrollbar-width:none] md:p-5 [&::-webkit-scrollbar]:hidden"
        style={{ "--scroll-fade-bg": "#000" } as React.CSSProperties}
      >
        <div
          aria-hidden
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(${MIN_DISK_PX}px, 1fr))`,
            gap: `${GAP_PX}px`,
            minWidth: `${MIN_GRID_WIDTH}px`,
          }}
        >
          {bits.map((row, y) =>
            row.map((color, x) => (
              <Disk key={`${x}-${y}`} color={color} delay={x * STAGGER_MS} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
