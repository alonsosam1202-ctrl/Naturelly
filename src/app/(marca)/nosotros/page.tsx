import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import BowlIllustration from "@/components/marca/BowlIllustration";
import IngredientMarquee from "@/components/marca/IngredientMarquee";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "La historia de Naturelly: delicias artesanales hechas por Nelly en Arequipa, Perú.",
};

export default function NosotrosPage() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeader as="h1"
            eyebrow="Nuestra historia"
            title="Lo que Nelly haría para su propia familia"
          />
          <div className="space-y-4 text-lg text-cacao">
            <p>
              Naturelly nace en Arequipa, en la cocina de Nelly. De ahí salen
              su granola artesanal —una receta propia que empezó conquistando
              a familiares y amigos— y sus tortas caseras: zanahoria,
              chocolate y naranja, con decoraciones sencillas en fondant
              cuando la ocasión lo pide.
            </p>
            <p>
              Todo se prepara a mano y en tandas pequeñas: aquí no hay
              fábrica, hay una cocina.
            </p>
            <p>
              {/* TODO: confirmar con Nelly la historia personal completa
                  (cómo empezó, desde cuándo, anécdotas reales). */}
              Muy pronto te contaremos aquí la historia completa de Nelly, con
              sus propias palabras.
            </p>
          </div>
          <ButtonLink href="/tienda" className="w-fit">
            Ver la tienda
          </ButtonLink>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <BowlIllustration
            primary="#7CA66A"
            secondary="#FEDB5F"
            className="h-auto w-full"
          />
        </div>
      </div>
      <IngredientMarquee />
    </>
  );
}
