"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  CANCELABLE_STATUSES,
  ORDER_ACTION_LABELS,
  ORDER_NEXT_STATUS,
  ORDER_STATUS_LABELS,
} from "@/lib/constants";
import {
  updateOrderStatus,
  type UpdateStatusResult,
} from "@/app/admin/pedidos/actions";
import type { OrderStatus } from "@/types";

type StatusActionsProps = {
  orderId: string;
  status: OrderStatus;
};

/**
 * Botones de cambio de estado para Nelly: un solo paso siguiente, cancelar
 * con confirmación explícita, y mensajes de éxito/error siempre visibles.
 */
export default function StatusActions({ orderId, status }: StatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [result, setResult] = useState<UpdateStatusResult | null>(null);

  const nextStatus = ORDER_NEXT_STATUS[status];
  const canCancel = CANCELABLE_STATUSES.includes(status);

  function apply(newStatus: OrderStatus) {
    setResult(null);
    startTransition(async () => {
      const response = await updateOrderStatus({ orderId, newStatus });
      setResult(response);
      setConfirmingCancel(false);
      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
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

      {nextStatus && !confirmingCancel && (
        <Button
          onClick={() => apply(nextStatus)}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : (
            ORDER_ACTION_LABELS[nextStatus] ?? nextStatus
          )}
        </Button>
      )}

      {canCancel && !confirmingCancel && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setResult(null);
            setConfirmingCancel(true);
          }}
          className="w-full rounded-full border-2 border-terracota px-6 py-3 font-bold text-terracota transition-colors hover:bg-terracota hover:text-blanco-crema disabled:opacity-50"
        >
          Cancelar pedido
        </button>
      )}

      {confirmingCancel && (
        <div className="flex flex-col gap-3 rounded-2xl bg-terracota/10 p-4">
          <p className="font-bold text-tinta">
            ¿Seguro que quieres cancelar este pedido?
          </p>
          <p className="text-sm text-cacao">
            El stock de sus productos se repondrá y el pedido no se podrá
            reactivar.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={isPending}
              onClick={() => apply("cancelado")}
              className="w-full rounded-full bg-terracota px-6 py-3 font-bold text-blanco-crema transition-all hover:brightness-95 disabled:opacity-50 sm:flex-1"
            >
              {isPending ? "Cancelando…" : "Sí, cancelar pedido"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setConfirmingCancel(false)}
              className="w-full rounded-full border-2 border-tinta px-6 py-3 font-bold text-tinta hover:bg-tinta hover:text-amarillo disabled:opacity-50 sm:flex-1"
            >
              No, volver
            </button>
          </div>
        </div>
      )}

      {!nextStatus && !canCancel && (
        <p className="rounded-2xl bg-crema px-4 py-3 text-cacao">
          Este pedido está{" "}
          <strong>{ORDER_STATUS_LABELS[status].label.toLowerCase()}</strong> y
          ya no se puede modificar.
        </p>
      )}
    </div>
  );
}
