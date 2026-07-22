"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  CheckCircle2,
  Zap,
  Info,
  Table2,
  FileText,
  BadgeCheck,
  Factory,
  Droplets,
  Boxes,
  ArrowUpRight,
  Link2,
} from "lucide-react";
import DocCard from "./DocCard";
import type { HubProduct, HubDoc, HubGroup } from "@/lib/brandHub";

type ProductWithDocs = HubProduct & { docs: HubDoc[] };

export default function ProductHub({
  products,
  groups,
  industries,
}: {
  products: ProductWithDocs[];
  groups: HubGroup[];
  industries: string[];
}) {
  const groupChips: HubGroup[] = [{ id: "all", label: "All products" }, ...groups];
  const [group, setGroup] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [focusTab, setFocusTab] = useState<string | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);

  const visible = products.filter((p) => group === "all" || p.group === group);

  const openProduct = (id: string) => {
    setGroup("all");
    setOpenId(id);
    requestAnimationFrame(() => {
      document
        .getElementById(`hub-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Deep-link support: `#hub-<id>` opens that product on its Documentation tab.
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#hub-")) return;
      const id = hash.slice("#hub-".length);
      if (!products.some((p) => p.id === id)) return;
      setGroup("all");
      setOpenId(id);
      setFocusTab("docs");
      setFocusNonce((n) => n + 1);
      requestAnimationFrame(() => {
        document
          .getElementById(`hub-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [products]);

  return (
    <div>
      {/* Group filter */}
      <div className="flex flex-wrap gap-2">
        {groupChips.map((g) => {
          const active = group === g.id;
          const count =
            g.id === "all"
              ? products.length
              : products.filter((p) => p.group === g.id).length;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                active
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-navy/70 hover:bg-gray-200"
              }`}
            >
              {g.label}
              <span
                className={`tabular-nums text-[12px] ${
                  active ? "text-white/60" : "text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {visible.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            open={openId === p.id}
            onToggle={() => setOpenId(openId === p.id ? null : p.id)}
            onOpenRelated={openProduct}
            allProducts={products}
            industries={industries}
            focusTab={openId === p.id ? focusTab : null}
            focusNonce={focusNonce}
          />
        ))}
      </div>
    </div>
  );
}

// ── Product row (collapsible hub) ───────────────────────────────────────────

function ProductRow({
  product: p,
  open,
  onToggle,
  onOpenRelated,
  allProducts,
  industries,
  focusTab,
  focusNonce,
}: {
  product: ProductWithDocs;
  open: boolean;
  onToggle: () => void;
  onOpenRelated: (id: string) => void;
  allProducts: ProductWithDocs[];
  industries: string[];
  focusTab: string | null;
  focusNonce: number;
}) {
  return (
    <div
      id={`hub-${p.id}`}
      className={`scroll-mt-40 overflow-hidden rounded-3xl border bg-white transition-all ${
        open
          ? "border-brand/40 shadow-xl shadow-navy/5"
          : "border-gray-200 shadow-sm hover:border-brand/30 hover:shadow-md"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
      >
        <span className="relative shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200">
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="80px"
            className="object-contain p-1.5"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-navy px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
              {p.code}
            </span>
            {p.standard && (
              <span className="rounded-md bg-brand-light px-2 py-0.5 text-[11px] font-bold tracking-wide text-brand-dark">
                {p.standard}
              </span>
            )}
            <span className="text-[12px] font-semibold text-gray-400">
              {p.family}
            </span>
          </div>
          <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-navy leading-tight">
            {p.name}
          </h3>
          <p className="mt-0.5 text-[13.5px] text-gray-500 line-clamp-1">
            {p.tagline}
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          {p.docs.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand">
              <FileText size={13} /> {p.docs.length} doc
              {p.docs.length === 1 ? "" : "s"}
            </span>
          )}
          <span className="text-[12px] font-semibold text-gray-400">
            {p.features.length} feature{p.features.length === 1 ? "" : "s"}
          </span>
        </div>
        <span
          className={`shrink-0 grid place-items-center w-9 h-9 rounded-full border transition-all ${
            open
              ? "bg-brand text-white border-brand rotate-180"
              : "bg-white text-navy border-gray-300"
          }`}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {/* Expandable panel — CSS grid-rows height animation, content stays in DOM */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open || undefined}>
          {/* Remount (via key) when a deep-link focus request arrives so the
              panel opens on the requested tab — no setState-in-effect needed. */}
          <ProductPanel
            key={focusTab ? `focus-${focusNonce}` : "base"}
            product={p}
            onOpenRelated={onOpenRelated}
            allProducts={allProducts}
            industries={industries}
            initialTab={focusTab ?? "overview"}
          />
        </div>
      </div>
    </div>
  );
}

// ── Expanded content: gallery + tabs ────────────────────────────────────────

function ProductPanel({
  product: p,
  onOpenRelated,
  allProducts,
  industries,
  initialTab = "overview",
}: {
  product: ProductWithDocs;
  onOpenRelated: (id: string) => void;
  allProducts: ProductWithDocs[];
  industries: string[];
  initialTab?: string;
}) {
  const tabs = [
    { id: "overview", label: "Overview", icon: <Info size={15} /> },
    { id: "specs", label: "Specifications", icon: <Table2 size={15} /> },
    {
      id: "docs",
      label: "Documentation",
      icon: <FileText size={15} />,
      badge: p.docs.length,
    },
    ...(p.certifications?.length
      ? [{ id: "certs", label: "Certifications", icon: <BadgeCheck size={15} /> }]
      : []),
  ];
  const [tab, setTab] = useState(
    tabs.some((t) => t.id === initialTab) ? initialTab : "overview"
  );

  const related = (p.related ?? [])
    .map((id) => allProducts.find((x) => x.id === id))
    .filter((x): x is ProductWithDocs => Boolean(x));

  return (
    <div className="border-t border-gray-100 p-5 sm:p-7">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] gap-7">
        <Gallery images={p.images} name={p.name} />

        <div className="min-w-0">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label={`${p.name} details`}
            className="flex gap-1 overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-[13.5px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active ? "text-navy" : "text-gray-400 hover:text-navy"
                  }`}
                >
                  <span className={active ? "text-brand" : ""}>{t.icon}</span>
                  {t.label}
                  {"badge" in t && typeof t.badge === "number" && t.badge > 0 && (
                    <span className="ml-0.5 rounded-full bg-brand-light px-1.5 text-[11px] font-bold text-brand tabular-nums">
                      {t.badge}
                    </span>
                  )}
                  <span
                    className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-brand transition-transform origin-left ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          <div className="pt-5">
            {tab === "overview" && (
              <OverviewTab product={p} industries={industries} />
            )}
            {tab === "specs" && <SpecsTab product={p} />}
            {tab === "docs" && <DocsTab product={p} />}
            {tab === "certs" && p.certifications && (
              <CertsTab certifications={p.certifications} />
            )}
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-7 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <Link2 size={13} /> Related products
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {related.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onOpenRelated(r.id)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-navy transition-all hover:border-brand hover:bg-brand-light/50 cursor-pointer"
                  >
                    {r.name}
                    <ArrowUpRight
                      size={13}
                      className="text-gray-400 group-hover:text-brand transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-contain p-4"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square w-16 overflow-hidden rounded-lg bg-white ring-1 transition-all cursor-pointer ${
                i === active
                  ? "ring-2 ring-brand"
                  : "ring-gray-200 hover:ring-brand/40"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewTab({
  product: p,
  industries,
}: {
  product: ProductWithDocs;
  industries: string[];
}) {
  return (
    <div className="space-y-6">
      <p className="text-[15px] text-gray-600 leading-relaxed">{p.overview}</p>

      <div>
        <SectionLabel icon={<CheckCircle2 size={14} />}>Key Features</SectionLabel>
        <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {p.features.map((f) => (
            <li
              key={f}
              className="flex gap-2 text-[14px] text-gray-600 leading-snug"
            >
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {p.benefits && p.benefits.length > 0 && (
        <div>
          <SectionLabel icon={<Zap size={14} />}>Engineering Benefits</SectionLabel>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {p.benefits.map((b) => (
              <div
                key={b}
                className="flex gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 p-3.5"
              >
                <Zap size={16} className="mt-0.5 shrink-0 text-amber" />
                <span className="text-[13.5px] text-gray-600 leading-snug">{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {p.service && p.service.length > 0 && (
          <div>
            <SectionLabel icon={<Droplets size={14} />}>Service &amp; Media</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.service.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        )}
        {p.models && p.models.length > 0 && (
          <div>
            <SectionLabel icon={<Boxes size={14} />}>Models</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.models.map((m) => (
                <Badge key={m}>{m}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <SectionLabel icon={<Factory size={14} />}>Industries</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {industries.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpecsTab({ product: p }: { product: ProductWithDocs }) {
  if (p.specs && p.specs.length > 0) {
    return (
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-100">
              {p.specs.map((s, i) => (
                <tr
                  key={s.label}
                  className={i % 2 ? "bg-gray-50/50" : "bg-white"}
                >
                  <th
                    scope="row"
                    className="w-2/5 px-4 py-3 align-top text-[12px] font-bold uppercase tracking-wide text-gray-500"
                  >
                    {s.label}
                  </th>
                  <td className="px-4 py-3 text-[14px] text-navy font-medium">
                    {s.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12.5px] text-gray-400">
          Specifications transcribed from the manufacturer datasheet. Confirm final
          selection with the product catalog or on request.
        </p>
      </div>
    );
  }
  const primary = p.docs[0];
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
      <Table2 size={26} className="mx-auto text-gray-400" />
      <p className="mt-3 text-[14.5px] font-semibold text-navy">
        Full specifications in the product documentation
      </p>
      <p className="mt-1 text-[13px] text-gray-500 max-w-md mx-auto">
        Sizing, ratings and dimensional data for the {p.name} are provided in the
        product documentation and on request.
      </p>
      {primary && (
        <a
          href={primary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-[13px] font-bold text-white hover:bg-navy-700 transition-colors"
        >
          <FileText size={14} /> Open {p.code} document
        </a>
      )}
    </div>
  );
}

function DocsTab({ product: p }: { product: ProductWithDocs }) {
  if (p.docs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
        <FileText size={26} className="mx-auto text-gray-400" />
        <p className="mt-3 text-[14.5px] font-semibold text-navy">
          Documentation on request
        </p>
        <p className="mt-1 text-[13px] text-gray-500 max-w-md mx-auto">
          Product-specific literature for the {p.name} is available on request, or
          browse the Engineering Resource Center below.
        </p>
        <a
          href="#engineering-resources"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13px] font-bold text-navy hover:border-brand hover:text-brand transition-colors"
        >
          Browse Resource Center
        </a>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {p.docs.map((d) => (
        <DocCard key={d.href} doc={d} />
      ))}
    </div>
  );
}

function CertsTab({ certifications }: { certifications: string[] }) {
  return (
    <div>
      <SectionLabel icon={<BadgeCheck size={14} />}>
        Certifications &amp; Standards
      </SectionLabel>
      <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
        {certifications.map((c) => (
          <div
            key={c}
            className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3"
          >
            <BadgeCheck size={17} className="shrink-0 text-brand" />
            <span className="text-[13.5px] font-medium text-navy leading-snug">
              {c}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
      {icon}
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-[12.5px] font-medium text-navy/75">
      {children}
    </span>
  );
}
