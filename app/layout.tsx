import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Pinyon_Script } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/layout/ChromeGate";
import CookieNotice from "@/components/layout/CookieNotice";
import { getLocale } from "@/lib/i18n/server";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";
import { buildMetadata, ORGANIZATION_LD, PERSON_LD, WEBSITE_LD } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Theme-color voor mobiele browser-balk (cream, matcht site-achtergrond).
export const viewport: Viewport = {
  themeColor: "#F1EBE0",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const base = buildMetadata({
    title: tr(DICT.meta.homeTitle, locale),
    description: tr(DICT.meta.homeDesc, locale),
    path: "/",
    locale,
  });
  // Search Console verification — token via env zodat Marion het later
  // kan zetten in Vercel zonder code-deploy.
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    base.verification = { google: process.env.GOOGLE_SITE_VERIFICATION };
  }
  return base;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${montserrat.variable} ${pinyon.variable} antialiased`}
    >
      <body className="min-h-screen font-sans flex flex-col">
        {/* Skip-to-content link voor toetsenbord-gebruikers — zichtbaar bij focus */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-[3px] focus:text-[12px] focus:tracking-[0.18em] focus:uppercase"
        >
          {locale === "en" ? "Skip to content" : "Direct naar inhoud"}
        </a>
        <JsonLd data={[ORGANIZATION_LD, PERSON_LD, WEBSITE_LD]} />
        <ChromeGate>{children}</ChromeGate>
        <CookieNotice />
      </body>
    </html>
  );
}
