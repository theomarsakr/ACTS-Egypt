import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { brands, contact, offices } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="bg-white rounded-lg p-2.5 inline-block">
              <Image
                src="/logo-transparent.png"
                alt="ACTS"
                width={110}
                height={36}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-white/60 mt-4 max-w-xs leading-relaxed">
              Advanced Company for Trading Services, Egypt&apos;s sole agent
              for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright)
              since 2006.
            </p>
            <div className="bg-white rounded-lg px-3 py-2 inline-block mt-5">
              <Image
                src="/images/curtiss-wright-logo.png"
                alt="Curtiss-Wright"
                width={354}
                height={100}
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">
              Company
            </div>
            <Link href="/" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              About us
            </Link>
            <Link href="/industries" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              Industries
            </Link>
            <Link href="/products" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              Products & Services
            </Link>
            <Link href="/projects" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              Projects & Clients
            </Link>
            <Link href="/contact" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/quote" className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors">
              Request a quote
            </Link>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">
              Our brands
            </div>
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="block text-[15px] text-white/75 py-1.5 hover:text-white transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">
              Get in touch
            </div>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2.5 text-[15px] text-white/75 py-1.5 hover:text-white transition-colors"
            >
              <Phone size={15} className="text-amber shrink-0" /> {contact.phone}
            </a>
            <a
              href={`mailto:${contact.salesEmail}`}
              className="flex items-center gap-2.5 text-[15px] text-white/75 py-1.5 hover:text-white transition-colors"
            >
              <Mail size={15} className="text-amber shrink-0" /> {contact.salesEmail}
            </a>
            <div className="flex items-start gap-2.5 text-[15px] text-white/75 py-1.5">
              <MapPin size={15} className="text-amber shrink-0 mt-1" />
              <span>{offices[0].address}</span>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-sm text-white/40">
          <div>
            © {new Date().getFullYear()} Advanced Company for Trading Services.
            All rights reserved.
          </div>
          <div className="tracking-wider">SHEIKH ZAYED CITY · GIZA · EGYPT</div>
        </div>
      </div>
    </footer>
  );
}
