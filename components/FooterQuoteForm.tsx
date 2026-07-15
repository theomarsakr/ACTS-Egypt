"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

/* Fast-lane into the real RFQ flow: takes an email and prefills /quote. */
export default function FooterQuoteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/quote${email ? `?email=${encodeURIComponent(email)}` : ""}`);
      }}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
    >
      <label htmlFor="footer-email" className="sr-only">
        Work email
      </label>
      <input
        id="footer-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 glass-dark rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/50 outline-none transition-all focus:border-amber/60 focus:bg-white/10"
      />
      <button type="submit" className="btn btn-primary px-6 py-3.5 text-[15px] group shrink-0">
        Start a quote
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </form>
  );
}
