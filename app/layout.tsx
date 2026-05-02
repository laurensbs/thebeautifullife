import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Pinyon_Script } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/layout/ChromeGate";
import { getLocale } from "@/lib/i18n/server";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: tr(DICT.meta.homeTitle, locale),
    description: tr(DICT.meta.homeDesc, locale),
    openGraph: {
      title: tr(DICT.meta.homeTitle, locale),
      description: tr(DICT.meta.homeDesc, locale),
      type: "website",
      locale: locale === "nl" ? "nl_NL" : "en_US",
    },
  };
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
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}
