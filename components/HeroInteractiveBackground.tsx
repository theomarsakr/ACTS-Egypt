"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------ *
 * HeroInteractiveBackground
 *
 * The base background layer for the homepage hero. It recreates — live,
 * rather than as a baked-in screenshot — the flowing dot-mesh field from
 * the reference frame (public/images/home/videoframe_2384.png): a grid of
 * cool-white dots rippling along topographic "wave" ridges over a dark
 * navy base, blueprint grid, and a warm amber glow bottom-left.
 *
 * On top of that field the dots light up amber near the cursor with a soft
 * falloff, and faint amber threads connect neighbours inside that radius.
 * The whole layer is pointer-events:none, so the real hero content (heading,
 * buttons, spec-card stack) stays fully interactive above it — the cursor
 * "reactive glow" is driven by a window-level pointer listener, not by the
 * canvas capturing events.
 *
 * Respects prefers-reduced-motion (renders one static frame, no loop, no
 * cursor reactivity) and pauses whenever the tab is hidden or the hero is
 * scrolled out of view.
 * ------------------------------------------------------------------ */

// Cool near-white for the resting dots (echoes the reference's neutral mesh).
const REST_RGB = [220, 228, 240] as const;
// Brand amber (#f0c419) — reserved for the cursor interaction so it reads.
const AMBER_RGB = [240, 196, 25] as const;

// smoothstep(edge0, edge1, x) — eased 0→1 ramp for the cursor falloff.
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function HeroInteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Live geometry / grid, rebuilt on resize.
    let width = 0;
    let height = 0;
    let spacing = 26;
    let cols = 0;
    let rows = 0;
    // Per-dot scratch buffers (index = row * cols + col), reused each frame.
    let px: Float32Array = new Float32Array(0);
    let py: Float32Array = new Float32Array(0);
    let infl: Float32Array = new Float32Array(0);

    // Pointer state in canvas-local pixels. strength eases 0↔1 so the glow
    // fades in/out instead of snapping when the cursor enters/leaves.
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;
    let strength = 0;

    let radius = 170; // cursor influence radius (recomputed on resize)
    let raf = 0;
    let running = false;
    let start = 0;

    function build() {
      if (!host || !canvas || !ctx) return;
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Denser dots on wider viewports; keep the count sane on phones.
      spacing = width < 640 ? 30 : width < 1024 ? 27 : 24;
      radius = width < 640 ? 120 : 180;
      // One dot-row of bleed on every side so ridges never clip at the edge.
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;
      const n = cols * rows;
      px = new Float32Array(n);
      py = new Float32Array(n);
      infl = new Float32Array(n);
    }

    function frame(now: number) {
      if (!ctx) return;
      if (!start) start = now;
      const t = (now - start) / 1000;

      // Ease the pointer influence toward its target (0 when inactive).
      strength += ((pointerActive ? 1 : 0) - strength) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const halfSpan = spacing; // grid starts one dot off-screen (the bleed)
      const rActive = radius * (0.75 + strength * 0.35);

      // --- Pass 1: place every dot and paint the resting/amber field. ---
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const gx = c * spacing - halfSpan;
          const gy = r * spacing - halfSpan;

          // Layered sines → the flowing topographic ridges of the reference.
          const w =
            Math.sin(gx * 0.010 + t * 0.55) +
            Math.sin(gy * 0.014 - t * 0.45) +
            Math.sin((gx + gy) * 0.008 + t * 0.32);

          // Small drift along the field so the mesh feels like it flows.
          const x = gx + Math.cos(w) * 3;
          const y = gy + Math.sin(w) * 3;
          px[i] = x;
          py[i] = y;

          // Ridge brightness: peaks of the wave glow, troughs recede.
          const wave = (w + 3) / 6; // → 0..1
          const ridge = Math.pow(wave, 1.7);
          let alpha = 0.06 + ridge * 0.5;
          let size = 0.55 + ridge * 1.1;

          // Cursor reactivity: amber lift with a soft (smoothstep) falloff.
          let f = 0;
          if (strength > 0.001) {
            const dx = x - pointerX;
            const dy = y - pointerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            f = smoothstep(rActive, 0, dist) * strength;
          }
          infl[i] = f;

          let rgb = REST_RGB as readonly number[];
          if (f > 0) {
            alpha = Math.min(0.95, alpha + f * 0.55);
            size += f * 1.8;
            const m = f; // blend cool-white → amber
            rgb = [
              REST_RGB[0] + (AMBER_RGB[0] - REST_RGB[0]) * m,
              REST_RGB[1] + (AMBER_RGB[1] - REST_RGB[1]) * m,
              REST_RGB[2] + (AMBER_RGB[2] - REST_RGB[2]) * m,
            ];
          }

          // Soft amber halo on the dots closest to the cursor.
          if (f > 0.35) {
            ctx.shadowBlur = 10 * f;
            ctx.shadowColor = `rgba(240, 196, 25, ${0.6 * f})`;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(${rgb[0] | 0}, ${rgb[1] | 0}, ${rgb[2] | 0}, ${alpha})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // --- Pass 2: faint amber threads between lit neighbours near cursor. ---
      if (strength > 0.02) {
        ctx.lineWidth = 1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            const fa = infl[i];
            if (fa < 0.18) continue;
            // right + down neighbours only → each edge drawn once.
            if (c + 1 < cols) {
              const j = i + 1;
              const link = Math.min(fa, infl[j]);
              if (link > 0.18) {
                ctx.strokeStyle = `rgba(240, 196, 25, ${link * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(px[i], py[i]);
                ctx.lineTo(px[j], py[j]);
                ctx.stroke();
              }
            }
            if (r + 1 < rows) {
              const j = i + cols;
              const link = Math.min(fa, infl[j]);
              if (link > 0.18) {
                ctx.strokeStyle = `rgba(240, 196, 25, ${link * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(px[i], py[i]);
                ctx.lineTo(px[j], py[j]);
                ctx.stroke();
              }
            }
          }
        }
      }

      raf = requestAnimationFrame(frame);
    }

    // Single static frame for reduced-motion (no loop, no reactivity).
    function drawStatic() {
      if (!ctx) return;
      start = 0;
      strength = 0;
      pointerActive = false;
      frame(performance.now());
      cancelAnimationFrame(raf);
    }

    function play() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // --- Pointer: tracked at window level so the layer stays pass-through. ---
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerX = x;
      pointerY = y;
      pointerActive = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    }
    function onPointerLeave() {
      pointerActive = false;
    }

    // --- Lifecycle: pause off-screen or on hidden tab. ---
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && document.visibilityState === "visible") {
          play();
        } else {
          pause();
        }
      },
      { threshold: 0 }
    );
    function onVisibility() {
      if (document.visibilityState === "visible") play();
      else pause();
    }
    const ro = new ResizeObserver(() => {
      build();
      if (reduced) drawStatic();
    });

    build();
    if (reduced) {
      drawStatic();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibility);
      io.observe(canvas);
    }
    ro.observe(host);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink pointer-events-none" aria-hidden>
      {/* Blueprint grid, faded toward the frame so the mesh reads as the hero. */}
      <div
        className="absolute inset-0 blueprint"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      {/* Drifting glows: warm amber bottom-left, cool steel top-right. */}
      <div className="mesh mesh-brass w-152 h-152 -bottom-64 -left-48" />
      <div className="mesh mesh-steel w-184 h-184 -top-56 -right-40" />

      {/* The live interactive dot-mesh field. */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Cinematic vignette + seam fade into the stat strip below. */}
      <div className="dark-vignette" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent" />
    </div>
  );
}
