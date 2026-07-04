import { ButtonLink } from "@/components/ui/Button";
import BundlesTable, {
  type AdminBundleListItem,
} from "@/components/admin/BundlesTable";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPacksPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("bundles")
    .select(
      "id, name, slug, price, is_active, image_url, bundle_items(quantity, product_variants(stock))"
    )
    .order("created_at");

  const bundles: AdminBundleListItem[] = (data ?? []).map((bundle) => {
    const items = bundle.bundle_items ?? [];
    // Disponibilidad estimada: min(floor(stock / cantidad requerida))
    let availability: number | null = null;
    for (const item of items) {
      const stock = item.product_variants?.stock ?? 0;
      const perBundle = Math.floor(stock / item.quantity);
      availability =
        availability === null ? perBundle : Math.min(availability, perBundle);
    }
    return {
      id: bundle.id,
      name: bundle.name,
      slug: bundle.slug,
      price: Number(bundle.price),
      itemsCount: items.length,
      availability: availability ?? 0,
      is_active: bundle.is_active,
      imageUrl: bundle.image_url,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-tinta">
          Packs
        </h1>
        <ButtonLink href="/admin/packs/nuevo">Nuevo pack</ButtonLink>
      </div>
      <BundlesTable bundles={bundles} />
    </div>
  );
}
