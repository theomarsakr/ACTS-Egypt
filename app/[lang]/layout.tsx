import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import IntroOverlay from "@/components/IntroOverlay";
import { getDict, locales, type Locale } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Display face for headings and large numerals — a geometric counterpoint to
// Inter's humanist body text, giving the brand a more engineered wordmark feel.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  preload: true,
});

// Arabic companion face — geometric like Jakarta, with the full weight range
// Arabic headings need. Not preloaded so English pages pay nothing for it;
// globals.css applies it only under html[lang="ar"].
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: false,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.actsegypt.com";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(lang);
  const isAr = lang === "ar";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.title,
      template: "%s · ACTS Egypt",
    },
    description: dict.meta.description,
    applicationName: "ACTS Egypt",
    alternates: {
      canonical: isAr ? "/ar" : "/",
      languages: { en: "/", ar: "/ar", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "ACTS Egypt",
      title: dict.meta.title,
      description: dict.meta.description,
      url: isAr ? `${siteUrl}/ar` : siteUrl,
      locale: isAr ? "ar_EG" : "en_US",
      images: [
        {
          url: "/images/refinery-blue.jpg",
          alt: "ACTS, industrial process equipment supplier in Egypt",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/refinery-blue.jpg"],
    },
  };
}

// Organization structured data — helps search engines and AI answer surfaces
// resolve ACTS as a real entity with verifiable contact + location details.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Advanced Company for Trading Services (ACTS)",
  alternateName: "ACTS Egypt",
  url: siteUrl,
  logo: `${siteUrl}/logo-transparent.png`,
  image: `${siteUrl}/logo-transparent.png`,
  description:
    "ACTS is Egypt's trusted partner for valves, flow control, and critical process equipment across Oil & Gas, Petrochemical, Power Generation, Water Treatment, and Fertilizer industries: sole agent for Farris Engineering, Dyna-Flo, and EST (Curtiss-Wright).",
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
  // Same coordinates as the HQ pin on the homepage globe (components/home/RotatingEarth.tsx).
  geo: { "@type": "GeoCoordinates", latitude: 30.056, longitude: 30.9771 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  areaServed: { "@type": "Country", name: "Egypt" },
  knowsAbout: [
    "Safety relief valves",
    "Control valves",
    "Actuators and instrumentation",
    "Heat exchanger maintenance",
    "Pressure testing",
  ],
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang: rawLang } = await params;
  const lang: Locale = rawLang === "ar" ? "ar" : "en";
  const dict = getDict(lang);
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      // Opts back in to Next's smooth-scroll override on route transitions.
      // Next 16 stopped doing this implicitly, and warns when it finds
      // `scroll-behavior: smooth` (globals.css) without this attribute.
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakarta.variable} ${cairo.variable} h-full antialiased`}
      // The pre-paint script below adds `intro-pending` to this element before
      // React hydrates (see IntroOverlay's `dropCurtain`), so the live DOM
      // intentionally differs from the server-rendered class list on first
      // load — expected, not a real mismatch.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Runs before first paint so the intro curtain is up from frame one,
            rather than dropping over an already-visible hero once React
            hydrates. See `html.intro-pending` in globals.css. The timeout is
            the failsafe: if the bundle never arrives, the curtain clears
            itself and the site is usable. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('acts-intro-seen')!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var e=document.documentElement;e.classList.add('intro-pending');setTimeout(function(){e.classList.remove('intro-pending')},6000)}}catch(_){}",
          }}
        />
        <IntroOverlay />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a href="#main-content" className="skip-link">
          {dict.skipLink}
        </a>
        <ScrollProgress />
        <Navbar lang={lang} t={dict.nav} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} t={dict.footer} industryNames={dict.industryNames} />
        {/* Vercel Analytics has no endpoint to report to off-Vercel: "production"
            mode 404s fetching /_vercel/insights/script.js against a local
            `next start`, and "development" mode instead fetches an external
            debug script that the site's CSP (script-src 'self') rightly blocks.
            VERCEL is set only by Vercel's own build/runtime, so this renders
            nothing — and does nothing — anywhere else. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
