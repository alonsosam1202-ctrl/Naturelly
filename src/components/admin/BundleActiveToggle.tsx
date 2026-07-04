"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  toggleBundleActive,
  type ActionResult,
} from "@/app/admin/packs/actions";

type BundleActiveToggleProps = {
  bundleId: string;
  isActive: boolean;
};

/**
 * Activar/desactivar pack (soft delete) con confirmación explícita.
 * Nunca se borra nada de la base de datos.
 */
export default function BundleActiveToggle({
  bundleId,
  isActive,
}: BundleActiveToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  function apply() {
    setResult(null);
    startTransition(async () => {
      const response = await toggleBundleActive({
        bundleId,
        isActive: !isActive,
      });
      setResult(response);
      setConfirming(false);
      if (response.ok) router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-3 rounded-3xl bg-blanco-crema p-6 shadow-calida">
      <h2 className="font-display text-xl font-semibold text-tinta">
        Visibilidad
      </h2>
      <p className="text-sm text-cacao">
        {isActive
          ? "Este pack está visible en la tienda."
          : "Este pack está desactivado: no se muestra en la tienda, pero no se borró nada."}
      </p>

      {result && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 font-bold ${
            result.ok
              ? "bg-salvia/15 text-salvia"
              : "bg-terracota/10 text-terracota"
          }`}
        >
          {result.message}
        </p>
      )}

      {!confirming ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setConfirming(true)}
          className={`w-full rounded-full border-2 px-6 py-3 font-bold transition-colors disabled:opacity-50 ${
            isActive
              ? "border-terracota text-terracota hover:bg-terracota hover:text-blanco-crema"
              : "border-salvia text-salvia hover:bg-salvia hover:text-blanco-crema"
          }`}
        >
          {isActive ? "Desactivar pack" : "Activar pack"}
        </button>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-crema p-4">
          <p className="font-bold text-tinta">
            {isActive
              ? "¿Ocultar este pack de la tienda?"
              : "¿Mostrar este pack en la tienda?"}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={isPending}
              onClick={apply}
              className="w-full rounded-full bg-tinta px-6 py-3 font-bold text-amarillo disabled:opacity-50 sm:flex-1"
            >
              {isPending
                ? "Guardando…"
                : isActive
                  ? "Sí, desactivar"
                  : "Sí, activar"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setConfirming(false)}
              className="w-full rounded-full border-2 border-tinta px-6 py-3 font-bold text-tinta disabled:opacity-50 sm:flex-1"
            >
              No, volver
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
