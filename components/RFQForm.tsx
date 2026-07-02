"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { sectors, contact } from "@/lib/data";

const fieldClass =
  "w-full bg-white border border-gray-300 rounded-lg text-gray-900 text-[15px] px-4 py-3 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function RFQForm({
  initialInterest,
}: {
  initialInterest?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
          Request received — thank you!
        </h3>
        <p className="mt-2 text-[15px] text-gray-600">
          Our sales team will respond at the email address you provided. For
          urgent requirements, call{" "}
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
      <h2 className="text-xl font-extrabold text-navy">Request a quote</h2>
      <p className="mt-1 text-sm text-gray-500 mb-6">
        Fill this in and we&apos;ll get back to you — usually within one
        business day.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name *
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
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Company name"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
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
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+20 ..."
            className={fieldClass}
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="productInterest" className={labelClass}>
          What are you interested in?
        </label>
        <select
          id="productInterest"
          name="productInterest"
          defaultValue={initialInterest || sectors[0]}
          className={fieldClass}
        >
          {initialInterest && !sectors.includes(initialInterest) && (
            <option value={initialInterest}>{initialInterest}</option>
          )}
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="message" className={labelClass}>
          Your requirement *
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Describe the valves or equipment you need — brand, series, size, service conditions."
          className={`${fieldClass} resize-y min-h-27.5`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 mb-4">
          {errorMsg} — you can also email us directly at{" "}
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
        {status === "sending" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
