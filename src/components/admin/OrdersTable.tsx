import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export interface AdminOrderListItem {
  id: string;
  code: string;
  customer_name: string;
  delivery_method: "delivery" | "recojo";
  status: OrderStatus;
  total: number;
  created_at: string;
}

const DELIVERY_LABELS = { delivery: "Delivery", recojo: "Recojo" } as const;

/**
 * Lista de pedidos mobile-first: cards tocables en celular, tabla en
 * pantallas medianas en adelante.
 */
export default function OrdersTable({
  orders,
}: {
  orders: AdminOrderListItem[];
}) {
  if (orders.length === 0) {
    return (
      <p className="rounded-3xl bg-blanco-crema p-8 text-center text-cacao shadow-calida">
        No hay pedidos con este estado por ahora.
      </p>
    );
  }

  return (
    <>
      {/* Celular: cards grandes y tocables */}
      <ul className="space-y-3 md:hidden">
        {orders.map((order) => {
          const status = ORDER_STATUS_LABELS[order.status];
          return (
            <li key={order.id}>
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="flex flex-col gap-2 rounded-3xl bg-blanco-crema p-5 shadow-calida transition-colors active:bg-crema"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-semibold text-tinta">
                    {order.code}
                  </span>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <p className="font-bold text-tinta">{order.customer_name}</p>
                <p className="text-sm text-cacao">
                  {formatDate(order.created_at)}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cacao">
                    {DELIVERY_LABELS[order.delivery_method]}
                  </span>
                  <span className="font-display text-lg font-semibold text-tinta">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop: tabla */}
      <div className="hidden overflow-hidden rounded-3xl bg-blanco-crema shadow-calida md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-amarillo-suave text-sm uppercase tracking-wide text-cacao">
              <th className="px-5 py-4">Código</th>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4">Entrega</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = ORDER_STATUS_LABELS[order.status];
              return (
                <tr key={order.id} className="border-b border-amarillo-suave/50 last:border-0">
                  <td className="px-5 py-4 font-bold text-tinta">{order.code}</td>
                  <td className="px-5 py-4 text-tinta">{order.customer_name}</td>
                  <td className="px-5 py-4 text-sm text-cacao">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-5 py-4 text-cacao">
                    {DELIVERY_LABELS[order.delivery_method]}
                  </td>
                  <td className="px-5 py-4 font-bold text-tinta">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={status.className}>{status.label}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-bold text-miel hover:text-miel-oscura"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
