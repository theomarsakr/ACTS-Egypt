"use client";

import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  ExternalLink,
  X,
  Globe,
  Layers,
} from "lucide-react";
import type { BrandDocuments } from "@/lib/documents";

type Props = { brands: BrandDocuments[] };

const NEUTRAL = "__en";

export default function DocumentLibrary({ brands }: Props) {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [langFilter, setLangFilter] = useState<string>("all");

  const total = useMemo(
    () => brands.reduce((n, b) => n + b.total, 0),
    [brands]
  );

  // Distinct languages across every document, for the language dropdown.
  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const b of brands)
      for (const c of b.categories)
        for (const d of c.docs) if (d.lang) set.add(d.lang);
    return [...set].sort();
  }, [brands]);

  const q = query.trim().toLowerCase();

  // Apply all three filters, dropping empty categories and brands.
  const filtered = useMemo(() => {
    return brands
      .filter((b) => brandFilter === "all" || b.slug === brandFilter)
      .map((b) => {
        const categories = b.categories
          .map((c) => {
            const docs = c.docs.filter((d) => {
              if (langFilter === NEUTRAL && d.lang) return false;
              if (langFilter !== "all" && langFilter !== NEUTRAL && d.lang !== langFilter)
                return false;
              if (!q) return true;
              return (
                d.title.toLowerCase().includes(q) ||
                (d.ref?.toLowerCase().includes(q) ?? false) ||
                c.label.toLowerCase().includes(q) ||
                b.name.toLowerCase().includes(q)
              );
            });
            return { ...c, docs };
          })
          .filter((c) => c.docs.length > 0);
        const count = categories.reduce((n, c) => n + c.docs.length, 0);
        return { ...b, categories, count };
      })
      .filter((b) => b.categories.length > 0);
  }, [brands, brandFilter, langFilter, q]);

  const visibleCount = useMemo(
    () => filtered.reduce((n, b) => n + b.count, 0),
    [filtered]
  );

  const hasFilters = q !== "" || brandFilter !== "all" || langFilter !== "all";

  return (
    <div>
      {/* Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brochures, catalogs, procedures, doc codes…"
              aria-label="Search documents"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-11 pr-4 py-3 text-[15px] text-navy placeholder:text-gray-400 outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 transition"
            />
          </div>

          {/* Language */}
          <div className="relative shrink-0">
            <Globe
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              aria-label="Filter by language"
              className="appearance-none rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-9 py-3 text-[14px] font-semibold text-navy outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 transition cursor-pointer"
            >
              <option value="all">All languages</option>
              <option value={NEUTRAL}>English</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              ▾
            </span>
          </div>
        </div>

        {/* Brand pills + count */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterPill
            active={brandFilter === "all"}
            onClick={() => setBrandFilter("all")}
          >
            All brands
          </FilterPill>
          {brands.map((b) => (
            <FilterPill
              key={b.slug}
              active={brandFilter === b.slug}
              onClick={() => setBrandFilter(b.slug)}
            >
              {b.name}
            </FilterPill>
          ))}

          <div className="ml-auto flex items-center gap-3 text-[13px] text-gray-500">
            <span className="tabular-nums">
              {visibleCount} of {total} documents
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setBrandFilter("all");
                  setLangFilter("all");
                }}
                className="inline-flex items-center gap-1 font-semibold text-brand hover:text-brand-dark cursor-pointer"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-10 text-center py-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <Layers size={28} className="mx-auto text-gray-400" />
          <p className="mt-3 text-gray-600 font-semibold">No documents match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setBrandFilter("all");
              setLangFilter("all");
            }}
            className="mt-3 text-[14px] font-semibold text-brand hover:text-brand-dark cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {filtered.map((b) => (
            <section key={b.slug} id={b.anchor} className="scroll-mt-24">
              <div className="flex items-baseline gap-3 border-b border-gray-200 pb-3">
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-navy">
                  {b.name}
                </h3>
                <span className="text-[13px] font-semibold text-gray-400 tabular-nums">
                  {b.count} document{b.count === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-7 space-y-9">
                {b.categories.map((c) => (
                  <div key={c.slug}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-px bg-brand/50 shrink-0" />
                      <h4 className="text-sm font-bold text-navy uppercase tracking-wide">
                        {c.label}
                      </h4>
                      <span className="text-[13px] text-gray-400 tabular-nums">
                        {c.docs.length}
                      </span>
                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {c.docs.map((d) => (
                        <a
                          key={d.href}
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 hover:border-brand/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                          <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-brand-light text-brand">
                            <FileText size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-semibold text-navy leading-snug line-clamp-2">
                              {d.title}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-400">
                              <span className="font-semibold">PDF</span>
                              {d.ref && <span className="tabular-nums">{d.ref}</span>}
                              {d.lang && (
                                <span className="rounded-full bg-amber/15 px-1.5 py-px font-semibold text-brand-dark">
                                  {d.lang}
                                </span>
                              )}
                            </span>
                          </span>
                          <ExternalLink
                            size={15}
                            className="shrink-0 text-gray-300 group-hover:text-brand transition-colors"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer ${
        active
          ? "bg-navy text-white"
          : "bg-gray-100 text-navy/70 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
