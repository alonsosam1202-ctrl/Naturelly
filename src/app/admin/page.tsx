import { ButtonLink } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: statusRows }, { data: weekRows }] = await Promise.all([
    supabase.from("orders").select("status"),
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelado")
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
  ]);

  const counts: Record<string, number> = {};
  (statusRows ?? []).forEach((row) => {
    counts[row.status as OrderStatus] = (counts[row.status as OrderStatus] ?? 0) + 1;
  });
  const enProceso =
    (counts.confirmado ?? 0) +
    (counts.en_preparacion ?? 0) +
    (counts.en_camino ?? 0);
  const ventasSemana = (weekRows ?? []).reduce(
    (acc, row) => acc + Math.round(Number(row.total) * 100),
    0
  ) / 100;

  const cards = [
    {
      label: "Pedidos pendientes",
      value: String(counts.pendiente ?? 0),
      accent: "bg-amarillo text-tinta",
      hint: "Esperan tu confirmación",
    },
    {
      label: "En proceso",
      value: String(enProceso),
      accent: "bg-salvia/20 text-tinta",
      hint: "Confirmados, en preparación o en camino",
    },
    {
      label: "Entregados",
      value: String(counts.entregado ?? 0),
      accent: "bg-blanco-crema text-tinta",
      hint: "Pedidos completados",
    },
    {
      label: "Ventas últimos 7 días",
      value: formatPrice(ventasSemana),
      accent: "bg-blanco-crema text-tinta",
      hint: "Sin contar cancelados",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl font-semibold text-tinta">
        Resumen
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col gap-1 rounded-3xl p-6 shadow-calida ${card.accent}`}
          >
            <p className="text-sm font-bold uppercase tracking-wide">
              {card.label}
            </p>
            <p className="font-display text-4xl font-semibold">{card.value}</p>
            <p className="text-sm opacity-80">{card.hint}</p>
          </div>
        ))}
      </div>

      <div>
        <ButtonLink href="/admin/pedidos" className="w-full sm:w-auto">
          Gestionar pedidos
        </ButtonLink>
      </div>
    </div>
  );
}
