import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { brands, contact, offices, industries, officeHours } from "@/lib/data";
import FooterQuoteForm from "@/components/FooterQuoteForm";
import { getDict, localeHref, type Dict, type Locale } from "@/lib/i18n";

export default function Footer({
  lang = "en",
  t,
  industryNames,
}: {
  lang?: Locale;
  t: Dict["footer"];
  industryNames: Dict["industryNames"];
}) {
  const isAr = lang === "ar";
  const dict = getDict(lang);

  const companyLinks = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/products", label: dict.nav.products },
    { href: "/projects", label: dict.nav.projects },
    { href: "/contact", label: dict.nav.contact },
    { href: "/quote", label: dict.nav.requestQuote },
  ];

  // Real channels only — phone, sales email, WhatsApp (sales mobile), and maps.
  const channels = [
    {
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      label: t.channels.call,
      icon: Phone,
    },
    {
      href: `mailto:${contact.salesEmail}`,
      label: t.channels.email,
      icon: Mail,
    },
    {
      href: "https://wa.me/201223235399",
      label: t.channels.whatsapp,
      icon: MessageCircle,
    },
    {
      href: "https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza",
      label: t.channels.maps,
      icon: MapPin,
    },
  ];

  // Arabic address + hours come from the contact dictionary.
  const office = isAr ? dict.contact.office : offices[0];
  const hours = isAr ? dict.contact.officeHours[0] : officeHours[0];

  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      <div className="absolute inset-0 blueprint opacity-40" aria-hidden />
      <div className="mesh mesh-steel w-136 h-136 -top-72 -left-40 opacity-50" aria-hidden />
      <div className="dark-vignette" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* RFQ fast lane */}
        <div className="py-12 md:py-14 flex flex-col lg:flex-row lg:items-center gap-7 border-b border-white/10">
          <div className="flex-1">
            <h3 className="text-2xl md:text-[1.7rem] font-extrabold tracking-tight">
              {t.rfqTitle}
            </h3>
            <p className="mt-2 text-[15px] text-white/60 max-w-lg">{t.rfqText}</p>
          </div>
          <FooterQuoteForm
            lang={lang}
            emailLabel={t.emailLabel}
            emailPlaceholder={t.emailPlaceholder}
            startQuote={t.startQuote}
          />
        </div>

        {/* Link columns */}
        <div className="py-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr]">
          <div>
            <div className="bg-white rounded-xl p-2.5 inline-block">
              <Image
                src="/logo-transparent.png"
                alt="ACTS: Advanced Company for Trading Services"
                width={110}
                height={36}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-[14.5px] text-white/55 mt-5 max-w-xs leading-relaxed">
              {t.blurb}
            </p>
            <div className="bg-white rounded-xl px-3 py-2 inline-block mt-6">
              <Image
                src="/images/curtiss-wright-logo.png"
                alt="Curtiss-Wright"
                width={354}
                height={100}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="mt-7 flex gap-2.5">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={c.label}
                  title={c.label}
                  className="w-10 h-10 rounded-xl glass-dark flex items-center justify-center text-white/70 transition-all hover:text-amber hover:border-amber/40 hover:-translate-y-0.5"
                >
                  <c.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5">
              {t.company}
            </div>
            {companyLinks.map((l) => (
              <Link
                key={l.href}
                href={localeHref(lang, l.href)}
                className="block text-[14.5px] text-white/70 py-1.5 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5">
              {t.ourBrands}
            </div>
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="block text-[14.5px] text-white/70 py-1.5 hover:text-white transition-colors"
              >
                {b.name}
              </Link>
            ))}
            <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5 mt-8">
              {t.industries}
            </div>
            {industries.slice(0, 4).map((ind) => (
              <Link
                key={ind.slug}
                href="/industries"
                className="block text-[14.5px] text-white/70 py-1.5 hover:text-white transition-colors"
              >
                {industryNames[ind.slug] ?? ind.name}
              </Link>
            ))}
          </div>

          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5">
              {t.getInTouch}
            </div>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2.5 text-[14.5px] text-white/70 py-1.5 hover:text-white transition-colors"
            >
              <Phone size={15} className="text-amber shrink-0" />{" "}
              <span className="ltr-inline">{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.salesEmail}`}
              className="flex items-center gap-2.5 text-[14.5px] text-white/70 py-1.5 hover:text-white transition-colors"
            >
              <Mail size={15} className="text-amber shrink-0" /> {contact.salesEmail}
            </a>
            <div className="flex items-start gap-2.5 text-[14.5px] text-white/70 py-1.5">
              <MapPin size={15} className="text-amber shrink-0 mt-1" />
              <span>
                {office.name}
                <br />
                {office.address}
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-[14.5px] text-white/70 py-1.5">
              <Clock size={15} className="text-amber shrink-0 mt-1" />
              <span>
                {hours.day}
                <br />
                {hours.hours}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-7 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-[13px] text-white/40">
          <div>
            © {new Date().getFullYear()} {t.companyFull}. {t.rights}
          </div>
          <div className="tracking-[0.18em] uppercase">{t.tagline}</div>
        </div>
      </div>
    </footer>
  );
}
