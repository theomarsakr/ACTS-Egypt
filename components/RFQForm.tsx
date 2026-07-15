"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, UserRound, ClipboardList, Send } from "lucide-react";
import { serviceNeeds, brandOptions, contact } from "@/lib/data";

const fieldClass =
  "w-full bg-white border border-gray-300 rounded-lg text-gray-900 text-[15px] px-4 py-3 outline-none transition-shadow placeholder:text-gray-500 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const steps = [
  { label: "Your details", icon: UserRound },
  { label: "Requirement", icon: ClipboardList },
  { label: "Finish", icon: Send },
];

export default function RFQForm({
  initialBrand,
  initialEmail,
}: {
  initialBrand?: string;
  initialEmail?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(0);

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
        throw new Error(json.error || "Something went wrong.");
      }
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900">
          Request received. Thank you!
        </h3>
        <p className="mt-2 text-[15px] text-gray-600">
          You&apos;ll receive an auto-confirmation, then one of our
          application engineers will review your requirements and follow up,
          typically within 24 hours. For urgent requirements, call{" "}
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-brand font-medium">
            {contact.phone}
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
      <h2 className="text-xl font-extrabold text-navy">Tell Us What You Need</h2>
      <p className="mt-1 text-sm text-gray-600 mb-6">
        Complete the form below and one of our application engineers will
        respond with a formal quote, typically within 24 hours.
      </p>

      {/* Stepper */}
      <ol className="flex items-center mb-8" aria-label="Progress">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={s.label}
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
                  {s.label}
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
          Contact information
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your full name"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>
              Company Name *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              placeholder="Company name"
              className={fieldClass}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="jobTitle" className={labelClass}>
              Job Title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="Your role"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialEmail}
              placeholder="you@company.com"
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone / Mobile *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+20 ..."
            className={fieldClass}
          />
        </div>
      </div>

      {/* Step 2 — Project details */}
      <div ref={stepRefs[1]} hidden={step !== 1} className="animate-page-in">
        <div className="text-sm font-bold text-navy uppercase tracking-wide mb-3">
          Project details
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="productNeeded" className={labelClass}>
              Product or Service Needed *
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
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="brand" className={labelClass}>
              Brand (if known)
            </label>
            <select
              id="brand"
              name="brand"
              defaultValue={initialBrand || ""}
              className={fieldClass}
            >
              <option value="">Select a brand</option>
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
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="text"
              placeholder="e.g. 4 units"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="deliveryLocation" className={labelClass}>
              Delivery Location *
            </label>
            <input
              id="deliveryLocation"
              name="deliveryLocation"
              type="text"
              required
              placeholder="Site or city"
              className={fieldClass}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="deliveryDate" className={labelClass}>
            Required Delivery Date
          </label>
          <input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="serviceConditions" className={labelClass}>
            Application / Service Conditions
          </label>
          <textarea
            id="serviceConditions"
            name="serviceConditions"
            placeholder="e.g., media, temperature, pressure, pipe size, flow rate"
            className={`${fieldClass} resize-y min-h-20`}
          />
        </div>
      </div>

      {/* Step 3 — Attachment + notes */}
      <div ref={stepRefs[2]} hidden={step !== 2} className="animate-page-in">
        <div className="text-sm font-bold text-navy uppercase tracking-wide mb-3">
          Final details
        </div>
        <div className="mb-4">
          <label htmlFor="attachment" className={labelClass}>
            Upload Specification, Drawing, or RFQ
          </label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,.dwg,.dxf,.doc,.docx"
            className={`${fieldClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-brand-light file:text-brand file:font-semibold file:text-sm cursor-pointer`}
          />
          <p className="mt-1.5 text-[13px] text-gray-600">
            PDF, DWG, DXF, DOC, DOCX (max 10MB).
          </p>
        </div>
        <div>
          <label htmlFor="message" className={labelClass}>
            Additional Notes *
          </label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="Anything else our engineers should know"
            className={`${fieldClass} resize-y min-h-20`}
          />
        </div>
      </div>

      {/* Honeypot — invisible to real users, catches basic bots. Not display:none
          since naive bots skip that; kept in normal flow but off-screen. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
      />

      {status === "error" && (
        <p className="text-sm text-red-600 mt-6">
          {errorMsg} You can also email us directly at{" "}
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
              className="transition-transform group-hover:-translate-x-1"
            />
            Back
          </button>
        ) : (
          <span className="text-[13px] text-gray-600">
            Step {step + 1} of {steps.length}
          </span>
        )}

        {isLast ? (
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
          >
            {status === "sending" ? "Submitting…" : "Submit Request"}
            {status !== "sending" && (
              <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="group inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25 cursor-pointer"
          >
            Continue
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        )}
      </div>

      <p className="mt-4 text-[13px] text-gray-600">
        Fields marked with * are required. Your information is used solely to
        prepare your quote and will not be shared with third parties.
      </p>
    </form>
  );
}
