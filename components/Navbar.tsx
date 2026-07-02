"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import { contact } from "@/lib/data";

const links = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            Exclusive Curtiss-Wright agent · Egypt
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

            <div className="hidden md:flex items-center gap-8">
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
                href="/contact"
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
                href="/contact"
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
