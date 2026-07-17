"use client";

import { useEffect, useRef } from "react";

/**
 * SpiralAnimation — a golden-angle (phyllotaxis) spiral of amber dots that draws
 * in from the center and rotates slowly, tuned to the ACTS palette. Canvas-based,
 * DPR-aware, fills its positioned parent. Built for the first-visit intro
 * (IntroOverlay), which already gates it behind prefers-reduced-motion, so this
 * just animates. No external dependencies.
 */

const AMBER = [240, 196, 25] as const;
const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ~137.5°, the phyllotaxis angle
const N = 540; // dot count

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let maxR = 1;
    let spacing = 1;
    let raf = 0;
    let start = 0;

    function resize() {
      width = host!.clientWidth;
      height = host!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;
      maxR = Math.hypot(width, height) / 2;
      spacing = (maxR / Math.sqrt(N)) * 1.06;
    }

    function frame(now: number) {
      if (!start) start = now;
      const t = (now - start) / 1000;

      // Draw-in from the center outward over ~1.8s (ease-out cubic).
      const p = Math.min(1, t / 1.8);
      const ease = 1 - Math.pow(1 - p, 3);
      const revealed = Math.floor(ease * N);
      const rot = t * 0.16; // slow overall rotation

      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < revealed; i++) {
        const a = i * GOLDEN + rot;
        const r = spacing * Math.sqrt(i);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;

        const edge = Math.max(0, 1 - r / maxR); // fade toward the frame
        const twinkle = 0.72 + 0.28 * Math.sin(t * 2 + i * 0.5);
        // Freshly-revealed dots at the growing outer rim flare brighter.
        const rim = Math.min(1, (revealed - i) / 44 + 0.25);
        const alpha = edge * 0.9 * twinkle * rim;
        if (alpha <= 0.01) continue;
        const size = 0.6 + 2.2 * edge;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${AMBER[0]}, ${AMBER[1]}, ${AMBER[2]}, ${alpha})`;
        ctx!.arc(x, y, size, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export default SpiralAnimation;
