import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import RFQForm from "@/components/RFQForm";
import Reveal from "@/components/Reveal";
import { offices, contact, getBrand } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Speak to ACTS' sales & technical team — request a quote for Farris, Solent & Pratt and CWT valves in Egypt.",
};

type Props = {
  searchParams: Promise<{ brand?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { brand: brandSlug } = await searchParams;
  const brand = brandSlug ? getBrand(brandSlug) : undefined;

  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/hero-plant.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/50" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              Contact
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Speak to our team
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Request a quote or ask our sales &amp; technical team anything —
              we usually reply within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10">
            {/* Contact info */}
            <div className="space-y-4">
              <Reveal>
                <div className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-navy">Call us</div>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, "")}`}
                        className="text-[15px] text-gray-600 hover:text-brand transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-navy">Email us</div>
                      <a
                        href={`mailto:${contact.salesEmail}`}
                        className="block text-[15px] text-gray-600 hover:text-brand transition-colors"
                      >
                        {contact.salesEmail}{" "}
                        <span className="text-gray-400">(sales)</span>
                      </a>
                      <a
                        href={`mailto:${contact.infoEmail}`}
                        className="block text-[15px] text-gray-600 hover:text-brand transition-colors"
                      >
                        {contact.infoEmail}{" "}
                        <span className="text-gray-400">(general)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              {offices.map((o, i) => (
                <Reveal key={o.tag} delay={180 + i * 90}>
                  <div className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-brand">
                          {o.tag}
                        </div>
                        <div className="font-bold text-navy mt-0.5">
                          {o.name}
                        </div>
                        <div className="text-[15px] text-gray-600 mt-0.5">
                          {o.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={360}>
                <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <iframe
                    title="ACTS main office — 6th of October City, Giza"
                    src="https://maps.google.com/maps?q=El%20Nakhil%20Center%2C%206th%20of%20October%20City%2C%20Giza%2C%20Egypt&z=13&output=embed"
                    className="w-full h-64 block"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={150} className="lg:sticky lg:top-32 self-start">
              <RFQForm
                initialInterest={
                  brand ? `${brand.name} — ${brand.category}` : undefined
                }
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
