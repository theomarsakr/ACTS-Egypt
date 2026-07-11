import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { brands, pastManufacturers, clients, industries } from "@/lib/data";

const heroStats = [
  { value: 20, suffix: "+", label: "Years in business" },
  { value: 3, suffix: "", label: "Exclusive brand divisions" },
  { value: 10, suffix: "+", label: "Major operators served" },
  { value: 1, suffix: "", label: "HQ in Giza" },
];

const whatWeDo = [
  {
    title: "Valves, Actuators & Instrumentation",
    text: "Safety relief valves, linear and rotary control valves, actuators, and process instrumentation, supplied and supported end-to-end.",
  },
  {
    title: "Heat Exchanger & Pressure Testing Equipment",
    text: "Tube plugging systems for leaking heat exchanger, condenser, and boiler tubes; hydrostatic test and isolation plugs; and on-site field services for inspection and repair.",
  },
  {
    title: "Technical Consultancy",
    text: "Strategic and operational advisory for industrial clients, including feasibility studies and process improvement.",
  },
];

const features = [
  {
    icon: Award,
    title: "Exclusive agency",
    text: "The sole Egyptian agent for Farris Engineering, Dyna-Flo, and EST, all Curtiss-Wright divisions.",
  },
  {
    icon: Wrench,
    title: "Technical expertise",
    text: "In-house engineers handling sizing, selection, and service conditions, not just order processing.",
  },
  {
    icon: Clock,
    title: "Fast quotations",
    text: "Send a requirement, get a serious answer quickly, usually within 24 hours.",
  },
  {
    icon: MapPin,
    title: "Local presence",
    text: "Giza headquarters with nearly two decades of relationships across Egypt's industrial sector.",
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
                Sole agent for Farris, Dyna-Flo & EST in Egypt
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Engineering Trust into Every Process
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
                Since 2006, ACTS has been Egypt&apos;s trusted partner for
                valves, flow control, and critical process services. We are
                the sole agent for Farris Engineering, Dyna-Flo Control Valve
                Services, and EST, all business divisions of Curtiss-Wright.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/quote"
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

      {/* ============ WHAT WE DO ============ */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                What we do
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-navy">
                Sales, technical support, and aftermarket services
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                ACTS provides support across three areas of industrial process
                equipment, backed by nearly two decades of relationships built
                on integrity, speed, and technical expertise.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeDo.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <div className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-navy">{w.title}</h3>
                  <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed">
                    {w.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section className="py-20 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                Our represented brands
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
                <div className="group card-lift flex flex-col h-full bg-white rounded-2xl border-t-4 border-t-brand border-x border-b border-gray-200 overflow-hidden shadow-sm">
                  <Link href={`/brands/${b.slug}`} className="img-zoom relative h-48 block">
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
                    {b.logo && (
                      <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-2 shadow-sm">
                        <Image
                          src={b.logo}
                          alt={`${b.name} logo`}
                          width={90}
                          height={32}
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    )}
                  </Link>
                  <div className="p-7 flex flex-col flex-1">
                    <Link href={`/brands/${b.slug}`}>
                      <h3 className="text-xl font-extrabold text-navy transition-colors group-hover:text-brand">
                        {b.name}
                      </h3>
                    </Link>
                    <div className="mt-1 text-sm font-semibold text-brand">
                      {b.category}
                    </div>
                    <p className="mt-3 text-[15px] text-gray-600 leading-relaxed flex-1">
                      {b.summary}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <Link
                        href={`/brands/${b.slug}`}
                        className="inline-flex items-center gap-1.5 text-[15px] font-bold text-navy transition-colors hover:text-brand"
                      >
                        View products
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                      <a
                        href={b.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-500 transition-colors hover:text-brand"
                      >
                        Curtiss-Wright
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-8 text-center text-[15px] text-gray-500">
              ACTS has also supplied and supported products from{" "}
              {pastManufacturers.map((s) => s.name).join(", ")} on past
              projects.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CLIENT MARQUEE ============ */}
      <section className="py-12">
        <Reveal>
          <p className="text-center text-[13px] font-bold text-gray-400 uppercase tracking-widest">
            Trusted by leading Egyptian operators
          </p>
          <div className="mt-7 overflow-hidden marquee-mask pause-on-hover">
            <div className="flex w-max animate-marquee gap-16 pr-16 items-center">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="text-xl md:text-2xl font-extrabold text-gray-300 hover:text-navy transition-colors whitespace-nowrap"
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
                Wherever process integrity matters, we&apos;re there.
              </h2>
              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                From upstream production to municipal water networks, our
                equipment protects the critical systems that keep Egypt&apos;s
                industries running safely and reliably.
              </p>
            </Reveal>
            <div className="mt-9 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {industries.slice(0, 5).map((ind, i) => (
                <Reveal key={ind.slug} delay={i * 70}>
                  <div className="flex items-center gap-3 text-[15px] font-medium text-white/90">
                    <CheckCircle2 size={18} className="text-amber shrink-0" />
                    {ind.name}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <Link
                href="/industries"
                className="group mt-10 inline-flex items-center gap-2 text-[15px] font-semibold text-white border border-white/30 rounded-lg px-6 py-3 hover:bg-white hover:text-navy transition-all"
              >
                See how we support each industry
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
                We know what engineering procurement needs from an industrial
                equipment supplier. We&apos;ve been doing it for nearly two
                decades.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-light text-brand">
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
              Let&apos;s talk about your next project
            </h2>
            <p className="mt-5 text-lg text-white/75 max-w-xl mx-auto">
              Have a project, application, or urgent maintenance need? Our
              team is ready to help.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-xl shadow-navy/40"
              >
                Request a quote
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-lg bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
