"use client";

import { useState, type ReactNode } from "react";

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
  const current = items[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categories"
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
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
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
      <div key={current.id} className="pt-10 animate-page-in">
        {current.content}
      </div>
    </div>
  );
}
