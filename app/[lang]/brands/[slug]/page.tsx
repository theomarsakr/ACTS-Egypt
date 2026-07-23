import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import BrandHeroVideo from "@/components/brands/BrandHeroVideo";
import ProductLineCard from "@/components/brands/ProductLineCard";
import ProductShowcase from "@/components/brands/ProductShowcase";
import { brandHeroVideo, galleryAnchorId } from "@/lib/brandMedia";
import ProductFlipCard from "@/components/ProductFlipCard";
import CountUp from "@/components/CountUp";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import { brands, getBrand, groupGalleryByCategory } from "@/lib/data";
import {
  HUB_BRANDS,
  getBrandHubData,
  hubGalleryDocLink,
  hubPrimaryDoc,
} from "@/lib/brandHub";
import FloatingNav, {
  type FloatingNavSection,
} from "@/components/ui/floating-nav";
import ProductHub from "@/components/brands/hub/ProductHub";
import ResourceCenter from "@/components/brands/hub/ResourceCenter";

type Props = {
  params: Promise<{ slug: string }>;
};

type ToolCard = {
  img: string;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
  cta: string;
};

// "Beyond the valve" bands — surface each brand's remaining images and its
// software / monitoring / service offerings. Brands without one simply omit the
// section (and the corresponding nav item).
const BRAND_TOOLS: Record<string, { heading: string; blurb: string; cards: ToolCard[] }> = {
  "farris-engineering": {
    heading: "Beyond the valve",
    blurb:
      "Digital tools, condition monitoring and factory-backed aftermarket services that support Farris equipment through its whole lifecycle.",
    cards: [
      {
        img: "/Data/Farris-Valves/images/inSure.png",
        title: "iNSURE® Monitoring",
        desc: "Real-time relief-valve monitoring that detects pressure events through valve-stem movement and streams data to an app or DCS.",
        href: "https://valves.curtisswright.com/en-us/services/farris/insure-monitoring-device",
        external: true,
        cta: "Explore device",
      },
      {
        img: "/Data/Farris-Valves/images/SizeMaster-Relief-System-Sizing-Software.jpg",
        title: "SizeMaster™ Sizing Software",
        desc: "Free web-based relief-system sizing per API 521, covering every Farris series from 1890 to 6400/6600.",
        href: "http://www.sizemaster.com/",
        external: true,
        cta: "Open SizeMaster",
      },
      {
        img: "/Data/Farris-Valves/images/FARRIS-FAST-NETWORK.jpg",
        title: "Farris FAST Network",
        desc: "Factory-authorized service and repair network for recertification and aftermarket support across the valve lifecycle.",
        href: "/contact",
        cta: "Talk to ACTS",
      },
      {
        img: "/Data/Farris-Valves/images/FARRIS-AFTERMARKET-SERVICES.jpg",
        title: "Aftermarket Services",
        desc: "Overhaul, repair and recertification that keep installed valves in code compliance and maximise uptime.",
        href: "/contact",
        cta: "Request service",
      },
      {
        img: "/Data/Farris-Valves/images/CAD-Drawings.jpg",
        title: "CAD Models & Drawings",
        desc: "2D/3D CAD models and general-arrangement drawings for engineering, layout and integration — available on request.",
        href: "/contact",
        cta: "Request drawings",
      },
      {
        img: "/Data/Farris-Valves/images/DIRECTIONAL-CONTROL-VALVES.jpg",
        title: "Directional Control Valves",
        desc: "Farris directional control valves for agricultural, industrial and mobile hydraulic systems — power-beyond, high-flow options.",
        href: "https://valves.curtisswright.com/en-us/products/directional-control-valves",
        external: true,
        cta: "Learn more",
      },
    ],
  },
  est: {
    heading: "Field services & global support",
    blurb:
      "Beyond the tools, EST Group delivers on-site engineered services and a global network that keep heat exchangers, condensers and pipework running.",
    cards: [
      {
        img: "/Data/EST/images/Product-Photos/Field-Services.jpg",
        title: "Field Services",
        desc: "A full range of on-site services for tubular heat exchangers, condensers and oil coolers — plugging, pulling, sleeving and testing.",
        href: "/contact",
        cta: "Request field service",
      },
      {
        img: "/Data/EST/images/Product-Photos/Hydrostatic-Test.jpg",
        title: "Testing & Inspection",
        desc: "Tube, pipe and pressure-vessel testing and inspection, including hydrostatic testing applications and integrity verification.",
        href: "/contact",
        cta: "Talk to ACTS",
      },
      {
        img: "/Data/EST/images/Product-Photos/Tube-Sleeve-Before-After.jpg",
        title: "Tube Sleeving, Plugging & Pulling",
        desc: "Engineered tube repair — Hydra-Loc® sleeving, Pop-A-Plug® plugging and controlled tube pulling to extend asset life.",
        href: "/contact",
        cta: "Enquire",
      },
      {
        img: "/Data/EST/images/Product-Photos/Tooling-Package.jpg",
        title: "Complete Tooling Packages",
        desc: "Turnkey tooling packages that bundle the plugs, rams and accessories needed for a full turnaround scope.",
        href: "/contact",
        cta: "Request a package",
      },
      {
        img: "/Data/EST/images/Product-Photos/Group_Photo-2.jpg",
        title: "On-Site Training",
        desc: "Hands-on operator training so your crews can install, test and maintain EST equipment safely and repeatably.",
        href: "/contact",
        cta: "Book training",
      },
      {
        img: "/Data/EST/images/Product-Photos/Global-Presence.jpg",
        title: "Global Presence",
        desc: "Headquartered in Hatfield, PA with offices in the Netherlands and Singapore and a worldwide representative network.",
        href: "https://valves.curtisswright.com/en-us/EST",
        external: true,
        cta: "Learn more",
      },
    ],
  },
};

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const isHub = HUB_BRANDS.includes(brand.slug);
  const hub = isHub ? getBrandHubData(brand.slug) : null;
  const tools = BRAND_TOOLS[brand.slug] ?? null;
  const heroVideo = brandHeroVideo[brand.slug] ?? null;

  // Deep-link each product-line strip photo to its matching gallery card below.
  const galleryHref: Record<string, string> = {};
  if (brand.gallery) {
    for (const g of brand.gallery) {
      galleryHref[g.src] = `#${galleryAnchorId(g.src)}`;
    }
  }

  // Section dock items — short labels fit the floating pill; `title` keeps the
  // full section name for tooltips and screen readers.
  const navSections: FloatingNavSection[] = [
    { id: "overview", label: "Overview", icon: "Home" },
    { id: "products", label: "Products", title: "Product Range", icon: "Package" },
    ...(hub
      ? [
          {
            id: "engineering-hub",
            label: "Hub",
            title: "Engineering Hub",
            icon: "Layers",
          } as const,
        ]
      : []),
    ...(brand.gallery
      ? [{ id: "gallery", label: "Gallery", icon: "Images" } as const]
      : []),
    ...(tools
      ? [
          {
            id: "tools-support",
            label: "Tools",
            title: "Tools & Support",
            icon: "Wrench",
          } as const,
        ]
      : []),
    ...(hub
      ? [
          {
            id: "engineering-resources",
            label: "Docs",
            title: "Resource Center",
            icon: "BookOpen",
          } as const,
        ]
      : []),
  ];

  return (
    <>
      {/* Cinematic hero — brand-film loop (or still photo) behind a navy scrim */}
      <section
        id="overview"
        className="relative flex min-h-[88vh] items-center overflow-hidden bg-navy"
      >
        {/* Background media */}
        {heroVideo ? (
          <BrandHeroVideo
            src={heroVideo.src}
            srcMobile={heroVideo.srcMobile}
            poster={heroVideo.poster}
            dim={heroVideo.dim}
          />
        ) : (
          <div className="absolute inset-0" aria-hidden>
            <Image
              src={brand.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45 animate-slow-zoom"
            />
          </div>
        )}
        {/* Scrims: left-weighted wash keeps copy crisp, bottom vignette blends
            the section into the page and adds cinematic depth. */}
        <div
          className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/40"
          aria-hidden
        />
        {/* via-40% pins the strong band low, where the brand films draw their
            embedded lower-third captions — it fades them out under the copy. */}
        <div
          className="absolute inset-0 bg-linear-to-t from-navy via-navy/45 via-40% to-navy/10"
          aria-hidden
        />
        <div className="dark-vignette" aria-hidden />

        <div className="relative w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
          <Reveal>
            <Link
              href="/brands"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5"
              />{" "}
              All brands
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 text-[13px] font-bold text-amber uppercase tracking-[0.2em]">
              {brand.no} · {brand.origin.split("·")[0].trim()}
            </div>
            <h1 className="mt-3 text-[2.6rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
              {brand.name}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-8 bg-amber/70" aria-hidden />
              <span className="text-lg font-semibold text-amber">
                {brand.category}
              </span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-2xl">
              {brand.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {brand.sectors.map((s) => (
                <span
                  key={s}
                  className="text-[13px] font-medium text-white/85 bg-white/10 border border-white/20 backdrop-blur rounded-full px-3 py-1"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  href={`/quote?brand=${brand.slug}`}
                  className="btn btn-primary px-6 py-3 text-[15px]"
                >
                  Get a quote
                  <ArrowRight size={16} />
                </Link>
              </Magnetic>
              <a
                href="#products"
                className="btn btn-ghost-dark px-6 py-3 text-[15px]"
              >
                Explore product range
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {isHub && <FloatingNav sections={navSections} />}

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div id="products" className="scroll-mt-40">
            <Reveal>
              <div className="text-[13px] font-bold uppercase tracking-widest text-brand">
                Product range
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                {brand.productLines.length} product lines available through ACTS
              </h2>
            </Reveal>
          </div>
          <div
            className={`mt-9 grid items-start sm:grid-cols-2 gap-4 ${
              brand.gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {brand.productLines.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <ProductLineCard line={p} galleryHref={galleryHref} />
              </Reveal>
            ))}
          </div>

          {/* Scroll-driven 3D turntable of each brand's flagship product,
              modeled procedurally in three.js with spec callouts from the hub
              data — then docked into its real-world installation. */}
          <ProductShowcase slug={brand.slug} />

          {hub && (
            <div id="engineering-hub" className="mt-20 scroll-mt-40">
              <Reveal>
                <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-brand">
                  <Layers size={15} /> Engineering hub
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                  Explore the full {brand.name} range
                </h2>
                <p className="mt-2 text-[15px] text-gray-500 max-w-2xl">
                  Open any product for its overview, key features, engineering
                  benefits, technical specifications, certifications and every
                  matching brochure, catalog and manual — grouped in one place.
                </p>
              </Reveal>
              <div className="mt-9">
                <ProductHub
                  products={hub.products}
                  groups={hub.groups}
                  industries={brand.sectors}
                />
              </div>
            </div>
          )}

          {brand.gallery && (
            <div id="gallery" className="mt-20 scroll-mt-40">
              <Reveal>
                <div className="text-[13px] font-bold uppercase tracking-widest text-brand">
                  Product gallery
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                  <CountUp value={brand.gallery.length} className="tabular-nums" /> real{" "}
                  {brand.name} products, supplied by ACTS
                </h2>
                <p className="mt-2 text-[15px] text-gray-500">
                  Tap a photo to flip it and see valve details.
                </p>
              </Reveal>
              <div className="mt-9 space-y-12">
                {groupGalleryByCategory(brand.gallery).map((group) => (
                  <div key={group.category}>
                    <Reveal>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-px bg-brand/50 shrink-0" />
                        <h3 className="text-sm font-bold text-navy uppercase tracking-wide">
                          {group.category}
                        </h3>
                        <CountUp
                          value={group.items.length}
                          className="text-sm text-gray-500 tabular-nums"
                        />
                      </div>
                    </Reveal>
                    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {group.items.map((g, i) => {
                        const dl =
                          isHub && hub
                            ? hubGalleryDocLink(brand.slug, g.detail.tag)
                            : null;
                        const product =
                          dl?.productId && hub
                            ? hub.products.find((p) => p.id === dl.productId)
                            : null;
                        const pdf = product ? hubPrimaryDoc(product) : null;
                        return (
                          <Reveal key={g.src} delay={i * 60}>
                            <div
                              id={galleryAnchorId(g.src)}
                              className="gallery-anchor"
                            >
                              <ProductFlipCard
                                item={g}
                                alt={`${brand.name} — ${g.caption}`}
                                docHref={dl?.href}
                                docLabel={dl?.label}
                                pdfHref={pdf?.href}
                                pdfLabel={pdf ? "View PDF" : undefined}
                              />
                            </div>
                          </Reveal>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tools && (
            <div id="tools-support" className="mt-20 scroll-mt-40">
              <Reveal>
                <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-brand">
                  <Wrench size={15} /> Software, services &amp; support
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                  {tools.heading}
                </h2>
                <p className="mt-2 text-[15px] text-gray-500 max-w-2xl">
                  {tools.blurb}
                </p>
              </Reveal>
              <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tools.cards.map((tool, i) => (
                  <Reveal key={tool.title} delay={i * 60}>
                    <SpotlightCard className="card-lift group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-brand/40">
                      <div className="img-zoom relative aspect-video overflow-hidden bg-gray-100">
                        <Image
                          src={tool.img}
                          alt={tool.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-[16px] font-bold text-navy">
                          {tool.title}
                        </h3>
                        <p className="mt-1.5 text-[13.5px] text-gray-500 leading-relaxed">
                          {tool.desc}
                        </p>
                        {tool.external ? (
                          <a
                            href={tool.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand hover:text-brand-dark transition-colors"
                          >
                            {tool.cta}
                            <ArrowUpRight size={15} />
                          </a>
                        ) : (
                          <Link
                            href={tool.href}
                            className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand hover:text-brand-dark transition-colors"
                          >
                            {tool.cta}
                            <ArrowRight size={15} />
                          </Link>
                        )}
                      </div>
                    </SpotlightCard>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {hub && (
            <div id="engineering-resources" className="mt-20 scroll-mt-40">
              <Reveal>
                <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-brand">
                  <Layers size={15} /> Engineering resource center
                </div>
                <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
                  {hub.totalDocs} {brand.name} engineering documents
                </h2>
                <p className="mt-2 text-[15px] text-gray-500 max-w-2xl">
                  Every brochure, catalog, bulletin, manual, technical procedure
                  and certification — searchable and filterable by product and
                  type. View or download instantly.
                </p>
              </Reveal>
              <div className="mt-9">
                <ResourceCenter
                  categories={hub.categories}
                  seriesOptions={hub.seriesOptions}
                  docTypes={hub.docTypes}
                />
              </div>
            </div>
          )}

          <Reveal>
            <div className="border-beam mt-14 relative overflow-hidden rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15">
              <div className="absolute inset-0" aria-hidden>
                <Image
                  src="/images/refinery-blue.jpg"
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover opacity-25"
                />
              </div>
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Interested in {brand.name} products?
                  </h3>
                  <p className="mt-2 text-[15px] text-white/75 max-w-lg">
                    Send us your requirement (series, size and service
                    conditions) and we&apos;ll come back with a quotation.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Magnetic>
                    <Link
                      href={`/quote?brand=${brand.slug}`}
                      className="group inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5"
                    >
                      Get a quote
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </Magnetic>
                  <a
                    href={brand.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                  >
                    Manufacturer site <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
