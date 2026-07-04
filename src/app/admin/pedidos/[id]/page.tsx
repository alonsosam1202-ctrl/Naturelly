import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import StatusActions from "@/components/admin/StatusActions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const status = ORDER_STATUS_LABELS[order.status as OrderStatus];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 font-bold text-miel-oscura hover:text-tinta"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver a pedidos
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-tinta">
            {order.code}
          </h1>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <p className="mt-1 text-sm text-cacao">
          Creado: {formatDate(order.created_at)} · Última actualización:{" "}
          {formatDate(order.updated_at)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {/* Cliente */}
          <section className="rounded-3xl bg-blanco-crema p-6 shadow-calida">
            <h2 className="font-display text-xl font-semibold text-tinta">
              Cliente
            </h2>
            <dl className="mt-3 space-y-2 text-tinta">
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-cacao">
                  Nombre
                </dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-cacao">
                  Celular
                </dt>
                <dd className="flex flex-wrap items-center gap-3">
                  {order.customer_phone}
                  <a
                    href={`https://wa.me/51${order.customer_phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3 py-1.5 text-sm font-bold text-blanco-crema hover:brightness-95"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Escribir al cliente
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          {/* Entrega */}
          <section className="rounded-3xl bg-blanco-crema p-6 shadow-calida">
            <h2 className="font-display text-xl font-semibold text-tinta">
              Entrega
            </h2>
            <dl className="mt-3 space-y-2 text-tinta">
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-cacao">
                  Tipo
                </dt>
                <dd>
                  {order.delivery_method === "delivery" ? "Delivery" : "Recojo"}
                </dd>
              </div>
              {order.delivery_district && (
                <div>
                  <dt className="text-sm font-bold uppercase tracking-wide text-cacao">
                    Distrito
                  </dt>
                  <dd>{order.delivery_district}</dd>
                </div>
              )}
              {order.delivery_address && (
                <div>
                  <dt className="text-sm font-bold uppercase tracking-wide text-cacao">
                    Dirección
                  </dt>
                  <dd>{order.delivery_address}</dd>
                </div>
              )}
              {order.notes && (
                <div>
                  <dt className="text-sm font-bold uppercase tracking-wide text-cacao">
                    Notas del cliente
                  </dt>
                  <dd>{order.notes}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Productos */}
          <section className="rounded-3xl bg-blanco-crema p-6 shadow-calida">
            <h2 className="font-display text-xl font-semibold text-tinta">
              Productos
            </h2>
            <ul className="mt-3 space-y-2">
              {order.order_items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 text-tinta"
                >
                  <span>
                    {item.quantity} × {item.item_name}
                  </span>
                  <span className="font-bold">
                    {formatPrice(Number(item.subtotal))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-amarillo-suave pt-4">
              <p className="flex justify-between text-cacao">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </p>
              <p className="flex justify-between text-cacao">
                <span>Delivery</span>
                <span>{formatPrice(Number(order.delivery_fee))}</span>
              </p>
              <p className="flex justify-between font-bold text-tinta">
                <span>Total</span>
                <span className="font-display text-2xl font-semibold">
                  {formatPrice(Number(order.total))}
                </span>
              </p>
            </div>
          </section>
        </div>

        {/* Estado y acciones */}
        <section className="h-fit rounded-3xl bg-blanco-crema p-6 shadow-calida">
          <h2 className="font-display text-xl font-semibold text-tinta">
            Estado del pedido
          </h2>
          <p className="mt-2 text-sm text-cacao">
            Estado actual: <Badge className={status.className}>{status.label}</Badge>
          </p>
          <div className="mt-4">
            <StatusActions
              orderId={order.id}
              status={order.status as OrderStatus}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
