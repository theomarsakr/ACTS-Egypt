import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Gauge,
  LineChart,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Hero from "@/components/home/Hero";
import FieldProof from "@/components/home/FieldProof";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import {
  brands,
  pastManufacturers,
  clients,
  industries,
  engagementHighlights,
  contact,
} from "@/lib/data";

const whatWeDo = [
  {
    icon: Gauge,
    title: "Valves, Actuators & Instrumentation",
    text: "Safety relief valves, linear and rotary control valves, actuators, and process instrumentation, supplied and supported end-to-end.",
  },
  {
    icon: Wrench,
    title: "Heat Exchanger & Pressure Testing",
    text: "Tube plugging systems for leaking heat exchanger, condenser, and boiler tubes; hydrostatic test and isolation plugs; on-site field services.",
  },
  {
    icon: LineChart,
    title: "Technical Consultancy",
    text: "Strategic and operational advisory for industrial clients, including feasibility studies and process improvement.",
  },
];

/* Hero shot on each brand card: the brand's #1 best seller, cut out on white */
const bestSellerShots: Record<string, { src: string; alt: string }> = {
  "farris-engineering": {
    src: "/images/home/bestseller-farris.jpg",
    alt: "Farris Series 1890 spring-loaded safety relief valve, the brand's best seller in Egypt",
  },
  "dyna-flo": {
    src: "/images/home/bestseller-dynaflo.jpg",
    alt: "Dyna-Flo 360/390 sliding-stem globe control valve, the brand's best seller in Egypt",
  },
  est: {
    src: "/images/home/bestseller-est.jpg",
    alt: "EST Group Pop-A-Plug P2 heat exchanger tube plug, the brand's best seller in Egypt",
  },
};

const sectorLabels: Record<string, string> = {
  upstream: "Oil & Gas — Upstream",
  midstream: "Refining & Midstream",
  epc: "EPC & Engineering",
  petrochemicals: "Petrochemicals",
  fertilizers: "Fertilizers",
};

const fieldProofItems = engagementHighlights.map((e) => ({
  slug: e.slug,
  sector: sectorLabels[e.slug] ?? e.slug,
  title: e.title,
  text: e.text,
}));

const activities = [
  {
    src: "/images/refinery-blue.jpg",
    label: "Refining",
    sub: "Turnaround & outage support",
    href: "/industries/oil-gas",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/farris-relief-valves.jpg",
    label: "Overpressure protection",
    sub: "Farris safety relief valves",
    href: "/brands/farris-engineering",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/offshore-rig.jpg",
    label: "Upstream",
    sub: "Wellhead & separator protection",
    href: "/industries/oil-gas",
    aspect: "aspect-square",
  },
  {
    src: "/images/dynaflo-control-valve.jpg",
    label: "Process control",
    sub: "Dyna-Flo control valves",
    href: "/brands/dyna-flo",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/power-station.jpg",
    label: "Power generation",
    sub: "Boiler & turbine systems",
    href: "/industries/power-generation",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/est-field-service.jpg",
    label: "Field services",
    sub: "EST heat-exchanger repair",
    href: "/brands/est",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/gas-plant.jpg",
    label: "Gas processing",
    sub: "Pressure regulation & control",
    href: "/industries/oil-gas",
    aspect: "aspect-square",
  },
  {
    src: "/images/petrochemical-plant.jpg",
    label: "Petrochemical",
    sub: "Severe-service applications",
    href: "/industries/petrochemical",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/upstream-drilling-rig.jpg",
    label: "Drilling",
    sub: "Upstream operations",
    href: "/projects",
    aspect: "aspect-[4/5]",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* ============ CLIENT MARQUEE ============ */}
      <section className="py-14 md:py-16 border-b border-gray-100">
        <Reveal>
          <p className="text-center text-[12px] font-bold text-gray-500 uppercase tracking-[0.22em]">
            Trusted by Egypt&apos;s leading operators
          </p>
        </Reveal>
        <div className="mt-9 overflow-hidden marquee-mask pause-on-hover">
          <div className="flex w-max animate-marquee items-start gap-12 pr-12">
            {[...clients, ...clients].map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                title={c.name}
                className="logo-tile flex flex-col items-center gap-3 shrink-0 w-44"
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    fill
                    loading="eager"
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
                <div className="text-[13px] font-semibold text-navy/80 text-center leading-tight">
                  {c.short}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-brand">What we do</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                Sales, technical support, and aftermarket services
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                Three areas of industrial process equipment, backed by nearly
                two decades of relationships built on integrity, speed, and
                technical expertise.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeDo.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <SpotlightCard className="group card-premium glow-hover h-full p-7">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <w.icon size={23} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy">{w.title}</h3>
                  <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed">
                    {w.text}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section className="py-20 md:py-28 bg-[#f6f8fb] border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="eyebrow text-brand">Represented brands</div>
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                  Three world-class manufacturers. One local partner.
                </h2>
              </div>
              <Link
                href="/brands"
                className="btn btn-ghost-light px-6 py-3 text-[15px] group"
              >
                All brands
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {brands.map((b, i) => (
              <Reveal key={b.slug} delay={i * 120}>
                <SpotlightCard className="group card-premium glow-hover flex flex-col h-full overflow-hidden !rounded-3xl">
                  <Link
                    href={`/brands/${b.slug}`}
                    className="relative h-60 block overflow-hidden bg-white border-b border-gray-100"
                  >
                    <Image
                      src={bestSellerShots[b.slug]?.src ?? b.image}
                      alt={bestSellerShots[b.slug]?.alt ?? b.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-5 pb-9 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent" />
                    <div className="absolute bottom-3.5 left-5 text-[11.5px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                      {b.no} · Best seller
                    </div>
                    {b.logo && (
                      <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur rounded-xl px-3 py-2 shadow-lg shadow-ink/10 ring-1 ring-gray-200/70">
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
                    {b.bestSellers && (
                      <div className="mt-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          Best sellers in Egypt
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {b.bestSellers.map((s) => (
                            <span
                              key={s}
                              className="text-[12.5px] font-semibold text-brand-dark bg-brand-light rounded-full px-2.5 py-1"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-8 text-center text-[14.5px] text-gray-500">
              ACTS has also supplied and supported products from{" "}
              {pastManufacturers.map((s) => s.name).join(", ")} on past
              projects.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY ACTS — BENTO ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-brand">Why ACTS</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                Built for procurement teams
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                We know what engineering procurement needs from an industrial
                equipment supplier — we&apos;ve been doing it for nearly two
                decades.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Large tile: exclusive agency */}
            <Reveal className="md:col-span-2 lg:row-span-2">
              <div className="border-beam glow-hover relative h-full min-h-[22rem] rounded-3xl overflow-hidden bg-ink text-white border border-white/5 p-8 flex flex-col">
                <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
                <div className="mesh mesh-brass w-80 h-80 -bottom-32 -right-24" aria-hidden />
                <div className="relative flex-1">
                  <div className="eyebrow text-amber">Exclusive agency</div>
                  <h3 className="mt-4 text-2xl md:text-[1.8rem] font-extrabold tracking-tight leading-tight">
                    The sole authorized source for three Curtiss-Wright
                    divisions in Egypt
                  </h3>
                  <p className="mt-4 text-[15.5px] text-white/65 leading-relaxed max-w-md">
                    Factory-backed pricing, genuine parts, and direct access to
                    manufacturer engineering — without intermediaries.
                  </p>
                </div>
                <div className="relative mt-8 flex flex-wrap items-center gap-2.5">
                  {[
                    { src: "/images/farris-logo.png", alt: "Farris Engineering" },
                    { src: "/images/dynaflo-logo.png", alt: "Dyna-Flo" },
                    { src: "/images/curtiss-wright-logo.png", alt: "Curtiss-Wright" },
                  ].map((l) => (
                    <span key={l.src} className="bg-white rounded-xl px-3.5 py-2">
                      <Image
                        src={l.src}
                        alt={l.alt}
                        width={110}
                        height={36}
                        className="h-5.5 w-auto object-contain"
                      />
                    </span>
                  ))}
                  <Link
                    href="/brands"
                    className="ml-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-amber hover:text-white transition-colors"
                  >
                    Our brands <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Numeral tile: 24h */}
            <Reveal delay={80}>
              <SpotlightCard className="card-premium glow-hover h-full p-7 flex flex-col">
                <div className="text-5xl font-extrabold tracking-tight text-navy tabular-nums">
                  24<span className="text-brand">h</span>
                </div>
                <h3 className="mt-3 text-[16px] font-bold text-navy">
                  Fast quotations
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  Send a requirement, get a serious answer — usually within one
                  business day.
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Icon tile: engineers */}
            <Reveal delay={140}>
              <SpotlightCard className="group card-premium glow-hover h-full p-7 flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Wrench size={21} />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-navy">
                  Engineers, not order-takers
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  In-house sizing, selection, and service-condition review on
                  every enquiry.
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Numeral tile: since 2006 */}
            <Reveal delay={200}>
              <SpotlightCard className="card-premium glow-hover h-full p-7 flex flex-col">
                <div className="text-5xl font-extrabold tracking-tight text-navy tabular-nums">
                  2006
                </div>
                <h3 className="mt-3 text-[16px] font-bold text-navy">
                  Two decades on the ground
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  Relationships across Egypt&apos;s industrial sector since our
                  founding in Giza.
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Icon tile: genuine parts */}
            <Reveal delay={260}>
              <SpotlightCard className="group card-premium glow-hover h-full p-7 flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <ShieldCheck size={21} />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-navy">
                  Genuine parts & aftermarket
                </h3>
                <p className="mt-1.5 text-[14.5px] text-gray-600 leading-relaxed">
                  Factory-original spares and service support across the
                  equipment lifecycle.
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Wide tile: local presence */}
            <Reveal delay={120} className="md:col-span-2 lg:col-span-4">
              <SpotlightCard className="card-premium glow-hover p-7 md:px-9 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-light text-brand shrink-0">
                  <MapPin size={23} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-navy">
                    Giza headquarters, nationwide reach
                  </h3>
                  <p className="mt-1 text-[14.5px] text-gray-600">
                    Arkan Plaza, Sheikh Zayed City — supporting sites from the
                    Western Desert to the Gulf of Suez.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="btn btn-ghost-light px-5 py-2.5 text-[14px] shrink-0 group"
                >
                  Visit or contact us
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES (ink split) ============ */}
      <section className="bg-ink text-white overflow-hidden relative">
        <div className="absolute inset-0 blueprint opacity-50" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2">
          <div className="py-20 lg:py-28 lg:pr-16">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 text-[12.5px] font-semibold text-amber uppercase tracking-[0.18em] glass-dark rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Industries we serve
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-balance">
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
                  <Link
                    href={`/industries#${ind.slug}`}
                    className="group flex items-center gap-3 text-[15px] font-medium text-white/85 hover:text-white transition-colors"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-amber shrink-0 transition-transform group-hover:scale-110"
                    />
                    {ind.name}
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <Link
                href="/industries"
                className="btn btn-ghost-dark mt-10 px-6 py-3 text-[15px] group"
              >
                See how we support each industry
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
          <Reveal className="reveal-scale relative min-h-80 lg:min-h-0 -mx-6 lg:mx-0">
            <Image
              src="/images/power-station.jpg"
              alt="Power station at night"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/30 to-transparent" />
          </Reveal>
        </div>
      </section>

      {/* ============ PROVEN IN THE FIELD ============ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-brand">Proven in the field</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                The work our clients rely on us for
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                Project specifics stay confidential — these are the engagements
                Egypt&apos;s operators bring to ACTS, from named clients like
                ENPPI, Petrojet, and Khalda Petroleum.
              </p>
            </div>
          </Reveal>
          <div className="mt-10">
            <FieldProof items={fieldProofItems} />
          </div>
        </div>
      </section>

      {/* ============ ACTIVITIES MASONRY ============ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-brand-dark uppercase tracking-[0.14em] bg-brand-light rounded-full px-3.5 py-1.5">
                  In the field
                </div>
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-navy text-balance">
                  Where our equipment works
                </h2>
              </div>
              <Link
                href="/projects"
                className="btn btn-ghost-light px-6 py-3 text-[15px] group"
              >
                Projects & clients
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
            {activities.map((a, i) => (
              <Reveal key={a.src} delay={(i % 3) * 90} className="break-inside-avoid">
                <Link
                  href={a.href}
                  className={`group relative block overflow-hidden rounded-2xl ${a.aspect}`}
                >
                  <Image
                    src={a.src}
                    alt={`${a.label}: ${a.sub}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-amber uppercase tracking-[0.18em]">
                        {a.label}
                      </div>
                      <div className="mt-1 text-[15.5px] font-bold text-white leading-snug">
                        {a.sub}
                      </div>
                    </div>
                    <span className="w-9 h-9 rounded-full glass-dark flex items-center justify-center text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 blueprint"
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 90% at 50% 100%, black 20%, transparent 75%)",
            }}
          />
          <div className="mesh mesh-brass w-[40rem] h-[40rem] -bottom-72 left-1/2 -translate-x-1/2" />
          <div className="mesh mesh-steel w-96 h-96 -top-48 -right-24 opacity-60" />
          <div className="dark-vignette" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <Reveal>
            <div className="eyebrow text-amber justify-center [&::before]:hidden">
              <span className="w-6.5 h-0.5 rounded bg-current opacity-85" />
              Start a conversation
              <span className="w-6.5 h-0.5 rounded bg-current opacity-85" />
            </div>
            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] text-balance">
              Let&apos;s talk about your next project
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl mx-auto">
              A project, an application question, or an urgent maintenance need
              — our engineers are ready.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Magnetic>
                <Link
                  href="/quote"
                  className="btn btn-primary px-8 py-4 text-base group"
                >
                  Request a quote
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
              <Link href="/contact" className="btn btn-ghost-dark px-8 py-4 text-base">
                Contact us
              </Link>
            </div>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 text-[14.5px] text-white/50">
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {contact.phone}
              </a>
              <span className="hidden sm:block w-px h-4 bg-white/15" />
              <a
                href={`mailto:${contact.salesEmail}`}
                className="hover:text-white transition-colors"
              >
                {contact.salesEmail}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
