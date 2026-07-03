import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Recetas",
  description: "Recetas con granola artesanal Naturelly. Muy pronto.",
};

/**
 * El blog de recetas gestionable es de Fase 2 (ROADMAP.md). Esta página es
 * solo un adelanto para no romper la navegación.
 */
export default function RecetasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <SectionHeader
        eyebrow="Recetas"
        title="Se está horneando algo rico"
        description="Muy pronto: recetas con granola para desayunos, postres y antojos de media tarde, directo de la cocina de Nelly."
        align="center"
      />
      <div className="mt-8">
        <ButtonLink href="/tienda">Mientras tanto, ve las granolas</ButtonLink>
      </div>
    </div>
  );
}
