"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ProductShowcase = dynamic(() => import("@/components/brands/ProductShowcase"), {
  ssr: false,
});

/**
 * ProductShowcaseLazy — mounts the 3D product viewer (and the ~600KB of
 * three.js it pulls in) only once its section scrolls near the viewport,
 * rather than shipping that chunk in every brand page's first load
 * regardless of how far anyone scrolls. Same rationale and pattern as
 * RotatingEarthLazy: `next/dynamic({ ssr: false })` alone only stops server
 * rendering — the client chunk is still fetched during hydration unless
 * mounting itself is deferred behind an IntersectionObserver. The placeholder
 * reserves the showcase's resting height so nothing shifts when it swaps in.
 */
export default function ProductShowcaseLazy({ slug }: { slug: string }) {
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
      // Starts the download a little before the section is actually on
      // screen, so the swap-in doesn't read as a pop.
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (shouldLoad) {
    return <ProductShowcase slug={slug} />;
  }

  return <div ref={ref} className="h-[60vh]" />;
}
