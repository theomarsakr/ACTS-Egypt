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
import { useHydrated, usePublishHeaderHeight } from "@/lib/hooks";
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
  // Gates the portalled mobile menu below; see lib/hooks.ts.
  const mounted = useHydrated();
  const pathname = usePathname();
  // Active-state checks compare the canonical (locale-stripped) path so the
  // same link highlights on both /contact and /ar/contact.
  const path = stripLocale(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticking = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  // Publishes --header-h so .scroll-anchor and anything else offset against
  // the header tracks its real height instead of a hard-coded guess — which
  // matters once the utility bar's `hidden xl:block` comes off (see 3.A) and
  // the header's height starts differing across renders.
  usePublishHeaderHeight(headerRef);

  const links = [
    { href: "/industries", label: t.industries },
    { href: "/products", label: t.products },
    { href: "/projects", label: t.projects },
    { href: "/contact", label: t.contact },
  ];

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
    /* `-top-11` below `sm` is the utility bar's own height (min-h-11 = 44px,
       pinned deterministically below), negated. A sticky element with a
       negative top scrolls up by exactly that much before it pins, so on a
       phone the ink contact bar rides off the top edge and the nav row alone
       stays parked at y=0 — 44px of a 664px viewport handed back the moment
       the reader scrolls, without the bar having to be deleted from the
       markup or the nav having to move out of <header> (a sticky child only
       sticks for as long as its own containing block is on screen, so a nav
       left inside a header this short would unstick almost immediately).
       `sm:top-0` from 640px up: desktop keeps the whole header pinned. */
    <header ref={headerRef} className="sticky -top-11 sm:top-0 z-50">
      {/* Every breakpoint below is xl (1280px), not the usual md — the full
          link row (logo + 6 links + language switcher + CTA) genuinely needs
          that much width. Below it, down to md, the row wraps onto a second
          line inside its fixed-height h-17 bar instead of growing to fit,
          which reads as broken, not responsive. The hamburger menu covers
          that whole range instead, all the way from phone widths up to
          where the full row actually fits. */}
      {/* Utility bar. Visible at every width — the phone/email it carries used
          to be `hidden xl:block` with no mobile-menu fallback, so below
          1280px they were simply gone. ONE row at every width: below `sm` it
          used to stack into two (contact links, then the tagline) and that
          stack, at 99px, was more than half the header on a phone. The
          tagline now drops out below `sm` instead (see below) and the links
          alone fit the single row they always fit at `sm:` and up.

          `min-h-11` below `sm` is deliberate and load-bearing in two ways: it
          is the 44px touch floor for the two links, AND it makes the bar a
          known, pointer-independent height, which is what the header's
          `-top-11` sticky offset is measured against. Do not let this bar's
          phone height drift from that offset without changing both.

          `sm:min-h-9`, not `sm:h-9`: at 36px fixed the bar was shorter than
          the 44px .tap-target overlay on the two links, so the bottom of that
          overlay fell outside the bar and was painted over by the nav row
          below it (a later sibling, so it wins the stacking order). The links
          were reachable across ~36px, not 44 — which is what the coarse-pointer
          sweep in tests/responsive.spec.ts hit-tests for, and why it failed on
          every route at tablet width but not at phone width, where the bar
          already stacks taller. The links carry `pointer-coarse:min-h-11` and
          the bar grows to fit them; fine-pointer widths are unchanged. */}
      <div className="bg-ink text-white/80 text-[13px]">
        <div className="max-w-7xl mx-auto px-4 xs:px-6 min-h-11 sm:min-h-9 flex items-center justify-between gap-1 sm:gap-0">
          {/* `px-4 xs:px-6` on the row above and `gap-x-3` here are both for
              320px (iPhone SE 1st gen, Galaxy Fold cover screen): at the
              desktop 24px gutter and 20px gap the two links total ~276px
              against 272px of room, wrap to a second line, and take the bar
              to 92px — which then no longer matches the header's -top-11
              sticky offset, leaving half the ink bar stranded on screen.
              12px of gap and a 16px gutter below `xs` fit them on one line
              with ~20px to spare; 424px and up is unchanged. */}
          <div className="flex flex-wrap items-center gap-x-3 xs:gap-x-5 gap-y-1">
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="tap-target inline-flex items-center pointer-coarse:min-h-11 gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} /> <span className="ltr-inline">{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.salesEmail}`}
              className="tap-target inline-flex items-center pointer-coarse:min-h-11 gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} /> {contact.salesEmail}
            </a>
          </div>
          {/* `hidden sm:block`, not `sm:` sizing: below 640px this wraps to two
              lines and was the single largest block of chrome on a phone —
              and it is duplicated verbatim three times over, in the mobile
              menu panel's footer (below), in the site footer, and on the
              homepage in the hero badge directly beneath this bar. Nothing is
              lost on a phone; a screenful is gained. */}
          <div className="hidden sm:block text-white/60 tracking-[0.14em] uppercase text-[11.5px]">
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
        data-pinned-chrome
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg shadow-navy/8 border-b border-gray-200/60"
            : "bg-white/95 border-b border-gray-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-14 sm:h-17 flex items-center justify-between">
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
                /* Chrome, not content: it wants to be there on first paint but
                   it is never the LCP, so it loads eagerly without taking a
                   preload slot from the page's own hero. */
                loading="eager"
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

              <Link
                href={localeHref(lang, "/about")}
                className={`nav-underline text-[15px] font-semibold transition-colors ${
                  path.startsWith("/about") ? "text-navy active" : "text-gray-600 hover:text-navy"
                }`}
              >
                {t.about}
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
            works around by portaling).

            `top-[var(--header-h)]` (not the old hard-coded `top-17`): the
            utility bar above is visible at every width now instead of only
            >=1280px, so the header's real height varies with viewport width
            and locale. Anchoring to the published height keeps the panel
            flush under the header instead of overlapping it. */}
        {mounted && createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="xl:hidden fixed inset-x-0 top-(--header-h,4.25rem) bottom-0 z-50 overflow-y-auto border-t border-gray-100 bg-white"
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

                <motion.div variants={menuItem} initial="hidden" animate="show" custom={1}>
                  <Link
                    href={localeHref(lang, "/about")}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-[15px] font-semibold border-b border-gray-100 ${
                      path.startsWith("/about") ? "text-navy" : "text-gray-600"
                    }`}
                  >
                    {t.about}
                  </Link>
                </motion.div>

                <motion.div
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  custom={2}
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
                    custom={i + 3}
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
                  custom={links.length + 3}
                >
                  <Link
                    href={localeHref(lang, "/quote")}
                    onClick={() => setOpen(false)}
                    className="btn btn-primary w-full my-3 px-5 py-3 text-[15px]"
                  >
                    {t.requestQuote}
                  </Link>
                </motion.div>

                {/* Mirrors the utility bar's contact links + tagline right
                    by the CTA, so they're reachable at the point of decision
                    without the visitor scrolling back up to the header. */}
                <motion.div
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  custom={links.length + 4}
                  className="mt-1 pt-4 border-t border-gray-100 flex flex-col gap-2.5"
                >
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="tap-target inline-flex items-center gap-2 text-[14px] font-semibold text-gray-600 hover:text-navy transition-colors"
                  >
                    <Phone size={15} /> <span className="ltr-inline">{contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${contact.salesEmail}`}
                    className="tap-target inline-flex items-center gap-2 text-[14px] font-semibold text-gray-600 hover:text-navy transition-colors"
                  >
                    <Mail size={15} /> {contact.salesEmail}
                  </a>
                  <div className="text-[11px] text-gray-400 tracking-[0.14em] uppercase">
                    {t.tagline}
                  </div>
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
