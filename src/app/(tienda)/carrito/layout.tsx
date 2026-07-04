import type { Metadata } from "next";

// La página del carrito es un componente cliente y no puede exportar
// metadata: este layout aporta el título y el noindex.
export const metadata: Metadata = {
  title: "Tu carrito",
  robots: { index: false, follow: false },
};

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
