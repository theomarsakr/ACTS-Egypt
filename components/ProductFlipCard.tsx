"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCw, ArrowRight, ExternalLink } from "lucide-react";
import type { GalleryItem } from "@/lib/data";

export default function ProductFlipCard({
  item,
  alt,
  docHref,
  docLabel = "View documents & data",
  pdfHref,
  pdfLabel = "View PDF",
}: {
  item: GalleryItem;
  alt: string;
  /** Optional in-page link (e.g. to the matching Engineering Hub series). */
  docHref?: string;
  docLabel?: string;
  /** Optional direct link to the product's primary PDF (opens in a new tab). */
  pdfHref?: string;
  pdfLabel?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group perspective-distant w-full">
      <div
        className={`relative aspect-3/4 w-full transition-transform duration-500 ease-out transform-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front: full branded product image — the whole face flips to details */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          inert={flipped || undefined}
          aria-label={`${alt} — show details`}
          className="absolute inset-0 backface-hidden rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow duration-300 group-hover:shadow-lg cursor-pointer text-left"
        >
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
        </button>

        {/* Back: details + optional link to full documents & data. Clicking
            anywhere that isn't a link/button flips the card back to the photo.
            (Keyboard users flip back via the explicit "Flip back" button.) */}
        <div
          inert={!flipped || undefined}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("a, button")) {
              setFlipped(false);
            }
          }}
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-brand/30 bg-white shadow-sm overflow-hidden p-5 flex flex-col transition-shadow duration-300 group-hover:shadow-lg cursor-pointer"
        >
          <div className="text-[11px] font-bold tracking-wider text-brand">
            {item.detail.tag}
          </div>
          <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
            {item.detail.description}
          </p>
          <ul className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto [scrollbar-width:thin]">
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

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
            {pdfHref ? (
              // Two actions: open the PDF directly, or jump to the full hub entry.
              <div className="flex gap-2">
                <a
                  href={pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-2 py-2 text-[12px] font-bold text-white transition-all hover:bg-brand-dark hover:-translate-y-0.5"
                >
                  <ExternalLink size={13} /> {pdfLabel}
                </a>
                {docHref && (
                  <a
                    href={docHref}
                    className="group/link flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-2 py-2 text-[12px] font-bold text-white transition-all hover:bg-navy-700 hover:-translate-y-0.5"
                  >
                    Details
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover/link:translate-x-0.5"
                    />
                  </a>
                )}
              </div>
            ) : (
              docHref && (
                <a
                  href={docHref}
                  className="group/link inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-[12.5px] font-bold text-white transition-all hover:bg-navy-700 hover:-translate-y-0.5"
                >
                  {docLabel}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover/link:translate-x-0.5"
                  />
                </a>
              )
            )}
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-navy/60 hover:text-navy transition-colors cursor-pointer"
            >
              <RotateCw size={12} /> Flip back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
