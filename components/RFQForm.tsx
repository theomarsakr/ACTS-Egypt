"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, UserRound, ClipboardList, Send } from "lucide-react";
import { serviceNeeds, brandOptions, contact } from "@/lib/data";
import { fill } from "@/lib/i18n/routing";
import type { Dict } from "@/lib/i18n/en";

const fieldClass =
  "w-full bg-white border border-gray-300 rounded-lg text-gray-900 text-[15px] px-4 py-3 outline-none transition-shadow placeholder:text-gray-500 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const stepIcons = [UserRound, ClipboardList, Send];

export default function RFQForm({
  initialBrand,
  initialEmail,
  t,
}: {
  initialBrand?: string;
  initialEmail?: string;
  t: Dict["rfq"];
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(0);

  const steps = t.stepLabels;

  // One ref per step container — used to validate only the visible step's
  // controls before advancing, so the native submit on the final step never
  // has to focus an invalid control hidden in an earlier step.
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  function validateStep(n: number): boolean {
    const container = stepRefs[n].current;
    if (!container) return true;
    const controls = container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");
    for (const c of controls) {
      if (!c.checkValidity()) {
        c.reportValidity();
        return false;
      }
    }
    return true;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || t.genericError);
      }
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.genericError);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900">{t.successTitle}</h3>
        <p className="mt-2 text-[15px] text-gray-600">
          {t.successBody}{" "}
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="text-brand font-medium"
          >
            <span className="ltr-inline">{contact.phone}</span>
          </a>
          .
        </p>
      </div>
    );
  }

  const isLast = step === steps.length - 1;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-xl font-extrabold text-navy">{t.title}</h2>
      <p className="mt-1 text-sm text-gray-600 mb-6">{t.lede}</p>

      {/* Stepper */}
      <ol className="flex items-center mb-8" aria-label={t.progress}>
        {steps.map((label, i) => {
          const Icon = stepIcons[i] ?? Send;
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={label}
              className="flex items-center"
              style={{ flex: i < steps.length - 1 ? "1 1 0%" : "0 0 auto" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-current={active ? "step" : undefined}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold transition-colors ${
                    done
                      ? "bg-brand border-brand text-white"
                      : active
                        ? "bg-brand-light border-brand text-brand"
                        : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </span>
                <span
                  className={`hidden sm:block text-[13px] font-semibold transition-colors ${
                    active ? "text-navy" : done ? "text-brand" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={`mx-3 h-0.5 flex-1 rounded-full transition-colors ${
                    done ? "bg-brand" : "bg-gray-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Step 1 — Contact information */}
      <div ref={stepRefs[0]} hidden={step !== 0} className="animate-page-in">
        <div className="text-sm font-bold text-navy uppercase tracking-wide mb-3">
          {t.contactInfo}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              {t.fullName} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t.fullNamePh}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>
              {t.company} *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              placeholder={t.companyPh}
              className={fieldClass}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="jobTitle" className={labelClass}>
              {t.jobTitle}
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder={t.jobTitlePh}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              {t.email} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialEmail}
              placeholder={t.emailPh}
              dir="ltr"
              className={`${fieldClass} rtl:text-right rtl:placeholder:text-right`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t.phone} *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder={t.phonePh}
            dir="ltr"
            className={`${fieldClass} rtl:text-right rtl:placeholder:text-right`}
          />
        </div>
      </div>

      {/* Step 2 — Project details */}
      <div ref={stepRefs[1]} hidden={step !== 1} className="animate-page-in">
        <div className="text-sm font-bold text-navy uppercase tracking-wide mb-3">
          {t.projectDetails}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="productNeeded" className={labelClass}>
              {t.product} *
            </label>
            <select
              id="productNeeded"
              name="productNeeded"
              required
              defaultValue={serviceNeeds[0]}
              className={fieldClass}
            >
              {serviceNeeds.map((s) => (
                <option key={s} value={s}>
                  {t.serviceNeedLabels[s] ?? s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="brand" className={labelClass}>
              {t.brandLabel}
            </label>
            <select
              id="brand"
              name="brand"
              defaultValue={initialBrand || ""}
              className={fieldClass}
            >
              <option value="">{t.selectBrand}</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quantity" className={labelClass}>
              {t.quantity}
            </label>
            <input
              id="quantity"
              name="quantity"
              type="text"
              placeholder={t.quantityPh}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="deliveryLocation" className={labelClass}>
              {t.delivery} *
            </label>
            <input
              id="deliveryLocation"
              name="deliveryLocation"
              type="text"
              required
              placeholder={t.deliveryPh}
              className={fieldClass}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="deliveryDate" className={labelClass}>
            {t.deliveryDate}
          </label>
          {/* Forced LTR: RTL date inputs hit a Chromium-on-Windows paint bug
              that blanks the whole tab, and dates read LTR anyway. */}
          <input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            dir="ltr"
            className={`${fieldClass} rtl:text-right`}
          />
        </div>
        <div>
          <label htmlFor="serviceConditions" className={labelClass}>
            {t.conditions}
          </label>
          <textarea
            id="serviceConditions"
            name="serviceConditions"
            placeholder={t.conditionsPh}
            className={`${fieldClass} resize-y min-h-20`}
          />
        </div>
      </div>

      {/* Step 3 — Attachment + notes */}
      <div ref={stepRefs[2]} hidden={step !== 2} className="animate-page-in">
        <div className="text-sm font-bold text-navy uppercase tracking-wide mb-3">
          {t.finalDetails}
        </div>
        <div className="mb-4">
          <label htmlFor="attachment" className={labelClass}>
            {t.upload}
          </label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,.dwg,.dxf,.doc,.docx"
            className={`${fieldClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-brand-light file:text-brand file:font-semibold file:text-sm cursor-pointer rtl:file:mr-0 rtl:file:ml-4`}
          />
          <p className="mt-1.5 text-[13px] text-gray-600">
            <span className="ltr-inline">{t.uploadHint}</span>
          </p>
        </div>
        <div>
          <label htmlFor="message" className={labelClass}>
            {t.notes} *
          </label>
          <textarea
            id="message"
            name="message"
            required
            placeholder={t.notesPh}
            className={`${fieldClass} resize-y min-h-20`}
          />
        </div>
      </div>

      {/* Honeypot — invisible to real users, catches basic bots. Not display:none
          since naive bots skip that. Hidden via clip-path rather than an
          off-screen `left` offset: in RTL, left-overflow extends the paint
          canvas and triggers a Chromium bug that blanks the whole tab. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute w-px h-px opacity-0 overflow-hidden pointer-events-none [clip-path:inset(50%)]"
      />

      {status === "error" && (
        <p className="text-sm text-red-600 mt-6">
          {errorMsg} {t.errorSuffix}{" "}
          <a href={`mailto:${contact.salesEmail}`} className="underline font-medium">
            {contact.salesEmail}
          </a>
          .
        </p>
      )}

      {/* Nav controls */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="group inline-flex items-center gap-2 text-[15px] font-semibold px-5 py-3 rounded-lg text-navy border border-gray-300 hover:border-navy hover:bg-gray-50 transition-all cursor-pointer"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
            />
            {t.back}
          </button>
        ) : (
          <span className="text-[13px] text-gray-600">
            {fill(t.stepOf, { n: step + 1, total: steps.length })}
          </span>
        )}

        {isLast ? (
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
          >
            {status === "sending" ? t.submitting : t.submit}
            {status !== "sending" && (
              <Send size={16} className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25 cursor-pointer"
          >
            {t.continue}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            />
          </button>
        )}
      </div>

      <p className="mt-4 text-[13px] text-gray-600">{t.requiredNote}</p>
    </form>
  );
}
