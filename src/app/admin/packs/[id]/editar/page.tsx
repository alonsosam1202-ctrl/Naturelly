import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import BundleForm from "@/components/admin/BundleForm";
import BundleImageManager from "@/components/admin/BundleImageManager";
import BundleActiveToggle from "@/components/admin/BundleActiveToggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  BundleFormValues,
  VariantOption,
} from "@/lib/validations/bundle";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ creado?: string }>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminEditarPackPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { creado } = await searchParams;
  if (!UUID_REGEX.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  const [{ data: bundle }, { data: products }] = await Promise.all([
    supabase
      .from("bundles")
      .select("*, bundle_items(variant_id, quantity)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("products")
      .select(
        "name, is_active, product_variants(id, size_label, sku, price, stock, is_active)"
      )
      .order("sort_order"),
  ]);

  if (!bundle) notFound();

  const variantOptions: VariantOption[] = (products ?? []).flatMap((product) =>
    (product.product_variants ?? []).map((variant) => ({
      variantId: variant.id,
      label: `${product.name} · ${variant.size_label} — ${variant.sku}`,
      productName: product.name,
      sizeLabel: variant.size_label,
      sku: variant.sku,
      price: Number(variant.price),
      stock: variant.stock,
      isActive: variant.is_active && product.is_active,
    }))
  );

  const initial: BundleFormValues = {
    id: bundle.id,
    name: bundle.name,
    slug: bundle.slug,
    description: bundle.description ?? "",
    price: Number(bundle.price),
    is_active: bundle.is_active,
    items: bundle.bundle_items.map((item) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    })),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/packs"
          className="inline-flex items-center gap-2 font-bold text-miel hover:text-miel-oscura"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver a packs
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-tinta">
            {bundle.name}
          </h1>
          {bundle.is_active ? (
            <Badge className="bg-salvia/20 text-salvia">Visible</Badge>
          ) : (
            <Badge className="bg-terracota/10 text-terracota">
              Desactivado
            </Badge>
          )}
        </div>
      </div>

      {creado === "1" && (
        <p
          role="status"
          className="rounded-2xl bg-salvia/15 px-4 py-3 font-bold text-salvia"
        >
          ¡Pack creado! Puedes agregar su foto aquí a la derecha.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <BundleForm initial={initial} variantOptions={variantOptions} />
        <div className="flex flex-col gap-6">
          <BundleImageManager
            bundleId={bundle.id}
            bundleName={bundle.name}
            imageUrl={bundle.image_url}
          />
          <BundleActiveToggle bundleId={bundle.id} isActive={bundle.is_active} />
        </div>
      </div>
    </div>
  );
}
