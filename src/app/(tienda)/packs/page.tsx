import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import BundleCard from "@/components/tienda/BundleCard";
import { getBundles } from "@/lib/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packs",
  description:
    "Combos de granola artesanal con precio especial. Prueba todas nuestras variedades.",
};

export default async function PacksPage() {
  const bundles = await getBundles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeader as="h1"
        eyebrow="Packs"
        title="Combos con precio especial"
        description="Arma tu despensa o prueba todas las variedades pagando menos que por separado."
      />

      {bundles.length === 0 ? (
        <p className="mt-12 rounded-2xl bg-blanco-crema p-8 text-center text-cacao shadow-calida">
          Estamos armando nuevos packs. Mientras tanto, encuentra tu granola en
          la tienda.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  );
}
