import type { Metadata } from "next";

// La página de checkout es un componente cliente y no puede exportar
// metadata: este layout aporta el título y el noindex.
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
