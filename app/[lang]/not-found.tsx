import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          align="center"
          tier="page"
          eyebrow="404"
          title="Page Not Found"
          subtitle="This one doesn't exist, or it has moved"
          lede="Head back to the homepage and pick up from there."
          ledeClassName="mx-auto max-w-md"
        />
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
