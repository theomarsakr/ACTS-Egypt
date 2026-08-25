"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const FlipDiskMatrix = dynamic(
  () => import("@/components/ui/flip-disk-matrix").then((m) => m.FlipDiskMatrix),
  { ssr: false }
);

/**
 * FlipDiskMatrixLazy — mounts the 637-disk grid only once its section
 * scrolls near the viewport, the same deferral RotatingEarthLazy uses for
 * the homepage globe: `next/dynamic({ ssr: false })` alone still fetches
 * the client chunk on every page load regardless of scroll depth, so the
 * actual saving comes from not rendering the real component at all until
 * this IntersectionObserver fires. The placeholder reserves the mounted
 * matrix's measured ratio (~3:1 at desktop padding) so nothing shifts when
 * it swaps in.
 */
export default function FlipDiskMatrixLazy({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (shouldLoad) {
    return <FlipDiskMatrix className={className} />;
  }

  return (
    <div
      ref={ref}
      className={`aspect-3/1 w-full max-w-6xl rounded-3xl bg-navy ${className}`}
    />
  );
}
