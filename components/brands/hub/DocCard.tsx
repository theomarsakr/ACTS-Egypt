"use client";

import { Download, ExternalLink, FileText } from "lucide-react";
import type { HubDoc } from "@/lib/brandHub";

/**
 * Rich documentation card — replaces plain PDF links. Shows a PDF icon, title,
 * type + language badges, a short description, related-product chips, and
 * explicit View (new tab) / Download actions.
 */
export default function DocCard({
  doc,
  showRelated = false,
}: {
  doc: HubDoc;
  showRelated?: boolean;
}) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-brand/40 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-brand-light text-brand ring-1 ring-brand/10">
          <FileText size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-navy/5 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-navy/70">
              {doc.type}
            </span>
            {doc.lang && (
              <span className="rounded-md bg-amber/15 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-dark">
                {doc.lang}
              </span>
            )}
            {doc.ref && (
              <span className="text-[10.5px] font-semibold tabular-nums text-gray-400">
                {doc.ref}
              </span>
            )}
          </div>
          <h4 className="mt-1 text-[15px] font-bold text-navy leading-snug line-clamp-2">
            {doc.title}
          </h4>
        </div>
      </div>

      <p className="mt-2.5 text-[13px] text-gray-500 leading-relaxed line-clamp-2">
        {doc.description}
      </p>

      {showRelated && doc.related.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-gray-400">Related:</span>
          {doc.related.map((r) => (
            <span
              key={r}
              className="rounded-full border border-brand/20 bg-brand-light/60 px-2 py-0.5 text-[11px] font-semibold text-brand-dark"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
        <a
          href={doc.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-[13px] font-bold text-white transition-all hover:bg-navy-700 hover:-translate-y-0.5"
        >
          <ExternalLink size={14} /> View PDF
        </a>
        <a
          href={doc.href}
          download
          aria-label={`Download ${doc.title}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[13px] font-bold text-navy transition-all hover:border-brand hover:text-brand hover:-translate-y-0.5"
        >
          <Download size={14} /> Download
        </a>
      </div>
    </div>
  );
}
