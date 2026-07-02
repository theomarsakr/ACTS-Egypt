import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { timeline, mission, offices } from "@/lib/data";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Founded in Giza in 2002, ACTS has grown into the specialist channel for pressure-critical flow-control equipment in Egypt.",
};

const aboutStats = [
  { value: 2002, label: "Founded in Giza", raw: true },
  { value: 20, suffix: "+", label: "Years of trade" },
  { value: 4, prefix: "$", suffix: "M", label: "Annual revenue by 2014" },
  { value: 2, label: "Offices nationwide" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/refinery-blue.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/80 to-navy/40" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
              About ACTS
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl">
              Two decades of industrial trade
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Founded in Giza in 2002, ACTS has grown from a general industrial
              trading firm into Egypt&apos;s specialist channel for
              pressure-critical valves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stat bar */}
      <section className="relative z-10 -mt-10 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 max-md:divide-y max-md:[&>*:nth-child(2n+1)]:border-l-0">
              {aboutStats.map((s) => (
                <div key={s.label} className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-navy">
                    {s.raw ? (
                      s.value
                    ) : (
                      <Counter
                        value={s.value}
                        prefix={s.prefix ?? ""}
                        suffix={s.suffix ?? ""}
                      />
                    )}
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Our story
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                From trading firm to valve authority
              </h2>
            </div>
          </Reveal>
          <div className="mt-14">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 120}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full shrink-0 mt-1 ring-4 ${
                        t.now
                          ? "bg-brand ring-brand/15"
                          : "bg-navy/30 ring-gray-100"
                      }`}
                    />
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="pb-12">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-2xl font-extrabold text-navy">
                        {t.year}
                      </span>
                      <span className="text-sm font-semibold text-brand bg-brand-light rounded-full px-3 py-0.5">
                        {t.unit}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed">
                      {t.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission — navy band */}
      <section className="bg-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
                The FoCus program
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                Our mission: focus on the customer
              </h2>
              <p className="mt-5 text-lg text-white/70">
                Five commitments guide how we work.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mission.map((m, i) => (
              <Reveal key={m.num} delay={i * 90}>
                <div className="h-full bg-navy-800 rounded-2xl border border-white/10 p-6 hover:border-amber/50 hover:bg-navy-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-amber font-extrabold flex items-center justify-center">
                    {m.num}
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
                  <p className="mt-2 text-[15px] text-white/65">
                    {m.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal>
                <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                  Where to find us
                </div>
                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
                  Two offices, national reach
                </h2>
              </Reveal>
              <div className="mt-8 space-y-5">
                {offices.map((o, i) => (
                  <Reveal key={o.tag} delay={i * 120}>
                    <div className="card-lift bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
                        <MapPin size={21} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-brand">
                          {o.tag}
                        </div>
                        <div className="mt-1 text-lg font-bold text-navy">
                          {o.name}
                        </div>
                        <div className="mt-1 text-[15px] text-gray-600">
                          {o.address}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={240}>
                <Link
                  href="/contact"
                  className="group mt-9 inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25"
                >
                  Contact us
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>
            <Reveal delay={150}>
              <div className="img-zoom relative rounded-2xl overflow-hidden shadow-xl shadow-navy/15 h-100">
                <Image
                  src="/images/gas-plant.jpg"
                  alt="Natural gas wellhead with valve handwheels"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
