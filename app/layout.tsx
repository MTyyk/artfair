import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Riga Contemporary Art Fair",
  description:
    "Browse and collect artworks from Riga Contemporary Art Fair. 2–5 July 2026, Hanzas Perons, Riga.",
  keywords: ["art fair", "Riga", "Latvia", "contemporary art", "artworks"],
};

export const viewport: Viewport = {
  themeColor: "#F4F0EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream text-ink font-sans">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
