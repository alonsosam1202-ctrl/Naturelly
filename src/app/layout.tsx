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

// "carrot cake" se menciona solo como término secundario de búsqueda; el
// nombre visible del producto es "Torta de zanahoria".
const SITE_DESCRIPTION =
  "Delicias artesanales hechas por Nelly en Arequipa, Perú: granola artesanal, torta de zanahoria (carrot cake), torta de chocolate, torta de naranja, postres, cupcakes y tortas personalizadas. Pide por la web y coordina por WhatsApp.";

const SITE_TITLE = "Naturelly — Delicias artesanales hechas por Nelly";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Naturelly",
  },
  description: SITE_DESCRIPTION,
  // La imagen la aporta src/app/opengraph-image.tsx (temporal hasta tener logo)
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "Naturelly",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
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
