"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown, Images } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import type { ProductLine } from "@/lib/data";

/**
 * ProductLineCard — a product-line summary that expands to reveal every product
 * in the line as a horizontally scrollable strip of branded product photos, so a
 * customer can see the whole range at a glance. Lines with no products render as
 * a plain, non-interactive card.
 *
 * The strip keeps a constant height regardless of how many products a line has
 * (1–9), the panel animates open via the grid-rows 0fr→1fr technique (no height
 * measuring), and it is `inert` while collapsed so its contents stay out of
 * tab/AT order. The whole header is the disclosure button for an easy target.
 */
export default function ProductLineCard({
  line,
  galleryHref = {},
}: {
  line: ProductLine;
  /** Product image src → gallery anchor (e.g. "#gallery-sliding-stem"). When a
   *  product has an entry, its photo links down to that card in the gallery. */
  galleryHref?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const products = line.products ?? [];
  const count = products.length;
  const hasProducts = count > 0;

  const summary = (
    <>
      {line.tag && (
        <div className="text-xs font-bold tracking-wider text-brand">
          {line.tag}
        </div>
      )}
      <div className="mt-1 text-lg font-bold text-navy">{line.name}</div>
      <p className="mt-2 text-[15px] text-gray-600">{line.description}</p>
    </>
  );

  return (
    <SpotlightCard className="accent-bar card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-brand/50">
      {hasProducts ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex-1 cursor-pointer p-6 pl-5.25 text-left"
        >
          {summary}
          <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand">
            {open
              ? count > 1
                ? "Hide products"
                : "Hide product"
              : count > 1
                ? `See all ${count} products`
                : "See the product"}
            <ChevronDown
              size={15}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>
      ) : (
        <div className="flex-1 p-6 pl-5.25">{summary}</div>
      )}

      {hasProducts && (
        <div
          id={panelId}
          inert={!open || undefined}
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`border-t border-gray-100 pb-4 pt-4 transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              <ul className="flex snap-x gap-3 overflow-x-auto px-5 pb-2">
                {products.map((p) => {
                  const href = galleryHref[p.image];
                  const photo = (
                    <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors group-hover/item:border-brand/60">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="148px"
                        className="object-contain"
                      />
                      {href && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-navy/85 py-1.5 text-[10.5px] font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/item:opacity-100">
                          <Images size={12} /> View in gallery
                        </div>
                      )}
                    </div>
                  );
                  const label = (
                    <p className="mt-2 line-clamp-2 text-[12.5px] font-medium leading-snug text-navy">
                      {p.name}
                    </p>
                  );
                  return (
                    <li key={p.image} className="w-37 shrink-0 snap-start">
                      {href ? (
                        <a href={href} className="group/item block rounded-xl">
                          {photo}
                          {label}
                        </a>
                      ) : (
                        <>
                          {photo}
                          {label}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
              {count > 2 && (
                <p className="px-5 pt-0.5 text-[11px] font-medium text-gray-400">
                  Scroll to see all {count} →
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
