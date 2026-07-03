import { formatPrice } from "./utils";
import type { OrderSummaryItem } from "@/types";

/**
 * Devuelve el número de WhatsApp del negocio o `null` si aún es el
 * placeholder (TODO: confirmar con Nelly el número real).
 */
export function getWhatsAppNumber(): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number || /[^0-9]/.test(number)) return null;
  return number;
}

export function buildWhatsAppUrl(message: string): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje prellenado que el cliente envía a Nelly DESPUÉS de que el pedido
 * quedó registrado en Supabase (regla de oro: primero BD, luego WhatsApp).
 */
export function buildOrderMessage(order: {
  code: string;
  total: number;
  items: OrderSummaryItem[];
  customerName: string;
  deliveryMethod: "delivery" | "recojo";
}): string {
  const lines = [
    `¡Hola! 🌾 Soy ${order.customerName} y acabo de hacer el pedido *${order.code}* en la web de Naturelly:`,
    "",
    ...order.items.map(
      (item) => `• ${item.quantity} × ${item.name} — ${formatPrice(item.subtotal)}`
    ),
    "",
    `Total: *${formatPrice(order.total)}*`,
    order.deliveryMethod === "delivery"
      ? "Entrega: delivery 🛵"
      : "Entrega: recojo 🏠",
    "",
    "¿Me confirmas mi pedido, por favor?",
  ];
  return lines.join("\n");
}
