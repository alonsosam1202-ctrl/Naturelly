import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naturelly.onrender.com";

const SITE_DESCRIPTION =
  "Granola artesanal con superalimentos andinos, tostada a mano en tandas pequeñas y endulzada solo con miel de abeja. De la cocina de Nelly a tu mesa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Naturelly — Granola artesanal de Arequipa",
    template: "%s · Naturelly",
  },
  description: SITE_DESCRIPTION,
  // La imagen la aporta src/app/opengraph-image.tsx (temporal hasta tener logo)
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "Naturelly",
    title: "Naturelly — Granola artesanal de Arequipa",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Naturelly — Granola artesanal de Arequipa",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
