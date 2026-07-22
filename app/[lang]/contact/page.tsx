import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import SpecSheet from "@/components/SpecSheet";
import { contact, team, departments } from "@/lib/data";
import { getDict, localeHref, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const c = getDict(lang).contact;
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function ContactPage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const lang: Locale = rawLang === "ar" ? "ar" : "en";
  const c = getDict(lang).contact;
  const arrowNudge =
    "transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1";

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
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/50 rtl:bg-linear-to-l" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              {c.heroChip}
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              {c.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              {c.lede}{" "}
              <Link
                href={localeHref(lang, "/quote")}
                className="text-amber font-semibold hover:underline"
              >
                {c.quoteInstead}
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
              <Reveal>
                <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-brand">
                        {c.office.tag}
                      </div>
                      <div className="font-bold text-navy mt-0.5">
                        {c.companyFull}
                      </div>
                      <div className="text-[15px] text-gray-600 mt-0.5">
                        {c.office.name}, {c.office.address}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={90}>
                <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="text-sm font-bold text-navy uppercase tracking-wide">
                    {c.meetTeam}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {team.map((t) => (
                      <div key={t.name} className="flex items-baseline gap-2 text-[15px]">
                        <span className="font-semibold text-navy">{t.name}</span>
                        <span className="text-gray-500">
                          , {c.teamRoles[t.role] ?? t.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={150}>
                <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="text-sm font-bold text-navy uppercase tracking-wide">
                    {c.officeHoursTitle}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {c.officeHours.map((h) => (
                      <div
                        key={h.day}
                        className="flex items-center justify-between text-[15px] text-gray-600"
                      >
                        <span>{h.day}</span>
                        <span className="font-medium text-navy">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={210}>
                <Magnetic>
                  <Link
                    href={localeHref(lang, "/quote")}
                    className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25"
                  >
                    {c.requestQuote}
                    <ArrowRight size={18} className={arrowNudge} />
                  </Link>
                </Magnetic>
              </Reveal>
            </div>

            <Reveal delay={150} className="h-full">
              <div className="flex h-full min-h-100 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
                      <MapPin size={16} />
                    </span>
                    <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-navy">
                      {c.headquarters}
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-dark transition-colors"
                  >
                    {c.openInMaps}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </a>
                </div>
                <iframe
                  title={c.mapTitle}
                  src="https://maps.google.com/maps?q=Arkan%20Plaza%2C%20Sheikh%20Zayed%20City%2C%20Giza%2C%20Egypt&z=13&output=embed"
                  className="w-full flex-1 min-h-88 block grayscale-[0.25] transition-[filter] duration-500 hover:grayscale-0"
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
                {c.deptChip}
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">
                {c.deptTitle}
              </h2>
            </div>
          </Reveal>
          <div className="mt-10">
            <SpecSheet
              records={departments.map((d) => ({
                title: c.departmentNames[d.name] ?? d.name,
                fields: [
                  {
                    label: c.specLabels.phone,
                    value: (
                      <a
                        href={`tel:${d.phone.replace(/\s/g, "")}`}
                        className="hover:text-brand transition-colors"
                      >
                        <span className="ltr-inline">{d.phone}</span>
                      </a>
                    ),
                  },
                  {
                    label: c.specLabels.mobile,
                    value: (
                      <a
                        href={`tel:${d.mobile.replace(/\s/g, "")}`}
                        className="hover:text-brand transition-colors"
                      >
                        <span className="ltr-inline">{d.mobile}</span>
                      </a>
                    ),
                  },
                  {
                    label: c.specLabels.fax,
                    value: <span className="ltr-inline">{d.fax}</span>,
                  },
                  {
                    label: c.specLabels.email,
                    value: (
                      <span className="flex flex-col gap-0.5">
                        {d.emails.map((e) => (
                          <a
                            key={e}
                            href={`mailto:${e}`}
                            className="hover:text-brand transition-colors break-all"
                          >
                            {e}
                          </a>
                        ))}
                      </span>
                    ),
                  },
                ],
              }))}
            />
          </div>
        </div>
      </section>

      {/* Let's connect */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                {c.connectTitle}
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            <Reveal delay={60}>
              <a
                href={`mailto:${contact.infoEmail}`}
                className="spotlight-card card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">
                    {c.emailLabel}
                  </div>
                  <div className="text-[15px] font-medium text-navy">
                    {contact.infoEmail}
                  </div>
                </div>
              </a>
            </Reveal>
            <Reveal delay={120}>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="spotlight-card card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">
                    {c.phoneLabel}
                  </div>
                  <div className="text-[15px] font-medium text-navy">
                    <span className="ltr-inline">{contact.phone}</span>
                  </div>
                </div>
              </a>
            </Reveal>
            <Reveal delay={180}>
              <div className="spotlight-card card-lift flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-brand">
                    {c.locationLabel}
                  </div>
                  <div className="text-[15px] font-medium text-navy">
                    {c.locationValue}
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
