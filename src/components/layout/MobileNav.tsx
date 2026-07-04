"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { NAV_LINKS } from "./Header";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Drawer de navegación móvil. IMPORTANTE: debe renderizarse FUERA del
 * <header> — su backdrop-blur crea un containing block y rompería el
 * posicionamiento fixed (los enlaces flotarían sobre el hero).
 */
export default function MobileNav({ open, onClose }: MobileNavProps) {
  // Bloquea el scroll del fondo y cierra con Escape mientras está abierto
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      className="fixed inset-0 z-[100] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
    >
      {/* Overlay oscuro: cierra al tocarlo */}
      <button
        type="button"
        className="absolute inset-0 animate-fade bg-tinta/50"
        aria-label="Cerrar menú"
        onClick={onClose}
      />

      {/* Panel sólido de borde a borde vertical, desde la izquierda */}
      <div className="absolute inset-y-0 left-0 flex h-full w-[82vw] max-w-[360px] animate-drawer-left flex-col overflow-y-auto bg-crema p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-tinta">
            Naturelly
          </span>
          <button
            type="button"
            className="rounded-full p-2 text-tinta hover:bg-amarillo-suave"
            aria-label="Cerrar menú"
            onClick={onClose}
            // Foco inicial dentro del diálogo para navegación por teclado
            autoFocus
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Principal móvil">
          <Link
            href="/"
            onClick={onClose}
            className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Inicio
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-amarillo-suave"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
