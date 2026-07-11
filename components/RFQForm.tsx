"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { serviceNeeds, brandOptions, contact } from "@/lib/data";

const fieldClass =
  "w-full bg-white border border-gray-300 rounded-lg text-gray-900 text-[15px] px-4 py-3 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function RFQForm({
  initialBrand,
}: {
  initialBrand?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

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

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-xl font-extrabold text-navy">Tell Us What You Need</h2>
      <p className="mt-1 text-sm text-gray-500 mb-6">
        Complete the form below and one of our application engineers will
        respond with a formal quote, typically within 24 hours.
      </p>

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
            placeholder="you@company.com"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="mb-6">
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
      <div className="mb-4">
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
        <p className="mt-1.5 text-[13px] text-gray-500">
          PDF, DWG, DXF, DOC, DOCX (max 10MB).
        </p>
      </div>
      <div className="mb-6">
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
        <p className="text-sm text-red-600 mb-4">
          {errorMsg} You can also email us directly at{" "}
          <a href={`mailto:${contact.salesEmail}`} className="underline font-medium">
            {contact.salesEmail}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full text-base font-semibold px-6 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-wait cursor-pointer"
      >
        {status === "sending" ? "Submitting…" : "Submit Request"}
      </button>

      <p className="mt-4 text-[13px] text-gray-500">
        Fields marked with * are required. Your information is used solely to
        prepare your quote and will not be shared with third parties.
      </p>
    </form>
  );
}
