"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * MapEmbed — a facade in front of the Google Maps iframe.
 *
 * The embed is the single heaviest thing on the site and none of it is ours:
 * it pulls ~433KB of Google's JavaScript plus ~87KB of Google's fonts on every
 * /contact visit, which is more script than the entire rest of the site ships
 * across all nine routes combined. It also opens a third-party connection and
 * sets Google cookies before the visitor has asked to see a map, which is a
 * consent question as much as a performance one.
 *
 * `loading="lazy"` did not help. It is only a hint to defer until the frame is
 * near the viewport, and this map sits in the first screen of the contact page
 * — so it was always "near the viewport" and always loaded immediately.
 *
 * So the frame is not rendered until someone asks for it. Until then this is a
 * real button showing the address it would show anyway, drawn in the site's own
 * blueprint language so it reads as a deliberate panel rather than a hole where
 * a map should be. One tap swaps the iframe in, and it stays in.
 *
 * Nothing is lost by not loading it: the address is written out here, and the
 * "Open in Maps" link in the panel header goes straight to the real thing —
 * which on a phone is what people actually want, since it hands off to the
 * native Maps app with directions rather than a pannable rectangle.
 */
export default function MapEmbed({
  src,
  title,
  address,
  loadLabel,
  hint,
}: {
  src: string;
  /** Accessible name for the iframe once loaded. */
  title: string;
  /** Written address, shown on the facade. */
  address: string;
  /** Button label, e.g. "Load map". */
  loadLabel: string;
  /** Small print naming the third party, e.g. "Loads Google Maps". */
  hint: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        src={src}
        className="w-full flex-1 min-h-88 block grayscale-[0.25] transition-[filter] duration-500 hover:grayscale-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative flex w-full flex-1 min-h-88 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50 px-6 py-8 text-center transition-colors hover:bg-brand-light/30"
    >
      {/* Same hairline grid the dark bands use, inverted for a light panel —
          reads as "map surface" without pretending to be a real map. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,22,40,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.05) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(138,106,48,0.10), transparent 70%)",
        }}
      />

      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition-transform group-hover:-translate-y-0.5">
        <MapPin size={20} />
      </span>
      <span className="relative max-w-xs text-[14px] font-semibold leading-snug text-navy">
        {address}
      </span>
      <span className="relative inline-flex min-h-11 items-center rounded-full border border-brand/30 bg-white px-5 text-[14px] font-bold text-brand shadow-sm transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
        {loadLabel}
      </span>
      <span className="relative text-[12px] text-gray-500">{hint}</span>
    </button>
  );
}
