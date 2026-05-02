import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Pinyon_Script } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/layout/ChromeGate";

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

export const metadata: Metadata = {
  title: "The Beautiful Life — 3 Paths. One Goal. Your Ideal Life.",
  description:
    "Van helderheid tot transformatie. Drie pakketten om een leven te ontwerpen dat aansluit bij wie je bent.",
  openGraph: {
    title: "The Beautiful Life",
    description:
      "Van helderheid tot transformatie. Drie pakketten om een leven te ontwerpen dat aansluit bij wie je bent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`${cormorant.variable} ${montserrat.variable} ${pinyon.variable} antialiased`}
    >
      <body className="min-h-screen font-sans flex flex-col">
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}
