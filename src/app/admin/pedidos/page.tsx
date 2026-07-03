import Link from "next/link";
import OrdersTable, {
  type AdminOrderListItem,
} from "@/components/admin/OrdersTable";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ estado?: string }>;

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { estado } = await searchParams;
  const filter = ORDER_STATUSES.includes(estado as OrderStatus)
    ? (estado as OrderStatus)
    : null;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("orders")
    .select("id, code, customer_name, delivery_method, status, total, created_at")
    .order("created_at", { ascending: false });
  if (filter) {
    query = query.eq("status", filter);
  }
  const { data } = await query;
  const orders = (data ?? []) as unknown as AdminOrderListItem[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-tinta">
        Pedidos
      </h1>

      <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
        <Link
          href="/admin/pedidos"
          className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
            !filter
              ? "border-tinta bg-tinta text-amarillo"
              : "border-transparent bg-blanco-crema text-tinta shadow-calida hover:border-tinta"
          }`}
        >
          Todos
        </Link>
        {ORDER_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/pedidos?estado=${status}`}
            className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
              filter === status
                ? "border-tinta bg-tinta text-amarillo"
                : "border-transparent bg-blanco-crema text-tinta shadow-calida hover:border-tinta"
            }`}
          >
            {ORDER_STATUS_LABELS[status].label}
          </Link>
        ))}
      </nav>

      <OrdersTable orders={orders} />
    </div>
  );
}
