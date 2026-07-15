import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Display face for headings and large numerals — a geometric counterpoint to
// Inter's humanist body text, giving the brand a more engineered wordmark feel.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.actsegypt.com";

const siteDescription =
  "ACTS is Egypt's trusted partner for valves, flow control, and critical process equipment across Oil & Gas, Petrochemical, Power Generation, Water Treatment, and Fertilizer industries: sole agent for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright).";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ACTS Egypt — Valves, Flow Control & Process Equipment",
    template: "%s · ACTS Egypt",
  },
  description: siteDescription,
  applicationName: "ACTS Egypt",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ACTS Egypt",
    title: "ACTS Egypt — Valves, Flow Control & Process Equipment",
    description: siteDescription,
    url: siteUrl,
    locale: "en_US",
    images: [
      {
        url: "/images/refinery-blue.jpg",
        alt: "ACTS — industrial process equipment supplier in Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACTS Egypt — Valves, Flow Control & Process Equipment",
    description: siteDescription,
    images: ["/images/refinery-blue.jpg"],
  },
};

// Organization structured data — helps search engines and AI answer surfaces
// resolve ACTS as a real entity with verifiable contact + location details.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Advanced Company for Trading Services (ACTS)",
  alternateName: "ACTS Egypt",
  url: siteUrl,
  logo: `${siteUrl}/logo-transparent.png`,
  description: siteDescription,
  email: "sales@actsegypt.com",
  telephone: "+202 3850 8135",
  foundingDate: "2006",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Arkan Plaza, Building 4, 4th Floor, Office #409",
    addressLocality: "Sheikh Zayed City",
    addressRegion: "Giza",
    postalCode: "12451",
    addressCountry: "EG",
  },
  areaServed: { "@type": "Country", name: "Egypt" },
  knowsAbout: [
    "Safety relief valves",
    "Control valves",
    "Actuators and instrumentation",
    "Heat exchanger maintenance",
    "Pressure testing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
