"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { getDict, localeHref, type Locale } from "@/lib/i18n";

export type DockSection = {
  /** Must match the `id` on that section's element (see `scroll-mt-28`
      convention: every targetable section needs it, so the sticky header
      doesn't cover the heading when the dock jumps there). */
  id: string;
  label: string;
  /** A pre-rendered icon element (e.g. <Gauge className="h-full w-full" />),
      not a component reference — component/function references can't cross
      the Server->Client boundary as props (same reason <Tabs>'s TabItem.icon
      is shaped this way). */
  icon: ReactNode;
};

/**
 * SiteDock — a floating quick-jump dock, scoped to *this page's own*
 * content rather than mirroring the header's site-wide nav. Each page
 * passes the handful of sections that are actually on it (see the
 * `sections` prop at each call site); the dock has no destinations of its
 * own beyond that, plus a persistent "Request a quote" CTA. Shown on every
 * page except the brand detail pages, which already have their own
 * bespoke navigation.
 *
 * The item for whichever section is currently scrolled into view gets
 * tinted, tracked via IntersectionObserver (a standard scrollspy) rather
 * than the page route — there's only one route here, the sections are
 * anchors within it.
 */
export default function SiteDock({
  lang = "en",
  sections,
}: {
  lang?: Locale;
  sections: DockSection[];
}) {
  const dict = getDict(lang);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Topmost intersecting section — the one the reader is actually at.
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        setActiveId(top.target.id);
      },
      // Counts a section "current" once it's crossed into the upper 40% of
      // the viewport (below the sticky header), rather than requiring it to
      // fill the whole screen.
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <Dock label={lang === "ar" ? "تصفح سريع" : "Quick navigation"}>
      {sections.map((s) => (
        <DockItem key={s.id} href={`#${s.id}`} label={s.label} active={activeId === s.id}>
          <DockIcon>{s.icon}</DockIcon>
          <DockLabel>{s.label}</DockLabel>
        </DockItem>
      ))}
      {/* The CTA: brand-brass gradient (same BRAND_BG as <ShimmerButton>
          elsewhere), not flat amber — amber is reserved for kickers/accents
          on dark bands, and using it as a solid fill here read as far more
          saturated than every other "Request a quote" button on the site. */}
      <DockItem
        href={localeHref(lang, "/quote")}
        label={dict.nav.requestQuote}
        className="bg-linear-to-br from-[#a37d3a] via-brand to-brand-dark text-white shadow-[0_10px_28px_-10px_rgba(138,106,48,0.55)] hover:text-white hover:brightness-110 focus-visible:text-white focus-visible:brightness-110"
      >
        <DockIcon>
          <ArrowUpRight className="h-full w-full" strokeWidth={2.25} />
        </DockIcon>
        <DockLabel>{dict.nav.requestQuote}</DockLabel>
      </DockItem>
    </Dock>
  );
}
