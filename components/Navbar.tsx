"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Phone, Mail, ChevronDown, ArrowRight } from "lucide-react";
import { contact, brands } from "@/lib/data";

const links = [
  { href: "/about", label: "About us" },
  { href: "/industries", label: "Industries" },
  { href: "/products", label: "Products & Services" },
  { href: "/projects", label: "Projects & Clients" },
  { href: "/contact", label: "Contact" },
];

const menuItem = {
  hidden: { opacity: 0, x: -14 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticking = useRef(false);

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

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-ink text-white/80 text-[13px] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} /> {contact.phone}
            </a>
            <a
              href={`mailto:${contact.salesEmail}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} /> {contact.salesEmail}
            </a>
          </div>
          <div className="text-white/60 tracking-[0.14em] uppercase text-[11.5px]">
            Sole Curtiss-Wright agent · Egypt
          </div>
        </div>
      </div>

      {/* Main nav — glass that deepens on scroll */}
      <nav
        className={`backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/85 shadow-lg shadow-navy/8 border-b border-gray-200/60"
            : "bg-white/70 border-b border-gray-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-17 flex items-center justify-between">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <Image
                src="/logo-transparent.png"
                alt="ACTS: Advanced Company for Trading Services"
                width={124}
                height={41}
                className="h-9 w-auto"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`nav-underline text-[15px] font-semibold transition-colors ${
                  pathname === "/" ? "text-navy active" : "text-gray-600 hover:text-navy"
                }`}
              >
                Home
              </Link>

              <div
                className="relative"
                onMouseEnter={openProducts}
                onMouseLeave={scheduleCloseProducts}
              >
                <Link
                  href="/brands"
                  className={`nav-underline inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    pathname.startsWith("/brands")
                      ? "text-navy active"
                      : "text-gray-600 hover:text-navy"
                  }`}
                >
                  Our Brands
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
                          View all brands
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-underline text-[15px] font-semibold transition-colors ${
                    pathname.startsWith(l.href)
                      ? "text-navy active"
                      : "text-gray-600 hover:text-navy"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/quote"
                className="btn btn-primary text-[14.5px] px-5 py-2.5 group"
              >
                Request a quote
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 -mr-0.5"
                />
              </Link>
            </div>

            <button
              className="md:hidden text-navy p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-6 py-3 flex flex-col">
                <motion.div variants={menuItem} initial="hidden" animate="show" custom={0}>
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-[15px] font-semibold border-b border-gray-100 ${
                      pathname === "/" ? "text-navy" : "text-gray-600"
                    }`}
                  >
                    Home
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
                      pathname.startsWith("/brands") ? "text-navy" : "text-gray-600"
                    }`}
                  >
                    Our Brands
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
                        <div className="pb-3 pl-3 flex flex-col gap-1">
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
                            View all brands
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
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block py-3 text-[15px] font-semibold border-b border-gray-100 ${
                        pathname.startsWith(l.href) ? "text-navy" : "text-gray-600"
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
                    href="/quote"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary w-full my-3 px-5 py-3 text-[15px]"
                  >
                    Request a quote
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
