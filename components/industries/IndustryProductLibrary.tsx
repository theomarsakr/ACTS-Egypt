import Link from "next/link";
import { ArrowRight, ChevronDown, FileText, Library } from "lucide-react";
import type { LibraryEntry } from "@/lib/industryLibrary";

/**
 * The Industries page's product-and-document index: one dropdown per product
 * line the sector names, opening onto that line's role here, a link to the
 * product itself, and its PDFs.
 *
 * Replaces a flat SpecSheet listing of the same lines. That listing answered
 * "which lines serve this sector and what do they do here," but anyone who
 * then wanted the datasheet had to leave for /brands#document-library and
 * search it by hand. Collapsing each line into a dropdown buys back the room
 * to put both destinations — the product, and its documents — behind the line
 * itself.
 *
 * Built on native <details>, grouped by `name` so opening one closes the last:
 * a real disclosure widget, keyboard- and screen-reader-correct for free, no
 * client JavaScript, and it still works if the bundle never arrives. Browsers
 * without exclusive-accordion support simply let several stand open.
 */
export default function IndustryProductLibrary({
  industrySlug,
  industryName,
  entries,
}: {
  industrySlug: string;
  industryName: string;
  entries: LibraryEntry[];
}) {
  if (!entries.length) return null;

  // Scoped per industry: every tab renders its own list, and two lists sharing
  // a group name would close each other's rows.
  const groupName = `product-library-${industrySlug}`;

  return (
    <ol className="overflow-hidden rounded-2xl border border-brand/20 bg-white shadow-[0_1px_2px_rgba(10,22,40,0.04),0_18px_40px_-24px_rgba(10,22,40,0.18)] divide-y divide-gray-100">
      {entries.map((entry, i) => (
        <li key={entry.id}>
          <details name={groupName} className="group">
            <summary
              // list-none + the WebKit pseudo kill the default disclosure
              // triangle in every engine; the chevron on the right replaces it.
              className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 transition-colors hover:bg-brand-light/40 group-open:bg-brand-light/60 sm:px-6 [&::-webkit-details-marker]:hidden"
            >
              <span className="w-6 shrink-0 text-[13px] font-bold tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  {entry.brandName}
                </span>
                <span className="block text-[16px] font-bold leading-snug text-navy">
                  {entry.tag}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-gray-500">
                  {entry.lineName}
                </span>
              </span>

              {/* A count only when the PDFs are this line's own. Where they
                  are the brand's overview instead, "1 PDF" would read as a
                  datasheet that doesn't exist. */}
              {entry.docTotal > 0 && (
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600 sm:inline-flex">
                  <FileText size={12} aria-hidden />
                  {entry.brandLevelDocs ? (
                    "In catalog"
                  ) : (
                    <>
                      <span className="tabular-nums">{entry.docTotal}</span>
                      PDF{entry.docTotal === 1 ? "" : "s"}
                    </>
                  )}
                </span>
              )}

              <ChevronDown
                size={18}
                aria-hidden
                className="shrink-0 text-gray-400 transition-transform duration-300 group-open:rotate-180"
              />
            </summary>

            <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-5 sm:px-6">
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <div className="min-w-0 sm:col-span-2">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                    Role in {industryName}
                  </dt>
                  <dd className="mt-1 text-[14.5px] leading-relaxed text-gray-600">
                    {entry.note}
                  </dd>
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                    The line
                  </dt>
                  <dd className="mt-1 text-[14.5px] leading-relaxed text-gray-600">
                    {entry.lineDescription}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href={entry.productHref}
                  className="group/btn inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
                >
                  Open the product
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5"
                  />
                </Link>
                <Link
                  href={entry.libraryHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-brand/35 bg-white px-4 py-2.5 text-[14px] font-semibold text-brand-dark transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand-light"
                >
                  <Library size={15} />
                  All {entry.brandName} documents
                </Link>
              </div>

              {entry.docs.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                      {entry.brandLevelDocs
                        ? "Covered in these catalogs"
                        : "Documents"}
                    </h5>
                    {/* Only when the list is short of the full match — the
                        summary badge already carries the total, so "4 of 4"
                        would just be the same number twice. */}
                    {entry.docTotal > entry.docs.length && (
                      <span className="text-[12px] tabular-nums text-gray-400">
                        {entry.docs.length} of {entry.docTotal}
                      </span>
                    )}
                  </div>
                  {entry.brandLevelDocs && (
                    <p className="mt-1 text-[13px] text-gray-500">
                      No sheet of its own in the library; this line is covered
                      inside the brand overview.
                    </p>
                  )}

                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {entry.docs.map((doc) => (
                      <li key={doc.href}>
                        <a
                          href={doc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/doc flex h-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-light text-brand">
                            <FileText size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-semibold leading-snug text-navy">
                              {doc.title}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">
                              <span className="font-semibold">PDF</span>
                              <span>{doc.category}</span>
                              {doc.ref && (
                                <span className="tabular-nums">{doc.ref}</span>
                              )}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {entry.docTotal > entry.docs.length && (
                    <Link
                      href={entry.libraryHref}
                      className="tap-target group/more mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand transition-colors hover:text-brand-dark"
                    >
                      View all {entry.docTotal} in the document library
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover/more:translate-x-0.5 rtl:rotate-180 rtl:group-hover/more:-translate-x-0.5"
                      />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
