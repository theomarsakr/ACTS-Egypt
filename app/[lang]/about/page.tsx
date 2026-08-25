import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  MapPin,
  Building2,
  FileText,
  Gauge,
  History,
  TrendingUp,
  RefreshCw,
  RadioTower,
  Rocket,
  Headset,
  ClipboardCheck,
  Lightbulb,
  Radar,
  Settings2,
  ShieldCheck,
  Thermometer,
  UserRound,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SiteDock from "@/components/SiteDock";
import Counter from "@/components/Counter";
import TimelineTrack from "@/components/TimelineTrack";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import CardLogoMark from "@/components/ui/CardLogoMark";
import { ProgressiveBlurCard } from "@/components/ui/progressive-blur-card";
import { ShineBorder } from "@/components/ui/ShineBorder";
import FlipDiskMatrixLazy from "@/components/ui/flip-disk-matrix-lazy";
import { timeline, mission, values, offices, forwardDirection } from "@/lib/data";

/** One icon per timeline entry, in order: Farris agency, second branch,
 *  rebuild, incorporation, transformation, Dyna-Flo agency, new HQ, EST
 *  agency. The three agency years take their brand's own icon, matching the
 *  brands page dock. */
const timelineIcons = [
  ShieldCheck,
  MapPin,
  RefreshCw,
  TrendingUp,
  Rocket,
  Settings2,
  Building2,
  Thermometer,
];

/** One icon per `forwardDirection` entry, in order. */
const forwardIcons = [Gauge, Activity, RadioTower, FileText];

export const metadata: Metadata = {
  title: "About us",
  description:
    "Founded in 2006 in Sixth of October City, Giza, ACTS has grown into Egypt's trusted partner for valves, flow control, and critical process equipment.",
  alternates: { canonical: "/about" },
};

const aboutStats = [
  { value: 2006, label: "Founded in Giza", raw: true },
  { value: 20, suffix: "+", label: "Years of trade" },
  { value: 4, prefix: "$", suffix: "M", label: "Annual sales by 2016" },
  { value: 1, label: "HQ · Sheikh Zayed City" },
];

const specializations = [
  {
    name: "Farris Engineering: Safety Relief Valves",
    text: "Spring-operated and pilot-operated relief valves for overpressure protection. We support sizing, API 526/527 compliance, and re-certification for upstream, midstream, and refining applications.",
  },
  {
    name: "Dyna-Flo: Control Valves & Actuation",
    text: "Precision control valves, actuators, and positioners. We handle flow sizing (Cv calculations), noise abatement, and severe-service trim selection for stable, accurate control under high pressure drop.",
  },
  {
    name: "EST: Heat Exchanger Maintenance & Pressure Testing",
    text: "Field services for shell-and-tube heat exchangers and condensers, including tube cleaning, inspection (eddy current & IRIS), leak detection, tube plugging (Pop-A-Plug®), sleeving, and retubing, plus hydrostatic pressure testing and pipeline isolation via GripTight®, rated to 15,000 psig.",
  },
];

/** Three pull-quotes for the leadership card, each opening in place to the
 *  fuller thought. Drawn from copy the site already commits to elsewhere, so
 *  they restate the position rather than adding a new one: `mission` 01 and
 *  the single-point-support pillar; the `values` entries for Empowerment and
 *  Excellence; the aftermarket pillar and `forwardDirection`. */
const leadershipQuotes = [
  {
    short: "Be the partner customers call first.",
    full: "That means answering fast and getting the application right the first time, with one dedicated contact who understands both the product and the plant it is going into. Not a ticket number, and not a different person at every stage between enquiry and delivery.",
  },
  {
    short: "The right recommendation comes before the sale.",
    full: "We advise customers toward the right solution even when it is the smaller order, and every enquiry gets a technical review before it is quoted rather than just processed. That is the difference between a supplier and a technical partner on a critical project, and it is why customers come back.",
  },
  {
    short: "Support does not end at delivery.",
    full: "Maintenance and reconditioning are built into how we work, not sold as an afterthought once something has already failed. We are also moving customers from reactive repairs toward predictive maintenance and digital diagnostics, so a failure gets anticipated instead of absorbed as downtime.",
  },
];

const howWeOperate = [
  {
    icon: Headset,
    title: "Single-point technical support",
    text: "One dedicated contact who understands both the product and the application.",
  },
  {
    icon: ClipboardCheck,
    title: "Structured project management",
    text: "Clear documentation and timelines from enquiry to delivery.",
  },
  {
    icon: Lightbulb,
    title: "Advisory-led selling",
    text: "Technical input and the right recommendation come first, ahead of the sale.",
  },
  {
    icon: Wrench,
    title: "Aftermarket accountability",
    text: "Maintenance and reconditioning support built into how we work.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero — a small "postcard" of the plant that grows to fill the
          screen as the visitor scrolls, then hands off into the rest of the
          page. Must stay the very first thing on the page: see the component
          doc comment for why. */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/videos/Ceo-scrub.mp4"
        posterSrc="/videos/Ceo-poster.jpg"
        mediaAlt="ACTS company film"
        scrubOnScroll
        bgImageSrc="/images/arkan-plaza-terrace.jpg"
        eyebrow="About ACTS"
        title="Nearly Two Decades"
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            Advanced Company for Trading Services (ACTS) was founded in 2006
            in Sixth of October City, Giza, and incorporated as a Limited
            Liability Company in 2016. In 2025, ACTS relocated its
            headquarters to Arkan Plaza, Sheikh Zayed City, Giza, Egypt. For
            nearly two decades, we have served the Egyptian market, earning
            the trust of leading operators across Oil &amp; Gas,
            Petrochemicals, Power Generation, Water Treatment, and
            Fertilizers.
          </p>
          <p className="mt-5 text-lg md:text-xl text-white/80 leading-relaxed">
            Today our capabilities span valves, actuators, instrumentation,
            and heat exchanger services, which lets us meet the full range of
            our customers&apos; needs through a single, coordinated point of
            contact.
          </p>
        </div>
      </ScrollExpandMedia>

      {/* Stat bar */}
      <section className="relative z-10 -mt-10 pb-4">
        <div className="max-w-6xl mx-auto px-safe">
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
      <section id="timeline" className="scroll-anchor py-20">
        <div className="max-w-3xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              align="center"
              title="Our Journey"
              subtitle="From trading firm to sole-agency partner"
            />
          </Reveal>
          <div className="mt-14 relative">
            <TimelineTrack />
            {timeline.map((t, i) => {
              const Icon = timelineIcons[i % timelineIcons.length];
              return (
                <Reveal key={`${t.year}-${t.unit}`} delay={i * 100}>
                  <div className="flex gap-6 pb-8 last:pb-0">
                    <div
                      className={`relative shrink-0 flex items-center justify-center w-9 h-9 rounded-full ring-4 ring-white shadow-sm ${
                        t.now
                          ? "bg-brand text-white pulse-ring"
                          : "bg-white border-2 border-brand text-brand"
                      }`}
                    >
                      <Icon size={17} strokeWidth={2.25} />
                    </div>
                    <SpotlightCard className="card-lift flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-fluid-h4 font-extrabold text-navy">
                          {t.year}
                        </span>
                        <span className="text-sm font-semibold rounded-full px-3 py-0.5 bg-brand-light text-brand-dark">
                          {t.unit}
                        </span>
                        {t.now && (
                          <span className="text-[11px] font-bold uppercase tracking-widest text-brand">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed">
                        {t.body}
                      </p>
                    </SpotlightCard>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="scroll-anchor py-20">
        <div className="max-w-4xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="mx-auto mb-10 max-w-2xl"
              align="center"
              title="Leadership"
              subtitle="Who leads ACTS today"
            />
          </Reveal>
          <Reveal delay={100}>
            <ProgressiveBlurCard
              className="mx-auto max-w-2xl"
              name="Ayman El-Mohamady Sakr"
              role="General Manager"
              initials="AS"
              photoSrc="/images/ayman-el-mohamady-sakr.png"
              /* Facts about the remit, not a product list. The three agency
                 brands have their own pages; this section is about ACTS. */
              rows={[
                { label: "Remit", value: "Operations and technical partnerships" },
                { label: "Sectors", value: "Oil & Gas, Power, Fertilizers" },
                { label: "Based", value: "Sheikh Zayed City, Giza" },
              ]}
              quotes={leadershipQuotes}
              bio={[
                "As General Manager, Ayman El-Mohamady Sakr leads ACTS' day-to-day operations and the engineering capability behind them, holding sole agency in Egypt for three Curtiss-Wright divisions.",
                "Under his direction, ACTS has grown from a Giza-based trading firm into a full-service partner for valves, control equipment, and heat-exchanger maintenance, serving operators across Oil & Gas, Petrochemical, Power Generation, and Fertilizer industries from ACTS' headquarters in Sheikh Zayed City, Giza.",
                "His approach favors single-point technical accountability over transactional selling: one dedicated contact per account, structured project management from enquiry to delivery, and an aftermarket program that keeps safety and control equipment in service long after installation.",
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="mission" className="scroll-anchor py-4 pb-16">
        <div className="max-w-4xl mx-auto px-safe grid sm:grid-cols-2 gap-6">
          <Reveal>
            <SpotlightCard className="card-lift group h-full rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-colors hover:border-brand/40">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                  Vision
                </div>
                <CardLogoMark />
              </div>
              <p className="mt-4 text-lg font-semibold text-navy leading-snug">
                To be the most trusted engineering partner behind Egypt&apos;s
                critical industrial processes, for today&apos;s equipment and
                tomorrow&apos;s technology.
              </p>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={100}>
            <SpotlightCard className="card-lift group h-full rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-colors hover:border-brand/40">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[13px] font-bold text-brand uppercase tracking-widest">
                  Mission
                </div>
                <CardLogoMark />
              </div>
              <p className="mt-4 text-lg font-semibold text-navy leading-snug">
                To bring global engineering standards to every valve,
                exchanger, and process system we support, combining technical
                excellence, integrity, and responsive local service so our
                customers operate safely, efficiently, and with confidence.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* Goals — navy band */}
      <section id="goals" className="scroll-anchor bg-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl mx-auto"
              align="center"
              tone="dark"
              title="Our Goals"
              subtitle="What we're working toward"
            />
          </Reveal>
          {/* Two by two, not three across. There are four goals, and a
              three-column grid left the fourth stranded alone beside two
              empty columns, which read as a layout that had lost a card
              rather than a deliberate set. Two columns also matches "How We
              Operate" and "Looking Ahead" below, so the whole lower half of
              the page keeps one rhythm. */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {mission.map((m, i) => (
              <Reveal key={m.num} delay={i * 90}>
                <SpotlightCard
                  color="rgba(240, 196, 25, 0.1)"
                  className="relative h-full overflow-hidden bg-navy-800 rounded-2xl border border-white/10 p-6 hover:border-amber/50 hover:bg-navy-700 transition-colors"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 text-amber font-extrabold flex items-center justify-center">
                        {m.num}
                      </div>
                      <CardLogoMark surface="dark" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
                    <p className="mt-2 text-[15px] text-white/65">
                      {m.description}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Looking ahead — the forward direction the new brand story leads with.
          Sits between the goals band and the values so the page reads
          past → ambition → operating principles. */}
      <section id="looking-ahead" className="scroll-anchor py-20">
        <div className="max-w-6xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl"
              title="Looking Ahead"
              subtitle="Investing in the future of process industries"
              lede="As Egypt's Oil & Gas, Petrochemical, and Fertilizer sectors evolve, ACTS is committed to bringing modern, technology-driven solutions into how we support our customers. Not just supplying equipment, but helping plants run smarter."
            />
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {forwardDirection.map((f, i) => {
              const Icon = forwardIcons[i] ?? Radar;
              return (
                <Reveal key={f.title} delay={i * 90}>
                  <SpotlightCard className="card-lift group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-brand/40">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <Icon size={20} strokeWidth={2.25} />
                      </span>
                      <CardLogoMark />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-navy">{f.title}</h3>
                    <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                      {f.description}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 max-w-3xl text-[15px] text-gray-600 leading-relaxed">
              As these technologies mature, ACTS intends to be the partner that
              brings them into Egyptian plants, combining our sole-agency
              access to Farris, Dyna-Flo, and EST with a growing focus on
              smarter, more connected process equipment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl mx-auto"
              align="center"
              title="Our Values"
              subtitle="How our values show up in the work"
            />
          </Reveal>
          {/* Five values, three over two, as cards rather than as loose
              numbered paragraphs — the same object the rest of the page uses
              to hold a titled point.

              The formation is what the six-column track is for. In two
              columns the fifth value was stranded at the foot of the section
              beside an empty half page, reading as a list that had run out
              rather than as a set of five. Each card spans two of six and the
              fourth starts one column in, so the last two land centred under
              the first three. Between `sm` and `lg` there are only two
              columns to work with, where the last card goes full width for
              the same reason. */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {values.map((v, i) => (
              <Reveal
                key={v.name}
                delay={i * 80}
                className={`lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""} ${
                  i === values.length - 1 ? "sm:max-lg:col-span-2" : ""
                }`}
              >
                <SpotlightCard className="card-lift group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-brand/40">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-fluid-h4 font-extrabold tabular-nums text-brand-dark/70 transition-colors group-hover:text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CardLogoMark />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy">{v.name}</h3>
                  <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">
                    {v.description}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we specialize in */}
      <section id="specializations" className="scroll-anchor py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl"
              title="What We Specialize In"
              subtitle="Exclusive agent for three Curtiss-Wright divisions"
              lede="ACTS is the exclusive agent in Egypt for three Curtiss-Wright divisions: Farris Engineering, Dyna-Flo Control Valve Services, and EST. That gives customers access to an integrated portfolio spanning safety, control, and thermal management."
            />
          </Reveal>
          <div className="mt-12 space-y-4">
            {specializations.map((s, i) => {
              const [brand, ...rest] = s.name.split(":");
              const spec = rest.join(":").trim();
              return (
                <Reveal key={s.name} delay={i * 100}>
                  <SpotlightCard className="accent-bar group card-lift bg-white rounded-2xl border border-gray-200 p-7 pl-8 shadow-sm hover:border-brand/40">
                    <div className="grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,19rem)_1fr] md:items-baseline">
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand">
                          {String(i + 1).padStart(2, "0")} · {brand.trim()}
                        </div>
                        <h3 className="mt-1 text-fluid-h4 font-bold text-navy leading-snug">
                          {spec || brand.trim()}
                        </h3>
                      </div>
                      <p className="text-[15px] text-gray-600 leading-relaxed">
                        {s.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={150}>
            <p className="mt-10 text-[15px] text-gray-600 max-w-3xl">
              Our in-house engineering team supports customers from initial
              sizing and selection through post-sales troubleshooting and
              aftermarket service. This combines safety, control, and
              thermal expertise into a single, coordinated offer that meets
              international standards (ASME, PED, API) and reduces
              procurement complexity.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How we operate */}
      <section id="how-we-operate" className="scroll-anchor py-20">
        <div className="max-w-6xl mx-auto px-safe">
          <Reveal>
            <SectionHeading
              className="max-w-2xl mx-auto"
              align="center"
              title="How We Operate"
              subtitle="Advisory-led, not just transactional"
            />
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 gap-5">
            {howWeOperate.map((h, i) => {
              const Icon = h.icon;
              return (
                <Reveal key={h.title} delay={i * 90}>
                  <div className="group flex h-full gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-brand/40">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Icon size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                      {/* The mark shares the title's line here rather than
                          the icon's, because on these cards the icon sits in
                          its own column — at a fixed 104px that crowded
                          titles this long into three wrapped lines below
                          `lg`. Fluid instead of dropped: it shrinks with the
                          row rather than disappearing from it. Vertical
                          cards elsewhere on the page keep the fixed 104px
                          mark at every width, because there it has a line
                          of its own. */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-navy">{h.title}</h3>
                        <CardLogoMark width="min(35%, 12rem)" />
                      </div>
                      <p className="mt-1.5 text-[15px] text-gray-600 leading-relaxed">
                        {h.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Headquarters */}
      <section id="offices" className="scroll-anchor py-20">
        <div className="max-w-6xl mx-auto px-safe">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal>
                <SectionHeading
                  title="Our Headquarters"
                  subtitle="Where to find us"
                />
              </Reveal>
              <div className="mt-8 space-y-5">
                {offices.map((o, i) => (
                  <Reveal key={o.tag} delay={i * 120}>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${o.name}, ${o.address} — open in Google Maps`}
                    >
                      <SpotlightCard className="card-lift bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex gap-4 cursor-pointer">
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
                      </SpotlightCard>
                    </a>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Magnetic>
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25"
                    >
                      Contact us
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </Magnetic>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-white text-navy border border-gray-300 hover:border-navy hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                  >
                    Explore our products &amp; services
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={150}>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Arkan+Plaza+Sheikh+Zayed+Giza"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Arkan Plaza location in Google Maps"
                className="img-zoom relative block rounded-2xl overflow-hidden shadow-xl shadow-navy/15 aspect-1264/843"
              >
                <Image
                  src="/images/arkan-plaza.jpg"
                  alt="Arkan Plaza's lit promenade at night, ACTS' headquarters complex in Sheikh Zayed City"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing mark — a split-flap sign spelling ACTS, purely decorative.
          Same dark-band atmosphere (bg-ink, blueprint, brass mesh, vignette)
          as the homepage's closing CTA, so the page's last word carries the
          same weight as its first — the hero above opens on this exact
          treatment. A brass ShineBorder rim on the case itself, rather than
          on the page band, keeps the shimmer on the object being lit rather
          than smeared across the whole section. */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 blueprint"
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 90% at 50% 50%, black 20%, transparent 75%)",
            }}
          />
          <div className="mesh mesh-brass w-152 h-152 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="dark-vignette" />
        </div>
        <div className="relative max-w-6xl mx-auto px-safe flex justify-center">
          {/* w-full at every layer down to the grid itself: each is a flex
              item or wraps one sized by its content by default, and the
              matrix's own width is a 100%-of-parent chain all the way down
              (case -> ShineBorder -> Reveal) — breaking the chain at any one
              link collapses the whole thing to its min-content width. */}
          <Reveal className="w-full">
            <ShineBorder borderRadius={24} duration={16} className="w-full">
              <FlipDiskMatrixLazy />
            </ShineBorder>
          </Reveal>
        </div>
      </section>

      <SiteDock
        sections={[
          { id: "timeline", label: "Our Journey", icon: <History className="h-full w-full" strokeWidth={2.25} /> },
          { id: "leadership", label: "Leadership", icon: <UserRound className="h-full w-full" strokeWidth={2.25} /> },
          { id: "mission", label: "Vision & Mission", icon: <Lightbulb className="h-full w-full" strokeWidth={2.25} /> },
          { id: "goals", label: "Our Goals", icon: <TrendingUp className="h-full w-full" strokeWidth={2.25} /> },
          { id: "looking-ahead", label: "Looking Ahead", icon: <Radar className="h-full w-full" strokeWidth={2.25} /> },
          { id: "specializations", label: "Specializations", icon: <Wrench className="h-full w-full" strokeWidth={2.25} /> },
          { id: "how-we-operate", label: "How We Operate", icon: <Headset className="h-full w-full" strokeWidth={2.25} /> },
          { id: "offices", label: "Our Headquarters", icon: <MapPin className="h-full w-full" strokeWidth={2.25} /> },
        ]}
      />
    </>
  );
}
