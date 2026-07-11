import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";
import { brands, getBrand } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
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

  return (
    <>
      {/* Photo hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={brand.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/80 to-navy/40" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <Reveal>
            <Link
              href="/brands"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> All brands
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-7 text-[13px] font-bold text-amber uppercase tracking-widest">
              {brand.no} · {brand.origin.split("·")[0].trim()}
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              {brand.name}
            </h1>
            <div className="mt-3 text-lg font-semibold text-amber">
              {brand.category}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              {brand.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
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
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-[13px] font-bold uppercase tracking-widest text-brand">
              Product range
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
              {brand.productLines.length} product lines available through ACTS
            </h2>
          </Reveal>
          <div
            className={`mt-9 grid sm:grid-cols-2 gap-4 ${
              brand.gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {brand.productLines.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <div className="card-lift h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-brand/50">
                  {p.tag && (
                    <div className="text-xs font-bold tracking-wider text-brand/70">
                      {p.tag}
                    </div>
                  )}
                  <div className="mt-1 text-lg font-bold text-navy">
                    {p.name}
                  </div>
                  <p className="mt-2 text-[15px] text-gray-600">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 relative overflow-hidden rounded-2xl bg-navy p-8 md:p-12 shadow-xl shadow-navy/15">
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
