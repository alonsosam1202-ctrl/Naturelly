"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NAV_LINKS } from "./Header";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-tinta/40"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-2 bg-blanco-crema p-6 shadow-calida-lg">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-tinta">
            Naturelly
          </span>
          <button
            type="button"
            className="rounded-full p-2 text-tinta hover:bg-amarillo-suave"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <Link
          href="/"
          onClick={onClose}
          className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-crema"
        >
          Inicio
        </Link>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rounded-2xl px-4 py-3 font-bold text-tinta hover:bg-crema"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
