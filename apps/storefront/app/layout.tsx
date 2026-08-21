import type { Metadata, Viewport } from "next";
import { Cabin, DM_Sans } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-dm-sans",
});

const headingFallback = Cabin({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-cabin",
});

export const metadata: Metadata = {
  title: {
    default: "Blowin’ Smoke — Independent judgment, exact product truth",
    template: "%s — Blowin’ Smoke",
  },
  description:
    "One independent house for THCA, Vape & Nicotine, and Glass / Accessories / Merch—built around exact product truth and a useful next move.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFallback.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
