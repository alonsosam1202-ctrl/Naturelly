"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import MobileNav from "./MobileNav";

export const NAV_LINKS = [
  { href: "/tienda", label: "Tienda" },
  { href: "/packs", label: "Packs" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/recetas", label: "Recetas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  // El contador depende de localStorage: se pinta recién tras hidratar.
  useEffect(() => setMounted(true), []);
  const count = mounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    // El drawer móvil vive FUERA del <header>: el backdrop-blur crea un
    // containing block que rompería su posicionamiento fixed.
    <>
      <header className="sticky top-0 z-40 border-b border-amarillo-suave bg-crema/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            className="rounded-full p-2 text-tinta hover:bg-amarillo-suave md:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-6" aria-hidden />
          </button>

          <Link
            href="/"
            className="font-display text-2xl font-semibold tracking-tight text-tinta"
          >
            Naturelly
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold text-cacao transition-colors hover:text-miel"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 text-tinta transition-colors hover:bg-amarillo-suave"
            aria-label={`Abrir carrito (${count} productos)`}
          >
            <ShoppingBag className="size-6" aria-hidden />
            {count > 0 && (
              // key={count}: reinicia la animación pop cada vez que se agrega
              <span
                key={count}
                className="absolute -right-0.5 -top-0.5 flex size-5 animate-pop items-center justify-center rounded-full bg-tinta text-xs font-bold text-amarillo"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
