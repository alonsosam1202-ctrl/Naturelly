import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BundleForm from "@/components/admin/BundleForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { VariantOption } from "@/lib/validations/bundle";

export const dynamic = "force-dynamic";

export default async function AdminNuevoPackPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("name, is_active, product_variants(id, size_label, sku, price, stock, is_active)")
    .order("sort_order");

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/packs"
          className="inline-flex items-center gap-2 font-bold text-miel-oscura hover:text-tinta"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver a packs
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-tinta">
          Nuevo pack
        </h1>
        <p className="mt-1 text-cacao">
          Arma el combo y guárdalo: después podrás agregar su foto.
        </p>
      </div>
      <BundleForm variantOptions={variantOptions} />
    </div>
  );
}
