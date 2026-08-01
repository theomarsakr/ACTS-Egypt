"use client";

import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Phone, Mail, ChevronDown, ArrowRight } from "lucide-react";
import { contact, brands } from "@/lib/data";
import { localeHref, stripLocale, type Locale } from "@/lib/i18n/routing";
import type { Dict } from "@/lib/i18n/en";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const menuItem = {
  hidden: { opacity: 0, x: -14 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Navbar({
  lang = "en",
  t,
}: {
  lang?: Locale;
  t: Dict["nav"];
}) {
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  // Active-state checks compare the canonical (locale-stripped) path so the
  // same link highlights on both /contact and /ar/contact.
  const path = stripLocale(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticking = useRef(false);

  const links = [
    { href: "/about", label: t.about },
    { href: "/industries", label: t.industries },
    { href: "/products", label: t.products },
    { href: "/projects", label: t.projects },
    { href: "/contact", label: t.contact },
  ];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking.current = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openProducts() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(true);
  }

  function scheduleCloseProducts() {
    closeTimer.current = setTimeout(() => setProductsOpen(false), 150);
  }

  // The mobile menu is a fixed full-screen panel (see below) rather than an
  // in-flow dropdown, so it fully covers the page behind it — including the
  // floating SiteDock — instead of leaving a sliver of hero/dock visible
  // under a short dropdown. Lock background scroll to match: without this,
  // touch-dragging on the panel's own content still scrolls the page underneath.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Every breakpoint below is xl (1280px), not the usual md — the full
          link row (logo + 6 links + language switcher + CTA) genuinely needs
          that much width. Below it, down to md, the row wraps onto a second
          line inside its fixed-height h-17 bar instead of growing to fit,
          which reads as broken, not responsive. The hamburger menu covers
          that whole range instead, all the way from phone widths up to
          where the full row actually fits. */}
      {/* Utility bar */}
      <div className="bg-ink text-white/80 text-[13px] hidden xl:block">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} /> <span className="ltr-inline">{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.salesEmail}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} /> {contact.salesEmail}
            </a>
          </div>
          <div className="text-white/60 tracking-[0.14em] uppercase text-[11.5px]">
            {t.tagline}
          </div>
        </div>
      </div>

      {/* Main nav. Solid, not glass — was `backdrop-blur-2xl` over `bg-white/70`
          (`/85` once scrolled).

          This is a hardening measure, not a confirmed fix for the reported
          overlap — be precise about that distinction if it comes up again.
          What's true: `position: sticky` + `backdrop-filter` genuinely can
          desync from the content scrolling under it, reproduced here with a
          scripted instant jump of the scroll position — `getBoundingClientRect`
          kept reporting this nav at `top: 0` while the paint didn't follow,
          landing on a blank frame repeatedly. What's NOT established: that this
          is what the user actually saw. The same instant-jump script produced
          an identical blank frame on a *solid* `bg-white` nav with no
          `backdrop-filter` at all, and — decisively — 15/15 clean runs with no
          blank frame either way once the scroll was driven realistically
          (many small `requestAnimationFrame` steps, the way a touch flick or
          this site's own `scroll-behavior: smooth` actually moves the page).
          So the blank-frame repro is real but keyed to an artificial scroll
          pattern no real interaction produces, not to `backdrop-filter`
          specifically — meaning the original report's cause is still open.
          Kept the change anyway: a solid nav cannot go blank the way a
          blurred one theoretically could, it costs nothing, and it's the
          right default for chrome that's on screen for the entire visit.
          Same reasoning applied to <Dock> and <FloatingNav>, the only other
          `fixed`/`sticky` chrome on the site; left alone everywhere else
          (dropdowns, lightboxes, hover tooltips), since those aren't pinned
          on screen against a continuously moving background the way
          persistent nav chrome is. */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg shadow-navy/8 border-b border-gray-200/60"
            : "bg-white/95 border-b border-gray-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-17 flex items-center justify-between">
            {/* tap-target: the wordmark is 124×36 painted, and "home" is the
                one destination present on every page at every width, so it is
                worth the 8px of invisible height on touch. Isolated in the bar
                — nothing else is within 44px of it — so the overlay can spill
                without stealing from a neighbour. */}
            <Link
              href={localeHref(lang, "/")}
              className="tap-target flex items-center"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo-transparent.png"
                alt="ACTS: Advanced Company for Trading Services"
                width={124}
                height={41}
                className="h-9 w-auto"
                priority
              />
            </Link>

            <div className="hidden xl:flex items-center gap-6">
              <Link
                href={localeHref(lang, "/")}
                className={`nav-underline text-[15px] font-semibold transition-colors ${
                  path === "/" ? "text-navy active" : "text-gray-600 hover:text-navy"
                }`}
              >
                {t.home}
              </Link>

              <div
                className="relative"
                onMouseEnter={openProducts}
                onMouseLeave={scheduleCloseProducts}
              >
                <Link
                  href="/brands"
                  className={`nav-underline inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    path.startsWith("/brands")
                      ? "text-navy active"
                      : "text-gray-600 hover:text-navy"
                  }`}
                >
                  {t.ourBrands}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72"
                    >
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl shadow-navy/10 overflow-hidden">
                        {brands.map((b) => (
                          <Link
                            key={b.slug}
                            href={`/brands/${b.slug}`}
                            className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          >
                            <div className="text-[14px] font-bold text-navy">
                              {b.name}
                            </div>
                            <div className="text-[12.5px] text-gray-500 mt-0.5">
                              {b.category}
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/brands"
                          className="block px-4 py-3 text-[14px] font-semibold text-brand hover:bg-brand-light transition-colors"
                        >
                          {t.viewAllBrands}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map((l) => (
                <Link
                  key={l.href}
                  href={localeHref(lang, l.href)}
                  className={`nav-underline text-[15px] font-semibold transition-colors ${
                    path.startsWith(l.href)
                      ? "text-navy active"
                      : "text-gray-600 hover:text-navy"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <LanguageSwitcher lang={lang} />
              <Link
                href={localeHref(lang, "/quote")}
                className="btn btn-primary text-[14.5px] px-5 py-2.5 group"
              >
                {t.requestQuote}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 -mr-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                />
              </Link>
            </div>

            <div className="xl:hidden flex items-center gap-2">
              <LanguageSwitcher lang={lang} />
              <button
                // p-2 puts a 24px icon in a 40px box — under the 44px touch
                // floor, and this button is the only way to reach the nav at
                // every width below xl, tablets included.
                className="text-navy p-2 pointer-coarse:p-2.5"
                onClick={() => setOpen(!open)}
                aria-label={t.toggleMenu}
                aria-expanded={open}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Portaled to document.body: `nav` above carries `backdrop-blur-2xl`
            (a `backdrop-filter`), which — like `transform`/`filter` — makes it
            a containing block for `position: fixed` descendants. Left nested
            here, this panel's `bottom-0` would resolve against the navbar's
            own ~68px box instead of the viewport (same trap <Dock> already
            works around by portaling). */}
        {mounted && createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="xl:hidden fixed inset-x-0 top-17 bottom-0 z-50 overflow-y-auto border-t border-gray-100 bg-white"
              >
              <div className="px-6 py-3 flex flex-col">
                <motion.div variants={menuItem} initial="hidden" animate="show" custom={0}>
                  <Link
                    href={localeHref(lang, "/")}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-[15px] font-semibold border-b border-gray-100 ${
                      path === "/" ? "text-navy" : "text-gray-600"
                    }`}
                  >
                    {t.home}
                  </Link>
                </motion.div>

                <motion.div
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  custom={1}
                  className="border-b border-gray-100"
                >
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className={`w-full flex items-center justify-between py-3 text-[15px] font-semibold ${
                      path.startsWith("/brands") ? "text-navy" : "text-gray-600"
                    }`}
                  >
                    {t.ourBrands}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        mobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileProductsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3 ps-3 flex flex-col gap-1">
                          {brands.map((b) => (
                            <Link
                              key={b.slug}
                              href={`/brands/${b.slug}`}
                              onClick={() => setOpen(false)}
                              className="py-2 text-[14px] text-gray-600 hover:text-navy"
                            >
                              {b.name}
                            </Link>
                          ))}
                          <Link
                            href="/brands"
                            onClick={() => setOpen(false)}
                            className="py-2 text-[14px] font-semibold text-brand"
                          >
                            {t.viewAllBrands}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    variants={menuItem}
                    initial="hidden"
                    animate="show"
                    custom={i + 2}
                  >
                    <Link
                      href={localeHref(lang, l.href)}
                      onClick={() => setOpen(false)}
                      className={`block py-3 text-[15px] font-semibold border-b border-gray-100 ${
                        path.startsWith(l.href) ? "text-navy" : "text-gray-600"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  custom={links.length + 2}
                >
                  <Link
                    href={localeHref(lang, "/quote")}
                    onClick={() => setOpen(false)}
                    className="btn btn-primary w-full my-3 px-5 py-3 text-[15px]"
                  >
                    {t.requestQuote}
                  </Link>
                </motion.div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </nav>
    </header>
  );
}
