"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import {
  toggleBundleActive,
  type ActionResult,
} from "@/app/admin/packs/actions";

export interface AdminBundleListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  itemsCount: number;
  /** min(floor(stock / cantidad)) sobre sus componentes. */
  availability: number;
  is_active: boolean;
  imageUrl: string | null;
}

function StateBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="bg-salvia/20 text-salvia">Visible</Badge>
  ) : (
    <Badge className="bg-terracota/10 text-terracota">Desactivado</Badge>
  );
}

function Thumb({ item }: { item: AdminBundleListItem }) {
  if (!item.imageUrl) {
    return (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amarillo/40 text-xs font-bold text-tinta">
        Sin foto
      </div>
    );
  }
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-crema">
      <Image
        src={item.imageUrl}
        alt={`Foto del pack ${item.name}`}
        fill
        sizes="56px"
        className="object-cover"
      />
    </div>
  );
}

/**
 * Listado de packs mobile-first con activar/desactivar por fila (con
 * confirmación). La regla de composición activa la valida el servidor.
 */
export default function BundlesTable({
  bundles,
}: {
  bundles: AdminBundleListItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);

  function applyToggle(bundle: AdminBundleListItem) {
    setResult(null);
    startTransition(async () => {
      const response = await toggleBundleActive({
        bundleId: bundle.id,
        isActive: !bundle.is_active,
      });
      setResult(response);
      setConfirmingId(null);
      if (response.ok) router.refresh();
    });
  }

  if (bundles.length === 0) {
    return (
      <p className="rounded-3xl bg-blanco-crema p-8 text-center text-cacao shadow-calida">
        Aún no hay packs. Crea el primero con el botón de arriba.
      </p>
    );
  }

  function ToggleButton({ bundle }: { bundle: AdminBundleListItem }) {
    if (confirmingId === bundle.id) {
      return (
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-tinta">
            {bundle.is_active ? "¿Ocultar de la tienda?" : "¿Mostrar en la tienda?"}
          </span>
          <button
            type="button"
            disabled={isPending}
            onClick={() => applyToggle(bundle)}
            className="rounded-full bg-tinta px-4 py-1.5 text-sm font-bold text-amarillo disabled:opacity-50"
          >
            Sí
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setConfirmingId(null)}
            className="rounded-full border-2 border-tinta px-4 py-1.5 text-sm font-bold text-tinta disabled:opacity-50"
          >
            No
          </button>
        </span>
      );
    }
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setResult(null);
          setConfirmingId(bundle.id);
        }}
        className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors disabled:opacity-50 ${
          bundle.is_active
            ? "border-terracota text-terracota hover:bg-terracota hover:text-blanco-crema"
            : "border-salvia text-salvia hover:bg-salvia hover:text-blanco-crema"
        }`}
      >
        {bundle.is_active ? "Desactivar" : "Activar"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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

      {/* Celular */}
      <ul className="space-y-3 md:hidden">
        {bundles.map((bundle) => (
          <li
            key={bundle.id}
            className="flex flex-col gap-3 rounded-3xl bg-blanco-crema p-4 shadow-calida"
          >
            <div className="flex items-center gap-4">
              <Thumb item={bundle} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-tinta">{bundle.name}</p>
                <p className="text-sm text-cacao">
                  {formatPrice(bundle.price)} · {bundle.itemsCount} productos
                </p>
                <p className="text-sm text-cacao">
                  Disponibilidad estimada: {bundle.availability} packs
                </p>
              </div>
              <StateBadge isActive={bundle.is_active} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/packs/${bundle.id}/editar`}
                className="font-bold text-miel hover:text-miel-oscura"
              >
                Editar
              </Link>
              <ToggleButton bundle={bundle} />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-3xl bg-blanco-crema shadow-calida md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-amarillo-suave text-sm uppercase tracking-wide text-cacao">
              <th className="px-5 py-4">Pack</th>
              <th className="px-5 py-4">Precio</th>
              <th className="px-5 py-4">Productos</th>
              <th className="px-5 py-4">Disponibilidad est.</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((bundle) => (
              <tr
                key={bundle.id}
                className="border-b border-amarillo-suave/50 last:border-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Thumb item={bundle} />
                    <span className="font-bold text-tinta">{bundle.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-bold text-tinta">
                  {formatPrice(bundle.price)}
                </td>
                <td className="px-5 py-4 text-tinta">{bundle.itemsCount}</td>
                <td className="px-5 py-4 text-tinta">{bundle.availability}</td>
                <td className="px-5 py-4">
                  <StateBadge isActive={bundle.is_active} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/packs/${bundle.id}/editar`}
                      className="font-bold text-miel hover:text-miel-oscura"
                    >
                      Editar
                    </Link>
                    <ToggleButton bundle={bundle} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
