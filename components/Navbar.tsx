"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { contact, brands } from "@/lib/data";

const links = [
  { href: "/about", label: "About us" },
  { href: "/industries", label: "Industries" },
  { href: "/products", label: "Products & Services" },
  { href: "/projects", label: "Projects & Clients" },
  { href: "/contact", label: "Contact" },
];

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
      <div className="bg-navy text-white/80 text-[13px] hidden md:block">
        <div className="max-w-6xl mx-auto px-6 h-9 flex items-center justify-between">
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
          <div className="text-white/60 tracking-wide">
            Sole Curtiss-Wright agent · Egypt
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`bg-white/95 backdrop-blur-lg transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-navy/10" : "border-b border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-[68px] flex items-center justify-between">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <Image
                src="/logo-transparent.png"
                alt="ACTS — Advanced Company for Trading Services"
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

                {productsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-xl shadow-navy/10 overflow-hidden animate-page-in">
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
                  </div>
                )}
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
                className="text-[15px] font-semibold px-5 py-2.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-sm shadow-brand/30"
              >
                Request a quote
              </Link>
            </div>

            <button
              className="md:hidden text-navy p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-page-in">
            <div className="px-6 py-3 flex flex-col">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`py-3 text-[15px] font-semibold border-b border-gray-100 ${
                  pathname === "/" ? "text-navy" : "text-gray-600"
                }`}
              >
                Home
              </Link>

              <div className="border-b border-gray-100">
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
                {mobileProductsOpen && (
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
                )}
              </div>

              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-[15px] font-semibold border-b border-gray-100 last:border-0 ${
                    pathname.startsWith(l.href) ? "text-navy" : "text-gray-600"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="my-3 text-center text-[15px] font-semibold px-5 py-3 rounded-lg bg-brand text-white"
              >
                Request a quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
