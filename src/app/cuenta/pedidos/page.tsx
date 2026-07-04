import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function CuentaPedidosPage() {
  const supabase = await createSupabaseServerClient();
  // La sesión del propio cliente + RLS (user_id = auth.uid()) garantizan
  // que SOLO se listan sus pedidos
  const { data } = await supabase
    .from("orders")
    .select("id, code, created_at, status, total, order_items(quantity)")
    .order("created_at", { ascending: false });

  const orders = data ?? [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-blanco-crema p-10 text-center shadow-calida">
        <h1 className="font-display text-2xl font-semibold text-tinta">
          Aún no tienes pedidos
        </h1>
        <p className="text-cacao">
          Cuando hagas tu primer pedido, aquí podrás seguir su estado.
        </p>
        <ButtonLink href="/tienda">Ver granolas</ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-tinta">
        Mis pedidos
      </h1>
      <ul className="space-y-3">
        {orders.map((order) => {
          const status = ORDER_STATUS_LABELS[order.status as OrderStatus];
          const itemCount = (order.order_items ?? []).reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          return (
            <li key={order.id}>
              <Link
                href={`/cuenta/pedidos/${order.id}`}
                className="flex flex-col gap-2 rounded-3xl bg-blanco-crema p-5 shadow-calida transition-colors active:bg-crema"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-lg font-semibold text-tinta">
                    {order.code}
                  </span>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <p className="text-sm text-cacao">
                  {formatDate(order.created_at)}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cacao">
                    {itemCount} {itemCount === 1 ? "producto" : "productos"}
                  </span>
                  <span className="font-display text-lg font-semibold text-tinta">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
