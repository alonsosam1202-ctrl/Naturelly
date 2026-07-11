import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getOrderByCode } from "@/lib/orders";
import { buildOrderMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// noindex: página privada por código; sin datos personales en la metadata
export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

type Params = Promise<{ codigo: string }>;

export default async function PedidoConfirmadoPage({
  params,
}: {
  params: Params;
}) {
  const { codigo } = await params;
  const order = await getOrderByCode(codigo.toUpperCase());

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-tinta">
          No encontramos ese pedido
        </h1>
        <p className="mt-3 text-cacao">
          Revisa que el enlace esté completo. Si el problema sigue, escríbenos
          y lo resolvemos al toque.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/tienda">Ver la tienda</ButtonLink>
          <ButtonLink href="/contacto" variant="secondary">
            Contacto
          </ButtonLink>
        </div>
      </div>
    );
  }

  const status = ORDER_STATUS_LABELS[order.status];
  const message = buildOrderMessage({
    code: order.code,
    total: order.total,
    items: order.items,
    customerName: order.customer_name,
    deliveryMethod: order.delivery_method,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Jerarquía (hallazgo C2 de la auditoría): la ACCIÓN pendiente va
          primero — sin el mensaje de WhatsApp, el pedido no se confirma.
          El "check" celebratorio pasa a segundo plano. */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-salvia-oscura">
          <CheckCircle2 className="size-5" aria-hidden />
          Pedido {order.code} registrado
        </p>
        <h1 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
          Falta 1 paso: envíalo por WhatsApp
        </h1>
        <p className="max-w-md text-cacao">
          Tu pedido quedó guardado, pero Nelly recién lo confirma cuando le
          llega tu mensaje. Toca el botón y envía el resumen que ya te
          dejamos listo.
        </p>
        <WhatsAppButton
          message={message}
          label="Enviar mi pedido por WhatsApp"
          className="w-full sm:w-auto"
        />
        <Badge className={status.className}>{status.label}</Badge>
      </div>

      <div className="mt-8 rounded-2xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="font-display text-xl font-semibold text-tinta">
          Resumen
        </h2>
        <ul className="mt-4 space-y-2">
          {order.items.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-4 text-tinta"
            >
              <span>
                {item.quantity} × {item.name}
              </span>
              <span className="font-bold">{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-amarillo-suave pt-4">
          <span className="font-bold text-tinta">Total</span>
          <span className="font-display text-2xl font-semibold text-miel-oscura">
            {formatPrice(order.total)}
          </span>
        </div>
        <p className="mt-3 text-sm text-cacao">
          {order.delivery_method === "delivery"
            ? `Delivery: ${order.delivery_address ?? ""}${
                order.delivery_district ? `, ${order.delivery_district}` : ""
              }. El costo del envío se coordina por WhatsApp y va aparte.`
            : "Recojo: coordinamos el punto por WhatsApp."}
        </p>
        <p className="mt-2 text-sm text-cacao">
          Guarda tu código{" "}
          <span className="font-bold text-tinta">{order.code}</span> para
          consultar por tu pedido.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <p className="max-w-md text-sm text-piedra">
          ¿Aún no enviaste el mensaje? Tu pedido quedará esperando hasta que
          Nelly lo reciba.
        </p>
        <WhatsAppButton
          message={message}
          label="Enviar mi pedido por WhatsApp"
          className="w-full sm:w-auto"
        />
        <ButtonLink href="/tienda" variant="secondary">
          Volver a la tienda
        </ButtonLink>
      </div>
    </div>
  );
}
