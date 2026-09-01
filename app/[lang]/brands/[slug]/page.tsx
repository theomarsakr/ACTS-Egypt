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
import ProductShowcase from "@/components/brands/ProductShowcaseLazy";
import { brandHeroVideo, galleryAnchorId } from "@/lib/brandMedia";
import ProductFlipCard from "@/components/ProductFlipCard";
import CountUp from "@/components/CountUp";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Magnetic from "@/components/ui/Magnetic";
import BorderBeam from "@/components/ui/BorderBeam";
import {
  brands,
  getBrand,
  groupGalleryByCategory,
  productLineAnchorId,
  sectorHref,
} from "@/lib/data";
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
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";
import {
  SITE_URL,
  brandEntitySchema,
  breadcrumbSchema,
  buildMetadata,
  fullTitle,
  itemListSchema,
} from "@/lib/seo";

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
        desc: "2D/3D CAD models and general-arrangement drawings for engineering, layout and integration, available on request.",
        href: "/contact",
        cta: "Request drawings",
      },
      {
        img: "/Data/Farris-Valves/images/DIRECTIONAL-CONTROL-VALVES.jpg",
        title: "Directional Control Valves",
        desc: "Farris directional control valves for agricultural, industrial and mobile hydraulic systems, with power-beyond and high-flow options.",
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
        img: "/Data/EST/images/Product-Photos/Field-Services-2.jpg",
        title: "Field Services",
        desc: "A full range of on-site services for tubular heat exchangers, condensers and oil coolers: plugging, pulling, sleeving and testing.",
        href: "/contact",
        cta: "Request field service",
      },
      {
        img: "/Data/EST/images/Product-Photos/Hydrostatic-Test-2.jpg",
        title: "Testing & Inspection",
        desc: "Tube, pipe and pressure-vessel testing and inspection, including hydrostatic testing applications and integrity verification.",
        href: "/contact",
        cta: "Talk to ACTS",
      },
      {
        img: "/Data/EST/images/Product-Photos/Tube-Sleeve-Before-After.png",
        title: "Tube Sleeving, Plugging & Pulling",
        desc: "Engineered tube repair: Hydra-Loc® sleeving, Pop-A-Plug® plugging and controlled tube pulling to extend asset life.",
        href: "/contact",
        cta: "Enquire",
      },
      {
        img: "/Data/EST/images/Product-Photos/Tooling-Package.png",
        title: "Complete Tooling Packages",
        desc: "Turnkey tooling packages that bundle the plugs, rams and accessories needed for a full turnaround scope.",
        href: "/contact",
        cta: "Request a package",
      },
      {
        img: "/Data/EST/images/Product-Photos/Group_Photo-2.png",
        title: "On-Site Training",
        desc: "Hands-on operator training so your crews can install, test and maintain EST equipment safely and repeatably.",
        href: "/contact",
        cta: "Book training",
      },
      {
        img: "/Data/EST/images/Product-Photos/Global-Presence-2.jpg",
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
  return buildMetadata({
    title: brand.seoTitle,
    description: brand.seoDescription,
    path: `/brands/${slug}`,
    image: brand.image,
    imageAlt: brand.imageAlt,
  });
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

  // Same idea, but for strip photos that only exist as a raw catalog shot in
  // the Engineering Hub (no polished gallery card) — link those down to their
  // Hub product section instead. Gallery entries win if a photo has both.
  const hubHref: Record<string, string> = {};
  if (hub) {
    for (const product of hub.products) {
      for (const image of product.images) {
        hubHref[image] ??= `#hubview-${product.id}`;
      }
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

  /* Structured data for the brand landing page.
   *
   * `about` names the brand as the Curtiss-Wright division it actually is, and
   * shares its `@id` with the layout's Organization node and every product
   * page below it — so "Curtiss-Wright Egypt", "Farris Egypt" and a specific
   * series page all resolve to one entity chain rather than three unrelated
   * mentions. The ItemList publishes the catalog: without it the 45 product
   * pages look like orphan leaves rather than a brand's range. No Offer is
   * emitted anywhere — the site quotes on request and does not publish prices
   * or stock, and inventing either would be a fabricated rich result. */
  const brandSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/brands/${slug}#webpage`,
      url: `${SITE_URL}/brands/${slug}`,
      name: fullTitle(brand.seoTitle),
      description: brand.seoDescription,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: brandEntitySchema(slug, brand.description),
      provider: { "@id": `${SITE_URL}/#organization` },
      primaryImageOfPage: `${SITE_URL}${brand.image}`,
    },
    breadcrumbSchema([
      { name: "Brands", path: "/brands" },
      { name: brand.name, path: `/brands/${slug}` },
    ]),
    ...(hub && hub.products.length
      ? [
          itemListSchema(
            `${brand.name} products supplied in Egypt by ACTS`,
            hub.products.map((p) => ({
              name: p.name,
              path: `/brands/${slug}/products/${p.id}`,
            }))
          ),
        ]
      : []),
  ];

  return (
    <>
      <JsonLd schema={brandSchema} />
      {/* Cinematic hero — brand-film loop (or still photo) behind a navy scrim */}
      <section
        id="overview"
        className="relative flex min-h-[88svh] items-center overflow-hidden bg-navy"
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
              preload
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

        <div className="relative w-full max-w-6xl mx-auto px-safe py-12 sm:py-20 md:py-24 lg:py-28">
          <Reveal>
            <Link
              href="/brands"
              className="tap-target group inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5"
              />{" "}
              All brands
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              as="h1"
              tier="hero"
              tone="dark"
              className="mt-8 [&>h1]:drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
              eyebrow={`${brand.no} · ${brand.origin.split("·")[0].trim()}`}
              title={brand.seoHeading}
              subtitle={brand.category}
            />
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-7 text-fluid-lede text-white/70 max-w-2xl">
              {brand.description}
            </p>
            <div
              className="mt-7 flex flex-wrap gap-2"
              style={{ "--chip-count": brand.sectors.length } as React.CSSProperties}
            >
              {brand.sectors.map((s, i) => (
                <Link
                  key={s}
                  href={sectorHref(s)}
                  style={{ "--i": i } as React.CSSProperties}
                  className="sector-chip-dark text-[13px] font-medium border backdrop-blur rounded-full px-3 py-1 transition-colors"
                >
                  {s}
                </Link>
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

      <section className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-safe">
          <div id="products" className="scroll-anchor">
            <Reveal>
              <SectionHeading
                eyebrow="Product range"
                title="Product Lines"
                subtitle={`${brand.productLines.length} ${brand.name} series available through ACTS`}
                lede="Each line links through to its own products, specifications and documents."
                ledeClassName="max-w-2xl"
              />
            </Reveal>
          </div>
          <div
            className={`mt-9 grid items-start sm:grid-cols-2 gap-4 ${
              brand.gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {brand.productLines.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <ProductLineCard
                  line={p}
                  anchorId={productLineAnchorId(p)}
                  galleryHref={galleryHref}
                  hubHref={hubHref}
                />
              </Reveal>
            ))}
          </div>

          {/* Scroll-driven 3D turntable of each brand's flagship product,
              modeled procedurally in three.js with spec callouts from the hub
              data — then docked into its real-world installation. */}
          <ProductShowcase slug={brand.slug} />

          {hub && (
            <div id="engineering-hub" className="mt-10 sm:mt-20 scroll-anchor">
              <Reveal>
                <SectionHeading
                  eyebrow={
                    <>
                      <Layers size={15} /> Engineering hub
                    </>
                  }
                  title="Engineering Hub"
                  subtitle={`Explore the full ${brand.name} range`}
                  lede="Open any product for its overview, key features, engineering benefits, technical specifications, certifications and every matching brochure, catalog and manual, grouped in one place."
                  ledeClassName="max-w-2xl"
                />
              </Reveal>
              <div className="mt-9">
                <ProductHub
                  brandSlug={brand.slug}
                  brandLabel={brand.productHeadingPrefix ?? brand.name}
                  products={hub.products}
                  groups={hub.groups}
                  industries={brand.sectors}
                />
              </div>
            </div>
          )}

          {brand.gallery && (
            <div id="gallery" className="mt-10 sm:mt-20 scroll-anchor">
              <Reveal>
                <SectionHeading
                  eyebrow="Product gallery"
                  title="From the Field"
                  subtitle={
                    <>
                      <CountUp value={brand.gallery.length} className="tabular-nums" />{" "}
                      real {brand.name} products, supplied by ACTS
                    </>
                  }
                  lede="Tap a photo to flip it and see valve details."
                />
              </Reveal>
              <div className="mt-9 space-y-12">
                {groupGalleryByCategory(brand.gallery).map((group) => (
                  <div key={group.category}>
                    <Reveal>
                      <div className="flex items-center gap-3">
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
                                alt={`${brand.name}: ${g.caption}`}
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
            <div id="tools-support" className="mt-10 sm:mt-20 scroll-anchor">
              <Reveal>
                <SectionHeading
                  eyebrow={
                    <>
                      <Wrench size={15} /> Tools &amp; support
                    </>
                  }
                  title="Software, Services & Support"
                  subtitle={tools.heading}
                  lede={tools.blurb}
                  ledeClassName="max-w-2xl"
                />
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
                        <h3 className="text-fluid-h5 font-bold text-navy">
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
                            className="tap-target mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand hover:text-brand-dark transition-colors"
                          >
                            {tool.cta}
                            <ArrowUpRight size={15} />
                          </a>
                        ) : (
                          <Link
                            href={tool.href}
                            className="tap-target mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand hover:text-brand-dark transition-colors"
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
            <div id="engineering-resources" className="mt-10 sm:mt-20 scroll-anchor">
              <Reveal>
                <SectionHeading
                  eyebrow={
                    <>
                      <Layers size={15} /> Resource center
                    </>
                  }
                  title="Engineering Documents"
                  subtitle={`${hub.totalDocs} ${brand.name} PDFs, searchable and filterable`}
                  lede="Every brochure, catalog, bulletin, manual, technical procedure and certification, filterable by product and type. View or download instantly."
                  ledeClassName="max-w-2xl"
                />
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
            <BorderBeam className="mt-8 sm:mt-14 relative overflow-hidden rounded-2xl bg-navy p-6 sm:p-8 md:p-12 shadow-xl shadow-navy/15">
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
                  <SectionHeading
                    as="h3"
                    tier="md"
                    tone="dark"
                    title={`Interested in ${brand.name}?`}
                    subtitle="Tell us the series, size and service conditions"
                    lede="Send us your requirement and we'll come back with a quotation, typically within 24 hours."
                    ledeClassName="max-w-lg"
                  />
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
            </BorderBeam>
          </Reveal>
        </div>
      </section>
    </>
  );
}
