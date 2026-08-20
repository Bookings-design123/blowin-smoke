import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-archivo",
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
  themeColor: "#f3efe7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
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
