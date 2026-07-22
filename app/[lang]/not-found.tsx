import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-sm font-semibold text-brand tracking-wide">404</div>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-navy">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-base font-semibold px-6 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors"
        >
          <ArrowLeft size={17} /> Back to home
        </Link>
      </div>
    </section>
  );
}
