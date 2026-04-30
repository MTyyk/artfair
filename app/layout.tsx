import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Josefin_Sans, Jost, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import LanguageProvider from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Josefin Sans: 400 = body text, 300 = light labels/captions, 500 = stronger UI labels.
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Riga Contemporary Art Fair",
  description:
    "Browse and collect artworks from Riga Contemporary Art Fair. 2–5 July 2026, Hanzas Perons, Riga.",
  keywords: ["art fair", "Riga", "Latvia", "contemporary art", "artworks"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Riga Art Fair",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF4EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(cormorant.variable, josefin.variable, jost.variable, "font-sans", geist.variable)}>
      <body className="bg-cream text-ink font-sans">
        <LanguageProvider>
          <Header />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
