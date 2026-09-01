import Link from "next/link";
import SpotlightCard from "@/components/ui/SpotlightCard";
import {
  APPLICATION_ICON_DEFAULT,
  applicationIcons,
} from "@/components/industries/icons";
import {
  getBrand,
  getProductLine,
  productLineAnchorId,
  type ApplicationArea,
} from "@/lib/data";

/** One process-area deep dive: the engineering problem, how ACTS solves it,
 *  why that's the right call, and the exact product line(s) behind the
 *  claim — see ApplicationArea in lib/data.ts. Same card-premium/glow-hover/
 *  SpotlightCard idiom as the homepage's "What we do" tiles, so this reads
 *  as the same design system rather than a one-off.
 *
 *  Lifted out of the industries hub page when the per-sector pages were split
 *  out, so both render the identical card.
 *
 *  `headingAs` exists because the card sits under a different heading depth in
 *  each: an <h4> beneath the hub's tab panel, an <h3> beneath a sector page's
 *  own "Key Applications" <h2>. Getting that wrong is the classic way a page
 *  ends up with a heading outline a crawler cannot follow. */
export default function ApplicationCard({
  app,
  headingAs: Heading = "h4",
}: {
  app: ApplicationArea;
  headingAs?: "h3" | "h4";
}) {
  const Icon = applicationIcons[app.area] ?? APPLICATION_ICON_DEFAULT;
  return (
    <SpotlightCard className="group card-premium glow-hover flex h-full flex-col p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <Heading className="text-fluid-h5 font-bold text-navy">{app.area}</Heading>
          <p className="mt-0.5 text-[13px] text-gray-500">{app.scope}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
            The challenge
          </dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-gray-600">{app.challenge}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Our solution
          </dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-gray-600">{app.solution}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Why it works
          </dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-gray-600">{app.advantage}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-gray-100 pt-4">
        {app.products.map((ref) => {
          const brand = getBrand(ref.brandSlug);
          const line = brand ? getProductLine(ref.brandSlug, ref.lineTag) : undefined;
          if (!brand || !line) return null;
          return (
            <Link
              key={`${ref.brandSlug}-${ref.lineTag}`}
              href={`/brands/${brand.slug}#${productLineAnchorId(line)}`}
              title={`${brand.name}, ${line.name}: ${line.description}`}
              className="inline-flex items-center pointer-coarse:min-h-11 pointer-coarse:px-3.5 rounded-full border border-brand/35 bg-white px-2.5 py-1 text-[12px] font-semibold text-brand-dark transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
            >
              {ref.lineTag}
            </Link>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
