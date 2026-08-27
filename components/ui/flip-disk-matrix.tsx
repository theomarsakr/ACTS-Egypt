"use client";

import { useEffect, useRef } from "react";
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
 *
 * ── Why this is a canvas and not 637 divs ─────────────────────────────────
 * It was DOM first: a div per disk, each with `perspective`, an inner
 * `preserve-3d` flipper and two `backface-visibility: hidden` faces carrying
 * inset shadows and a gradient. That is ~1,900 nodes, and every one of the
 * 637 flippers is a 3D rendering context the compositor has to promote and
 * manage its own layer for — plus a `:hover` rule on each, so every pointer
 * move across the board re-ran hit testing and style invalidation over 637
 * boxes. The board dropped frames badly on anything but a fast desktop.
 *
 * The whole thing is one <canvas> now, which costs exactly one layer. The
 * flip is drawn the way a real flip disk actually reads — an ellipse whose
 * height is |cos(angle)|, showing the outgoing face until it passes edge-on
 * and the incoming face after — so the 3D transform isn't simulated, it's
 * just projected directly. Each of the five faces (four logo colours plus
 * the unlit cap) is pre-rendered once into a small offscreen sprite at device
 * resolution, so a frame is 637 `drawImage` calls and no per-disk gradient or
 * shadow work at all.
 *
 * The loop is demand-driven: rAF runs only while a flip or a hover is
 * actually in flight, then stops itself until the next scheduled step. It
 * also stops while the board is scrolled out of view or the tab is hidden.
 * At rest — which is most of the cycle — the board costs nothing.
 */

/* Sized to the longest word: 8 chars x (5 wide + 1 gap) - 1 = 47 columns, plus
   a column of margin each side. Every shorter word centres inside that. */
const COLS = 49;
const ROWS = 13;
const HOLD_MS = 2800;
const BLANK_MS = 700;
/* Per-column flip delay — the sweep that makes it read as mechanical. */
const STAGGER_MS = 10;
/** How long one disk takes to turn over. Was the CSS `duration-600`. */
const FLIP_MS = 600;
/** Hover knocks a disk edge-on fast and lets it fall back slowly, as the old
    `hover:duration-100` / 600ms-return pair did. */
const POKE_MS = 100;
const UNPOKE_MS = 600;
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
/** Unlit cap: ink face, navy-700 rim — the same two tokens the divs used. */
const UNLIT_FILL = "#060d1c";
const UNLIT_RIM = "#1b3352";
/** Sprite slot for the unlit face, after the four lit ones. */
const UNLIT = COLORS.length;

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

/** Flat COLS*ROWS grid of colour indices, or UNLIT for an unlit disk. */
function glyphBitmap(word: string): Int8Array {
  const grid = new Int8Array(COLS * ROWS).fill(UNLIT);
  const chars = word.toUpperCase().split("");
  const gw = 5;
  const gh = 7;
  const totalW = chars.length * (gw + 1) - 1;

  let ox = Math.max(0, Math.floor((COLS - totalW) / 2));
  const oy = Math.max(0, Math.floor((ROWS - gh) / 2));

  chars.forEach((c, ci) => {
    const rowsBits = GLYPHS[c] ?? GLYPHS[" "];
    // Colour per letter, cycling the logo's four — so "ACTS" lands exactly on
    // the wordmark's blue / yellow / green / red.
    const color = ci % COLORS.length;
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        if (oy + y < ROWS && ox + x < COLS) {
          if (rowsBits[y] & (1 << (gw - 1 - x))) {
            grid[(oy + y) * COLS + ox + x] = color;
          }
        }
      }
    }
    ox += gw + 1;
  });
  return grid;
}

/** easeOutBack — the exact curve cubic-bezier(0.34, 1.56, 0.64, 1) names, so
    a disk still overshoots a few degrees past flat and settles back. */
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

/**
 * Pre-render the five disk faces once per size change. Each sprite carries the
 * shading the CSS used to do with a gradient plus two inset shadows, baked in:
 * a lit cap reads as a polished dome, the unlit one as a recessed ink disk.
 */
function buildSprites(diameter: number, dpr: number) {
  const s = Math.max(2, Math.ceil(diameter * dpr));
  const rim = Math.max(1, dpr * 0.75);
  const faces: HTMLCanvasElement[] = [];

  const circle = (c: CanvasRenderingContext2D) => {
    c.beginPath();
    c.arc(s / 2, s / 2, (s - rim) / 2, 0, Math.PI * 2);
  };

  for (let i = 0; i <= UNLIT; i++) {
    const cv = document.createElement("canvas");
    cv.width = s;
    cv.height = s;
    const c = cv.getContext("2d");
    if (!c) continue;

    if (i === UNLIT) {
      circle(c);
      c.fillStyle = UNLIT_FILL;
      c.fill();
      // inset 0 2px 4px rgba(0,0,0,0.6) — a shade off the top rim inward.
      c.save();
      c.clip();
      const shade = c.createLinearGradient(0, 0, 0, s * 0.55);
      shade.addColorStop(0, "rgba(0,0,0,0.6)");
      shade.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = shade;
      c.fillRect(0, 0, s, s);
      c.restore();
      circle(c);
      c.lineWidth = rim;
      c.strokeStyle = UNLIT_RIM;
      c.stroke();
    } else {
      const [light, dark] = COLORS[i];
      circle(c);
      const g = c.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, light);
      g.addColorStop(1, dark);
      c.fillStyle = g;
      c.fill();
      c.save();
      c.clip();
      // inset 0 -2px 6px rgba(0,0,0,0.35) — weight under the cap.
      const under = c.createLinearGradient(0, s * 0.45, 0, s);
      under.addColorStop(0, "rgba(0,0,0,0)");
      under.addColorStop(1, "rgba(0,0,0,0.35)");
      c.fillStyle = under;
      c.fillRect(0, 0, s, s);
      // inset 0 1px 1px rgba(255,255,255,0.45) — the highlight along the top.
      const gloss = c.createLinearGradient(0, 0, 0, s * 0.4);
      gloss.addColorStop(0, "rgba(255,255,255,0.45)");
      gloss.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = gloss;
      c.fillRect(0, 0, s, s);
      c.restore();
      circle(c);
      c.lineWidth = rim;
      c.strokeStyle = dark;
      c.stroke();
    }
    faces.push(cv);
  }
  return faces;
}

export function FlipDiskMatrix({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!board || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = COLS * ROWS;
    const frames = WORDS.map(glyphBitmap);
    const blank = new Int8Array(N).fill(UNLIT);

    /* Per-disk flip state: the face it is turning away from, the face it is
       turning to, and when its own turn begins (start + its column stagger). */
    const from = new Int8Array(N);
    const to = new Int8Array(N);
    const startAt = new Float64Array(N);

    // Reduced motion settles on the wordmark itself, not a mid-sequence word.
    let wordIdx = WORDS.length - 1;
    let showing = true;
    from.set(frames[wordIdx]);
    to.set(frames[wordIdx]);
    startAt.fill(-1e9);

    let dpr = 1;
    let disk = MIN_DISK_PX;
    let cssW = MIN_GRID_WIDTH;
    let cssH = ROWS * MIN_DISK_PX + (ROWS - 1) * GAP_PX;
    let sprites: HTMLCanvasElement[] = [];

    let flipUntil = 0;
    let poked = -1; // disk under the pointer, or -1
    let pokeAt = 0;
    /* Every disk the pointer has left keeps its own fall-back clock, so a slow
       sweep leaves a trail of disks easing home rather than one animating and
       the rest snapping flat behind it. */
    const leftAt = new Float64Array(N).fill(-1e9);
    const leftAmt = new Float32Array(N);

    let raf = 0;
    let stepTimer: ReturnType<typeof setTimeout> | null = null;
    let onScreen = true;

    /** Where a disk is in its turn: 0 = square on, 1 = fully turned over. */
    const turn = (i: number, now: number) => {
      if (from[i] === to[i]) return 1;
      const t = (now - startAt[i]) / FLIP_MS;
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return easeOutBack(t);
    };

    /** How far a disk is knocked edge-on by the pointer, 0..1. */
    const poke = (i: number, now: number) => {
      if (i === poked) return Math.min(1, (now - pokeAt) / POKE_MS);
      const t = now - leftAt[i];
      if (t < 0 || t >= UNPOKE_MS) return 0;
      return leftAmt[i] * (1 - t / UNPOKE_MS);
    };
    /** Hand the disk the pointer is leaving its own clock to fall back on. */
    const release = (now: number) => {
      if (poked === -1) return;
      leftAmt[poked] = poke(poked, now);
      leftAt[poked] = now;
    };

    function draw(now: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, cssW, cssH);
      const pitch = disk + GAP_PX;
      let busy = now < flipUntil;

      for (let y = 0; y < ROWS; y++) {
        const top = y * pitch;
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          // The projection: a disk mid-turn is an ellipse |cos| as tall as it
          // is wide, still showing the outgoing face until it passes edge-on.
          const c = Math.cos(turn(i, now) * Math.PI);
          let sy = Math.abs(c);
          const face = c >= 0 ? from[i] : to[i];

          const p = poke(i, now);
          if (p > 0) {
            sy *= 1 - p;
            if (p < 1) busy = true;
          }

          const h = disk * sy;
          if (h < 0.4) continue; // edge-on: nothing to paint
          ctx!.drawImage(sprites[face], x * pitch, top + (disk - h) / 2, disk, h);
        }
      }
      return busy;
    }

    function tick(now: number) {
      raf = 0;
      if (draw(now) && onScreen) raf = requestAnimationFrame(tick);
    }
    function kick() {
      if (!raf && onScreen) raf = requestAnimationFrame(tick);
    }

    /** Retarget every disk whose face is changing, from wherever it is now. */
    function retarget(next: Int8Array) {
      const now = performance.now();
      for (let i = 0; i < N; i++) {
        if (to[i] === next[i]) continue;
        const c = Math.cos(turn(i, now) * Math.PI);
        from[i] = c >= 0 ? from[i] : to[i];
        to[i] = next[i];
        startAt[i] = now + (i % COLS) * STAGGER_MS;
      }
      flipUntil = now + (COLS - 1) * STAGGER_MS + FLIP_MS;
      kick();
    }

    function step() {
      if (showing) {
        showing = false;
        retarget(blank);
      } else {
        wordIdx = (wordIdx + 1) % WORDS.length;
        showing = true;
        retarget(frames[wordIdx]);
      }
      stepTimer = setTimeout(step, showing ? HOLD_MS : BLANK_MS);
    }

    function resize() {
      const w = board!.clientWidth;
      if (!w) return;
      const next = Math.max(MIN_DISK_PX, (w - (COLS - 1) * GAP_PX) / COLS);
      const nextDpr = Math.min(2, window.devicePixelRatio || 1);
      const sized = Math.abs(next - disk) > 0.25 || nextDpr !== dpr;
      disk = next;
      dpr = nextDpr;
      cssW = COLS * disk + (COLS - 1) * GAP_PX;
      cssH = ROWS * disk + (ROWS - 1) * GAP_PX;
      canvas!.style.width = `${cssW}px`;
      canvas!.style.height = `${cssH}px`;
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      if (sized || !sprites.length) sprites = buildSprites(disk, dpr);
      // A resize clears the backing store, so always repaint.
      draw(performance.now());
      kick();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(board);
    resize();

    /* Pause entirely off-screen and in a hidden tab: an idle board should not
       hold a rAF open just to redraw a frame nobody is looking at. */
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) kick();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(board);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Hover: only mice get it — a touch "move" is a scroll, not a pointing.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const pitch = disk + GAP_PX;
      const x = Math.floor(((e.clientX - r.left) * (cssW / r.width)) / pitch);
      const y = Math.floor(((e.clientY - r.top) * (cssH / r.height)) / pitch);
      const i =
        x >= 0 && x < COLS && y >= 0 && y < ROWS ? y * COLS + x : -1;
      if (i === poked) return;
      const now = performance.now();
      release(now);
      poked = i;
      pokeAt = now;
      kick();
    };
    const onLeave = () => {
      if (poked === -1) return;
      const now = performance.now();
      release(now);
      poked = -1;
      kick();
    };

    if (!reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
      stepTimer = setTimeout(step, HOLD_MS);
    }

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (stepTimer) clearTimeout(stepTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

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
        <div ref={boardRef} style={{ minWidth: `${MIN_GRID_WIDTH}px` }}>
          <canvas ref={canvasRef} aria-hidden className="block" />
        </div>
      </div>
    </div>
  );
}
