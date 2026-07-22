"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  Layers,
  BookOpen,
  BookMarked,
  Wrench,
  Activity,
  ShieldCheck,
  Languages,
  FileText,
  ClipboardList,
  Award,
  Newspaper,
  FlaskConical,
} from "lucide-react";
import DocCard from "./DocCard";
import type { HubCategory, HubDoc } from "@/lib/brandHub";

const ICONS: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  BookOpen,
  BookMarked,
  Wrench,
  Activity,
  ShieldCheck,
  Languages,
  FileText,
  ClipboardList,
  Award,
  Newspaper,
  FlaskConical,
};

type Props = {
  categories: HubCategory[];
  seriesOptions: { id: string; label: string }[];
  docTypes: string[];
};

export default function ResourceCenter({
  categories,
  seriesOptions,
  docTypes,
}: Props) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("all");
  const [type, setType] = useState("all");
  const [manualOpen, setManualOpen] = useState<Set<string>>(
    () => new Set(categories.slice(0, 2).map((c) => c.slug))
  );

  // Arriving via a "Browse all documents" link (#engineering-resources) opens
  // every category so nothing stays hidden behind a collapsed chevron.
  useEffect(() => {
    const apply = () => {
      if (window.location.hash !== "#engineering-resources") return;
      setManualOpen(new Set(categories.map((c) => c.slug)));
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [categories]);

  const total = useMemo(
    () => categories.reduce((n, c) => n + c.docs.length, 0),
    [categories]
  );

  const q = query.trim().toLowerCase();
  const filtersActive = q !== "" || series !== "all" || type !== "all";

  const matches = (d: HubDoc) => {
    if (series !== "all" && !d.related.includes(series)) return false;
    if (type !== "all" && d.type !== type) return false;
    if (!q) return true;
    return (
      d.title.toLowerCase().includes(q) ||
      (d.ref?.toLowerCase().includes(q) ?? false) ||
      d.type.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.related.some((r) => r.toLowerCase().includes(q))
    );
  };

  const filtered = useMemo(
    () =>
      categories
        .map((c) => ({ ...c, docs: c.docs.filter(matches) }))
        .filter((c) => c.docs.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, q, series, type]
  );

  const visibleCount = filtered.reduce((n, c) => n + c.docs.length, 0);

  const clear = () => {
    setQuery("");
    setSeries("all");
    setType("all");
  };

  return (
    <div>
      {/* Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search catalogs, manuals, bulletins, procedures, doc codes…"
              aria-label="Search engineering resources"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-11 pr-4 py-3 text-[15px] text-navy placeholder:text-gray-400 outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 transition"
            />
          </div>

          <Select
            label="Series"
            value={series}
            onChange={setSeries}
            options={[
              { value: "all", label: "All series" },
              ...seriesOptions.map((s) => ({ value: s.id, label: s.label })),
            ]}
          />
          <Select
            label="Type"
            value={type}
            onChange={setType}
            options={[
              { value: "all", label: "All types" },
              ...docTypes.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-gray-500">
          <span className="tabular-nums">
            {visibleCount} of {total} documents
          </span>
          <button
            type="button"
            onClick={() =>
              setManualOpen(
                manualOpen.size === categories.length
                  ? new Set()
                  : new Set(categories.map((c) => c.slug))
              )
            }
            className="font-semibold text-navy/70 hover:text-navy cursor-pointer"
          >
            {manualOpen.size === categories.length ? "Collapse all" : "Expand all"}
          </button>
          {filtersActive && (
            <button
              type="button"
              onClick={clear}
              className="ml-auto inline-flex items-center gap-1 font-semibold text-brand hover:text-brand-dark cursor-pointer"
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Category accordions */}
      {filtered.length === 0 ? (
        <div className="mt-8 text-center py-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <Layers size={28} className="mx-auto text-gray-400" />
          <p className="mt-3 text-gray-600 font-semibold">
            No documents match your filters.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-3 text-[14px] font-semibold text-brand hover:text-brand-dark cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((c) => {
            const Icon = ICONS[c.icon] ?? FileText;
            const isOpen = filtersActive || manualOpen.has(c.slug);
            return (
              <div
                key={c.slug}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setManualOpen((prev) => {
                      const next = new Set(prev);
                      if (next.has(c.slug)) next.delete(c.slug);
                      else next.add(c.slug);
                      return next;
                    })
                  }
                  aria-expanded={isOpen}
                  disabled={filtersActive}
                  className="flex w-full items-center gap-3.5 p-4 sm:p-5 text-left disabled:cursor-default cursor-pointer"
                >
                  <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-brand-light text-brand ring-1 ring-brand/10">
                    <Icon size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] sm:text-[17px] font-extrabold text-navy">
                      {c.label}
                    </h3>
                    <p className="text-[12.5px] text-gray-400 tabular-nums">
                      {c.docs.length} document{c.docs.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {!filtersActive && (
                    <span
                      className={`shrink-0 grid place-items-center w-8 h-8 rounded-full border transition-all ${
                        isOpen
                          ? "bg-navy text-white border-navy rotate-180"
                          : "bg-white text-navy border-gray-300"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  )}
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen || undefined}>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4 sm:p-5 pt-0 sm:pt-0">
                      {c.docs.map((d) => (
                        <DocCard key={d.href} doc={d} showRelated />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative shrink-0">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-gray-400 pointer-events-none">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Filter by ${label}`}
        className="appearance-none rounded-xl border border-gray-300 bg-gray-50 pl-[4.5rem] pr-9 py-3 text-[14px] font-semibold text-navy outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 transition cursor-pointer max-w-[15rem]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
