import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { offices, contact, team, departments, officeHours } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with ACTS' sales & technical team — headquartered at Arkan Plaza, Sheikh Zayed City, Giza, Egypt.",
};

export default function ContactPage() {
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
              Get in touch
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Have a technical question, need a quote, or want to discuss a
              project? Our team is ready to help. Looking for pricing?{" "}
              <Link href="/quote" className="text-amber font-semibold hover:underline">
                Request a quote instead
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              {offices.map((o) => (
                <Reveal key={o.tag}>
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
                          Advanced Company for Trading Services (ACTS)
                        </div>
                        <div className="text-[15px] text-gray-600 mt-0.5">
                          {o.name}, {o.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={90}>
                <div className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="text-sm font-bold text-navy uppercase tracking-wide">
                    Meet our team
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {team.map((t) => (
                      <div key={t.name} className="flex items-baseline gap-2 text-[15px]">
                        <span className="font-semibold text-navy">{t.name}</span>
                        <span className="text-gray-500">— {t.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="text-sm font-bold text-navy uppercase tracking-wide">
                    Office hours
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {officeHours.map((h) => (
                      <div
                        key={h.day}
                        className="flex items-center justify-between text-[15px] text-gray-600"
                      >
                        <span>{h.day}</span>
                        <span className="font-medium text-navy">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={210}>
                <Link
                  href="/quote"
                  className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25"
                >
                  Request a quote
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>

            <Reveal delay={150}>
              <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full min-h-100">
                <iframe
                  title="ACTS headquarters — Arkan Plaza, Sheikh Zayed City, Giza"
                  src="https://maps.google.com/maps?q=Arkan%20Plaza%2C%20Sheikh%20Zayed%20City%2C%20Giza%2C%20Egypt&z=13&output=embed"
                  className="w-full h-full min-h-100 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reach the right team */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Reach the right team
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
                Departments &amp; direct lines
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-[15px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3.5 font-bold text-navy">Department</th>
                    <th className="px-5 py-3.5 font-bold text-navy">Phone</th>
                    <th className="px-5 py-3.5 font-bold text-navy">Mobile</th>
                    <th className="px-5 py-3.5 font-bold text-navy">Fax</th>
                    <th className="px-5 py-3.5 font-bold text-navy">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.name} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="px-5 py-4 font-semibold text-navy whitespace-nowrap">
                        {d.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="hover:text-brand transition-colors">
                          {d.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        <a href={`tel:${d.mobile.replace(/\s/g, "")}`} className="hover:text-brand transition-colors">
                          {d.mobile}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{d.fax}</td>
                      <td className="px-5 py-4 text-gray-600">
                        <div className="flex flex-col gap-0.5">
                          {d.emails.map((e) => (
                            <a
                              key={e}
                              href={`mailto:${e}`}
                              className="hover:text-brand transition-colors"
                            >
                              {e}
                            </a>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Let's connect */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                Let&apos;s Connect
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            <Reveal delay={60}>
              <a
                href={`mailto:${contact.infoEmail}`}
                className="card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">Email</div>
                  <div className="text-[15px] font-medium text-navy">{contact.infoEmail}</div>
                </div>
              </a>
            </Reveal>
            <Reveal delay={120}>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">Phone</div>
                  <div className="text-[15px] font-medium text-navy">{contact.phone}</div>
                </div>
              </a>
            </Reveal>
            <Reveal delay={180}>
              <div className="card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">Location</div>
                  <div className="text-[15px] font-medium text-navy">
                    Arkan Plaza, Sheikh Zayed City, Giza, Egypt
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
