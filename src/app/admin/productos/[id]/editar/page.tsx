import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProductForm from "@/components/admin/ProductForm";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductFormValues } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ creado?: string }>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminEditarProductoPage({
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
  const { data: product } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

  const initial: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category as ProductFormValues["category"],
    badge: (product.badge ?? "") as ProductFormValues["badge"],
    tagline: product.tagline ?? "",
    description: product.description ?? "",
    story: product.story ?? "",
    ingredientsText: (product.ingredients ?? []).join("\n"),
    benefitsText: (product.benefits ?? []).join("\n"),
    is_active: product.is_active,
    variants: [...product.product_variants]
      .sort(
        (a, b) =>
          (a.weight_grams ?? 0) - (b.weight_grams ?? 0) ||
          Number(a.price) - Number(b.price)
      )
      .map((variant) => ({
        id: variant.id,
        size_label: variant.size_label,
        weight_grams: variant.weight_grams,
        price: Number(variant.price),
        compare_at_price:
          variant.compare_at_price === null
            ? null
            : Number(variant.compare_at_price),
        stock: variant.stock,
        sku: variant.sku,
        is_active: variant.is_active,
      })),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 font-bold text-miel-oscura hover:text-tinta"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver a productos
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-tinta">
            {product.name}
          </h1>
          {product.is_active ? (
            <Badge className="bg-salvia/20 text-salvia-oscura">Visible</Badge>
          ) : (
            <Badge className="bg-terracota/10 text-terracota">
              Desactivado
            </Badge>
          )}
          {product.is_active && (
            <Link
              href={`/producto/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-cacao hover:text-tinta"
            >
              Ver en la tienda
              <ExternalLink className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      {creado === "1" && (
        <p
          role="status"
          className="rounded-2xl bg-salvia/15 px-4 py-3 font-bold text-salvia-oscura"
        >
          ¡Producto creado! Ahora agrega sus fotos más abajo.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <ProductForm initial={initial} />
        <div className="flex flex-col gap-6">
          <ImageUploader
            productId={product.id}
            images={[...product.product_images].sort(
              (a, b) => a.position - b.position
            )}
          />
          <ProductActiveToggle
            productId={product.id}
            isActive={product.is_active}
          />
        </div>
      </div>
    </div>
  );
}
