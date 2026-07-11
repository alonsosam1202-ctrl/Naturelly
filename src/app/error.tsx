"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

/**
 * Error boundary global: cuando el catálogo (u otra carga de servidor)
 * falla, se muestra este mensaje honesto en vez de una tienda "vacía"
 * que miente (hallazgo de la auditoría 2026-07-07). `reset()` reintenta
 * el render del segmento.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Solo al log del servidor/consola; el usuario ve el mensaje genérico
    console.error("Error de página:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.26em] text-oro-texto">
        Ups
      </p>
      <h1 className="font-display text-3xl font-semibold text-tinta">
        Algo falló de nuestro lado
      </h1>
      <p className="max-w-md text-cacao">
        No pudimos cargar esta página en este momento. No es tu conexión:
        inténtalo de nuevo en unos segundos.
      </p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  );
}
