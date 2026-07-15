"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCw } from "lucide-react";
import type { GalleryItem } from "@/lib/data";

export default function ProductFlipCard({
  item,
  alt,
}: {
  item: GalleryItem;
  alt: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${alt} — tap to ${flipped ? "show photo" : "show details"}`}
      className="group perspective-distant w-full text-left cursor-pointer"
    >
      <div
        className={`relative aspect-3/4 w-full transition-transform duration-500 ease-out transform-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front: full branded product image (photo + Farris/ACTS footer) */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
          <div className="sheen relative w-full h-full">
            <Image
              src={item.src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw"
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-navy/70 text-white backdrop-blur transition-transform duration-500 ease-out group-hover:rotate-180">
            <RotateCw size={14} />
          </div>
        </div>

        {/* Back: details */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-brand/30 bg-white shadow-sm overflow-hidden p-5 flex flex-col transition-shadow duration-300 group-hover:shadow-lg">
          <div className="text-[11px] font-bold tracking-wider text-brand">
            {item.detail.tag}
          </div>
          <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
            {item.detail.description}
          </p>
          <ul className="mt-3 space-y-1.5">
            {item.detail.specs.map((s) => (
              <li
                key={s}
                className="flex gap-2 text-[12.5px] text-gray-600 leading-snug"
              >
                <CheckCircle2 size={14} className="text-brand shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-3 flex items-center gap-1.5 text-[12px] font-semibold text-navy/70">
            <RotateCw size={12} /> Tap to flip back
          </div>
        </div>
      </div>
    </button>
  );
}
