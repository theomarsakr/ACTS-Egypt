"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  ExternalLink,
  FileText,
  RotateCw,
  Library,
} from "lucide-react";

export type CardDoc = {
  title: string;
  ref?: string;
  lang?: string;
  href: string;
};

export type ResourceCardBrand = {
  slug: string;
  no: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  sectors: string[];
  image: string;
  imageAlt: string;
  productLinesCount: number;
};

export default function BrandResourceCard({
  brand,
  featured,
  total,
  anchor,
}: {
  brand: ResourceCardBrand;
  featured: CardDoc[];
  total: number;
  anchor: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-distant">
      <div
        className={`relative transition-transform duration-700 ease-out transform-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ── FRONT ─────────────────────────────────────────────── */}
        <div
          inert={flipped || undefined}
          className="backface-hidden card-premium glow-hover overflow-hidden rounded-3xl"
        >
          <div className="grid lg:grid-cols-5">
            <div className="img-zoom relative min-h-56 lg:col-span-2">
              <Image
                src={brand.image}
                alt={brand.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/50 to-transparent" />
              <div className="absolute bottom-4 left-5 text-[12px] font-bold text-white/90 uppercase tracking-widest">
                {brand.no}
              </div>
            </div>
            <div className="lg:col-span-3 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-navy">
                {brand.name}
              </h2>
              <div className="mt-1.5 text-sm font-semibold text-brand">
                {brand.category} · {brand.origin.split("·")[0].trim()}
              </div>
              <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">
                {brand.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {brand.sectors.map((s) => (
                  <span
                    key={s}
                    className="text-[13px] font-medium text-navy/70 bg-gray-100 rounded-full px-3 py-1"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-navy text-white hover:bg-navy-700 transition-all hover:-translate-y-0.5"
                >
                  View {brand.productLinesCount} product lines
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <FileText size={16} />
                  <span>{total} brochures &amp; PDFs</span>
                  <RotateCw
                    size={15}
                    className="transition-transform duration-500 group-hover:rotate-180"
                  />
                </button>
                <Link
                  href={`/quote?brand=${brand.slug}`}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white text-navy border border-gray-300 hover:border-navy hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                >
                  Get a quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK ──────────────────────────────────────────────── */}
        <div
          inert={!flipped || undefined}
          className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-3xl bg-navy text-white shadow-xl shadow-navy/20 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-4 border-b border-white/10 shrink-0">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-amber">
                <Library size={14} /> Document library
              </div>
              <h3 className="mt-1.5 text-xl md:text-2xl font-extrabold">
                {brand.name}
              </h3>
              <p className="text-[13px] text-white/60">
                {`${total} brochures, catalogs & technical PDFs`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label="Flip card back"
              className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
            >
              <RotateCw size={13} /> Back
            </button>
          </div>

          {/* Featured document links (scrolls if long) */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:thin]">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
              Featured downloads
            </div>
            <ul className="space-y-1">
              {featured.map((doc) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-white/10 text-amber group-hover:bg-white/15">
                      <FileText size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-snug truncate">
                        {doc.title}
                      </span>
                      <span className="text-[11px] text-white/45">
                        PDF{doc.ref ? ` · ${doc.ref}` : ""}
                      </span>
                    </span>
                    <ExternalLink
                      size={15}
                      className="shrink-0 text-white/30 group-hover:text-amber transition-colors"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer CTA to the full library */}
          <div className="shrink-0 px-4 py-4 border-t border-white/10">
            <a
              href={`#${anchor}`}
              className="group flex items-center justify-center gap-2 w-full text-[14px] font-bold px-5 py-3 rounded-xl bg-amber text-navy hover:bg-amber/90 transition-all hover:-translate-y-0.5"
            >
              Browse all {total} documents
              <ArrowDown
                size={16}
                className="transition-transform group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
