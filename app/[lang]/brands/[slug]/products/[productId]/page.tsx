import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Droplets,
  Factory,
  FileText,
  Layers,
  Link2,
  Play,
  Table2,
  Zap,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import BorderBeam from "@/components/ui/BorderBeam";
import DocCard from "@/components/brands/hub/DocCard";
import { Gallery, VideoCard } from "@/components/brands/hub/ProductHub";
import SectionHeading from "@/components/SectionHeading";
import { getBrand } from "@/lib/data";
import { HUB_BRANDS, getBrandHubData, type HubDoc, type HubProduct } from "@/lib/brandHub";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.actsegypt.com";

type Props = {
  params: Promise<{ slug: string; productId: string }>;
};

function lookup(slug: string, productId: string) {
  const brand = getBrand(slug);
  const hub = getBrandHubData(slug);
  if (!brand || !hub) return null;
  const product = hub.products.find((p) => p.id === productId);
  if (!product) return null;
  return { brand, hub, product };
}

export function generateStaticParams() {
  return HUB_BRANDS.flatMap((slug) => {
    const hub = getBrandHubData(slug);
    return (hub?.products ?? []).map((p) => ({ slug, productId: p.id }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, productId } = await params;
  const found = lookup(slug, productId);
  if (!found) return {};
  const { brand, product } = found;
  const description =
    `${product.tagline} ACTS is ${brand.name}'s exclusive representative in Egypt, supplying and supporting the ${product.name}.`.slice(
      0,
      300
    );
  return {
    title: `${product.name} — ${brand.name}`,
    description,
    alternates: { canonical: `/brands/${slug}/products/${productId}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productId } = await params;
  const found = lookup(slug, productId);
  if (!found) notFound();
  const { brand, hub, product: p } = found;

  const related = (p.related ?? [])
    .map((id) => hub.products.find((x) => x.id === id))
    .filter((x): x is HubProduct & { docs: HubDoc[] } => Boolean(x));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.overview,
    image: p.images.map((img) => `${siteUrl}${img}`),
    sku: p.code,
    category: p.family,
    brand: { "@type": "Brand", name: brand.name },
    manufacturer: { "@type": "Organization", name: brand.name },
    ...(p.specs?.length
      ? {
          additionalProperty: p.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${siteUrl}/brands` },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.name,
        item: `${siteUrl}/brands/${slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: p.name,
        item: `${siteUrl}/brands/${slug}/products/${productId}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="relative max-w-6xl mx-auto px-safe pt-12 pb-10 md:pt-16 md:pb-12">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-white/50"
            >
              <Link
                href="/brands"
                className="inline-flex items-center pointer-coarse:min-h-11 hover:text-white transition-colors"
              >
                Brands
              </Link>
              <span aria-hidden>/</span>
              <Link
                href={`/brands/${slug}`}
                className="inline-flex items-center pointer-coarse:min-h-11 hover:text-white transition-colors"
              >
                {brand.name}
              </Link>
              <span aria-hidden>/</span>
              <span className="text-white/80">{p.name}</span>
            </nav>

            <Link
              href={`/brands/${slug}#hub-${p.id}`}
              className="tap-target group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5"
              />{" "}
              Back to {brand.name}
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white px-2.5 py-1 text-[12px] font-bold tracking-wide text-navy">
                {p.code}
              </span>
              {p.standard && (
                <span className="rounded-md bg-amber/20 px-2.5 py-1 text-[12px] font-bold tracking-wide text-amber">
                  {p.standard}
                </span>
              )}
              <span className="text-[13px] font-semibold text-white/50">
                {p.family}
              </span>
            </div>
            <SectionHeading
              as="h1"
              tier="page"
              tone="dark"
              className="mt-3"
              title={p.name}
              subtitle={p.tagline}
            />
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-safe">
          <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] gap-10">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <Gallery images={p.images} name={p.name} />
                {p.externalUrl && (
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand hover:text-brand-dark transition-colors"
                  >
                    Manufacturer page <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="min-w-0 space-y-9">
                <div>
                  <p className="text-[15.5px] text-gray-600 leading-relaxed">
                    {p.overview}
                  </p>
                </div>

                <div>
                  <SectionLabel icon={<CheckCircle2 size={14} />}>
                    Key Features
                  </SectionLabel>
                  <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2 text-[14px] text-gray-600 leading-snug"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-brand"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {p.benefits && p.benefits.length > 0 && (
                  <div>
                    <SectionLabel icon={<Zap size={14} />}>
                      Engineering Benefits
                    </SectionLabel>
                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      {p.benefits.map((b) => (
                        <div
                          key={b}
                          className="flex gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 p-3.5"
                        >
                          <Zap size={16} className="mt-0.5 shrink-0 text-amber" />
                          <span className="text-[13.5px] text-gray-600 leading-snug">
                            {b}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  {p.service && p.service.length > 0 && (
                    <div>
                      <SectionLabel icon={<Droplets size={14} />}>
                        Service &amp; Media
                      </SectionLabel>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.service.map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.models && p.models.length > 0 && (
                    <div>
                      <SectionLabel icon={<Boxes size={14} />}>Models</SectionLabel>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.models.map((m) => (
                          <Badge key={m}>{m}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {brand.sectors.length > 0 && (
                  <div>
                    <SectionLabel icon={<Factory size={14} />}>
                      Industries
                    </SectionLabel>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {brand.sectors.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {p.specs && p.specs.length > 0 && (
                  <div>
                    <SectionLabel icon={<Table2 size={14} />}>
                      Specifications
                    </SectionLabel>
                    <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200">
                      <table className="w-full text-left">
                        <tbody className="divide-y divide-gray-100">
                          {p.specs.map((s, i) => (
                            <tr
                              key={s.label}
                              className={i % 2 ? "bg-gray-50/50" : "bg-white"}
                            >
                              <th
                                scope="row"
                                className="w-2/5 px-4 py-3 align-top text-[12px] font-bold uppercase tracking-wide text-gray-500"
                              >
                                {s.label}
                              </th>
                              <td className="px-4 py-3 text-[14px] text-navy font-medium">
                                {s.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2.5 text-[12.5px] text-gray-400">
                      Specifications transcribed from the manufacturer datasheet.
                      Confirm final selection with the product catalog or on
                      request.
                    </p>
                  </div>
                )}

                {p.certifications && p.certifications.length > 0 && (
                  <div>
                    <SectionLabel icon={<BadgeCheck size={14} />}>
                      Certifications &amp; Standards
                    </SectionLabel>
                    <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
                      {p.certifications.map((c) => (
                        <div
                          key={c}
                          className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3"
                        >
                          <BadgeCheck size={17} className="shrink-0 text-brand" />
                          <span className="text-[13.5px] font-medium text-navy leading-snug">
                            {c}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {p.videos && p.videos.length > 0 && (
                  <div>
                    <SectionLabel icon={<Play size={14} />}>
                      {p.videos.length > 1 ? "Product Videos" : "Product Video"}
                    </SectionLabel>
                    <p className="mt-1 text-[12.5px] text-gray-400">
                      From Curtiss-Wright&rsquo;s official YouTube channel.
                    </p>
                    <div className="mt-3 grid sm:grid-cols-2 gap-4">
                      {p.videos.map((v) => (
                        <VideoCard key={v.id} video={v} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <SectionLabel icon={<FileText size={14} />}>
                    Documentation
                  </SectionLabel>
                  {p.docs.length > 0 ? (
                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      {p.docs.map((d) => (
                        <DocCard key={d.href} doc={d} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
                      <FileText size={26} className="mx-auto text-gray-400" />
                      <p className="mt-3 text-[14.5px] font-semibold text-navy">
                        Documentation on request
                      </p>
                      <p className="mt-1 text-[13px] text-gray-500 max-w-md mx-auto">
                        Product-specific literature for the {p.name} is available
                        on request, or browse the Engineering Resource Center.
                      </p>
                      <Link
                        href={`/brands/${slug}#engineering-resources`}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13px] font-bold text-navy hover:border-brand hover:text-brand transition-colors"
                      >
                        Browse Resource Center
                      </Link>
                    </div>
                  )}
                </div>

                {related.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="mt-5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <Link2 size={13} /> Related products
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {related.map((r) => (
                        <Link
                          key={r.id}
                          href={`/brands/${slug}/products/${r.id}`}
                          className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-navy transition-all hover:border-brand hover:bg-brand-light/50"
                        >
                          {r.name}
                          <ArrowRight
                            size={13}
                            className="text-gray-400 group-hover:text-brand transition-colors"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-safe">
          <Reveal>
            <BorderBeam className="relative overflow-hidden rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <SectionHeading
                  tier="md"
                  tone="dark"
                  title={`Need a ${p.name.split(" ")[0]} for your project?`}
                  subtitle="Sized, quoted, and answered by an engineer"
                  lede="Send us your requirement and one of our application engineers will follow up, typically within 24 hours."
                  ledeClassName="max-w-lg"
                />
              </div>
              <div className="relative flex flex-wrap gap-3 shrink-0">
                <Magnetic>
                  <Link
                    href={`/quote?brand=${slug}`}
                    className="group inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5"
                  >
                    Request a quote
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </Magnetic>
                <Link
                  href={`/brands/${slug}`}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold px-6 py-3 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  <Layers size={16} /> See the full {brand.name} range
                </Link>
              </div>
            </BorderBeam>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
      {icon}
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-[12.5px] font-medium text-navy/75">
      {children}
    </span>
  );
}
