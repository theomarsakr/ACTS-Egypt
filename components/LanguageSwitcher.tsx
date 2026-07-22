"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { arRoutes, stripLocale, type Locale } from "@/lib/i18n/routing";

const languages: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "ع" },
];

/* Globe dropdown language selector. Listing languages by name (in their own
   script) is the pattern bilingual visitors expect, and it scales if more
   locales are added later. Switching maps the current path to its twin in the
   other language; untranslated Arabic pages fall back to the Arabic homepage. */
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function hrefFor(code: Locale): string {
    const base = stripLocale(pathname);
    if (code === "en") return base;
    // Arabic: go to the translated twin, else the Arabic homepage.
    return arRoutes.has(base) ? (base === "/" ? "/ar" : `/ar${base}`) : "/ar";
  }

  function select(code: Locale) {
    setOpen(false);
    if (code !== lang) router.push(hrefFor(code));
  }

  const current = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-[13.5px] font-semibold text-gray-600 transition-colors hover:border-brand/40 hover:text-brand"
      >
        <Globe size={15} />
        {current.short}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Language"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute end-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-xl shadow-navy/10 backdrop-blur-xl"
          >
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === lang}
                  onClick={() => select(l.code)}
                  // Each label renders in its own script and direction.
                  dir={l.code === "ar" ? "rtl" : "ltr"}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-[14px] transition-colors hover:bg-gray-50 ${
                    l.code === lang
                      ? "font-bold text-navy"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {l.label}
                  {l.code === lang && <Check size={15} className="text-brand" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
