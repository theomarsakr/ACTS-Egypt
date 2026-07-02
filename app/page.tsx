import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { brands, suppliers, clients } from "@/lib/data";

const heroStats = [
  { value: 20, suffix: "+", label: "Years in business" },
  { value: 3, suffix: "", label: "Exclusive valve brands" },
  { value: 9, suffix: "+", label: "Major energy clients" },
  { value: 2, suffix: "", label: "Offices in Egypt" },
];

const industries = [
  "Oil & Gas Production",
  "Natural Gas Transfer",
  "Refining",
  "Petrochemicals",
  "Power Generation",
  "Water & Utilities",
];

const features = [
  {
    icon: Award,
    title: "Exclusive agency",
    text: "The only authorized Egyptian agent for Curtiss-Wright's Farris, Solent & Pratt and CWT valve brands.",
  },
  {
    icon: Wrench,
    title: "Technical expertise",
    text: "Engineers who speak your language — sizing, selection and service conditions handled properly.",
  },
  {
    icon: Clock,
    title: "Fast quotations",
    text: "Send a requirement, get a serious answer quickly — usually within one business day.",
  },
  {
    icon: MapPin,
    title: "Local presence",
    text: "Offices in Giza and Cairo with two decades of relationships across Egypt's energy sector.",
  },
];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-155 md:min-h-170 flex items-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/hero-plant.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/40" />
          <div className="absolute inset-0 bg-linear-to-t from-navy/80 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 w-full py-24">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-amber uppercase tracking-widest border border-white/20 bg-white/5 backdrop-blur rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Exclusive Curtiss-Wright agent in Egypt
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Pressure-critical valve solutions for Egypt&apos;s energy
                sector
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
                Since 2002, ACTS has supplied safety relief, butterfly and
                severe-service valves to Oil &amp; Gas, Petrochemical and Power
                operators across Egypt.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-navy/40"
                >
                  Request a quote
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Explore products
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stat bar overlapping the hero */}
      <section className="relative z-10 -mt-14 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 max-md:divide-y max-md:[&>*:nth-child(2n+1)]:border-l-0">
              {heroStats.map((s) => (
                <div key={s.label} className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-navy">
                    <Counter value={s.value} suffix={s.suffix} />
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

      {/* ============ BRANDS ============ */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Our brands
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-navy">
                Three world-class manufacturers.
                <br className="hidden md:block" /> One local partner.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {brands.map((b, i) => (
              <Reveal key={b.slug} delay={i * 120}>
                <Link
                  href={`/products/${b.slug}`}
                  className="group card-lift flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="img-zoom relative h-48">
                    <Image
                      src={b.image}
                      alt={b.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-[12px] font-bold text-white/90 uppercase tracking-widest">
                      {b.no}
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-navy">
                      {b.name}
                    </h3>
                    <div className="mt-1 text-sm font-semibold text-brand">
                      {b.category}
                    </div>
                    <p className="mt-3 text-[15px] text-gray-600 leading-relaxed flex-1">
                      {b.summary}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold text-navy group-hover:text-brand transition-colors">
                      View products
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLIENT MARQUEE ============ */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <Reveal>
          <p className="text-center text-[13px] font-bold text-gray-400 uppercase tracking-widest">
            Trusted by Egypt&apos;s energy leaders
          </p>
          <div className="mt-7 overflow-hidden marquee-mask pause-on-hover">
            <div className="flex w-max animate-marquee gap-16 pr-16 items-center">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="text-2xl md:text-3xl font-extrabold text-gray-300 hover:text-navy transition-colors whitespace-nowrap"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ INDUSTRIES (navy split) ============ */}
      <section className="bg-navy text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2">
          <div className="py-20 lg:py-24 lg:pr-14">
            <Reveal>
              <div className="text-[13px] font-bold text-amber uppercase tracking-widest">
                Industries we serve
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                Wherever pressure matters, we&apos;re there.
              </h2>
              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                From upstream production to the power grid, our valves protect
                the critical systems that keep Egypt running.
              </p>
            </Reveal>
            <div className="mt-9 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {industries.map((ind, i) => (
                <Reveal key={ind} delay={i * 70}>
                  <div className="flex items-center gap-3 text-[15px] font-medium text-white/90">
                    <CheckCircle2 size={18} className="text-amber shrink-0" />
                    {ind}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <Link
                href="/products"
                className="group mt-10 inline-flex items-center gap-2 text-[15px] font-semibold text-white border border-white/30 rounded-lg px-6 py-3 hover:bg-white hover:text-navy transition-all"
              >
                See what we supply
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
          <div className="relative min-h-80 lg:min-h-0 -mx-6 lg:mx-0">
            <Image
              src="/images/power-station.jpg"
              alt="Power station at night"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/30 to-transparent lg:bg-linear-to-r" />
          </div>
        </div>
      </section>

      {/* ============ WHY ACTS ============ */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Why ACTS
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-navy">
                Built for procurement teams
              </h2>
              <p className="mt-5 text-lg text-gray-600">
                We know what engineering procurement needs from a valve
                supplier — because we&apos;ve been doing it for two decades.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                    <f.icon size={23} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy">{f.title}</h3>
                  <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Suppliers strip */}
          <Reveal delay={150}>
            <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 px-8 py-8">
              <div className="text-center text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                We also supply
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
                {suppliers.map((s) => (
                  <span
                    key={s.name}
                    className="text-lg font-bold text-gray-500 hover:text-navy transition-colors"
                    title={s.sub}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA (photo band) ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/images/refinery-blue.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Need a valve? We&apos;ll quote it.
            </h2>
            <p className="mt-5 text-lg text-white/75 max-w-xl mx-auto">
              Tell us the brand, series, size and service conditions — our
              sales and technical team will get back to you quickly.
            </p>
            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-xl shadow-navy/40"
            >
              Request a quote
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
