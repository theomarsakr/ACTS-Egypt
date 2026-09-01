"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  sublabel?: string;
  // A pre-rendered icon element (e.g. <Flame size={15} />), not a component
  // reference — component/function references can't cross the Server->Client
  // boundary as props. Lucide icons stroke with currentColor, so the wrapping
  // span below controls its color.
  icon: ReactNode;
  content: ReactNode;
};

export default function Tabs({
  items,
  initialId,
}: {
  items: TabItem[];
  /** Selects the starting tab by TabItem["id"] (e.g. from a deep-linking
   *  query param) instead of always opening the first one. Falls back to 0
   *  when absent or unmatched. */
  initialId?: string;
}) {
  const initialIndex = initialId ? items.findIndex((it) => it.id === initialId) : -1;
  const [active, setActive] = useState(initialIndex >= 0 ? initialIndex : 0);
  /* Bumped on every selection purely to re-fire the panel's entrance
     animation — see the keyed wrapper below. */
  const [gen, setGen] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    setActive(i);
    setGen((g) => g + 1);
  };

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  /* Arrow-key navigation, paired with the roving tabindex below. A
     `role="tablist"` advertises this behaviour to assistive technology, so
     without it the roles were promising something the widget did not do. */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    // In RTL the left/right arrows are expected to follow visual order.
    const rtl = typeof document !== "undefined" && document.dir === "rtl";
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
        next = rtl ? active - 1 : active + 1;
        break;
      case "ArrowLeft":
        next = rtl ? active + 1 : active - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    const wrapped = next < 0 ? last : next > last ? 0 : next;
    select(wrapped);
    tabRefs.current[wrapped]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categories"
        onKeyDown={onKeyDown}
        // scroll-fade-x: this strip carries 6–8 industry/product tabs and
        // starts overflowing around 900px, so on a tablet it gets cut
        // mid-word with the scrollbar hidden and nothing to show there are
        // more. The fade is self-detecting — it only appears on the side
        // that actually has content off-screen (see globals.css), so at
        // desktop widths where every tab fits, nothing changes.
        className="scroll-fade-x flex gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it, i) => {
          const isActive = active === i;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(it.id)}
              aria-selected={isActive}
              aria-controls={panelId(it.id)}
              // Roving tabindex: the tablist is one tab stop, and the arrow
              // keys move within it (WAI-ARIA tabs pattern).
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              className={`group relative flex shrink-0 items-center gap-2 px-4 sm:px-5 py-3.5 text-[14px] sm:text-[15px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive ? "text-navy" : "text-gray-500 hover:text-navy"
              }`}
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                  isActive ? "bg-brand-light text-brand" : "bg-gray-100 text-gray-500 group-hover:text-gray-600"
                }`}
              >
                {it.icon}
              </span>
              {it.label}
              <span
                className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full origin-left bg-brand transition-transform duration-300 ease-out ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {/* EVERY panel is rendered, and the inactive ones are hidden with the
          `hidden` attribute rather than left out of the tree.
          
          This used to render `items[active].content` alone, which meant the
          server-rendered HTML carried exactly one panel and a crawler saw
          nothing else — Googlebot does not click tabs. On /products that hid
          three of the four pillars (actuators & instrumentation, heat
          exchanger & pressure testing, advisory & aftermarket); on
          /industries it hid five of six sectors, so "petrochemical equipment
          egypt", "power plant valves egypt" and "water treatment" had no
          copy on the page at all; on /projects it hid every client list but
          the first. Verified against the built output before and after.
          
          Hidden-but-present content is indexed (Tailwind's preflight gives
          `[hidden]` display:none), which is the whole difference between
          "weighted a little lower" and "not on the page". next/image lazy
          loads by default, so the hidden panels' photography still isn't
          fetched until its tab is opened. */}
      {items.map((it, i) => {
        const isActive = active === i;
        return (
          <div
            key={it.id}
            id={panelId(it.id)}
            role="tabpanel"
            aria-labelledby={tabId(it.id)}
            hidden={!isActive}
            className="pt-10"
          >
            {/* Keyed so selecting a tab remounts just this wrapper and the
                entrance animation replays, exactly as it did when the whole
                panel was mounted on switch. Inactive panels hold a constant
                key, so they never remount. */}
            <div
              key={isActive ? `on-${gen}` : "off"}
              className={isActive ? "animate-page-in" : undefined}
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
