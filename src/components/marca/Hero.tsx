import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import RotatingSeal from "./RotatingSeal";
import FloatingIngredients from "./FloatingIngredients";

// Foto de vitrina (asset de Alonso, bucket site-assets). Mientras la imagen
// esté en iteración vive como .jpg optimizado con cache-control no-cache:
// se puede reemplazar en Storage (mismo nombre) y verse al instante con un
// hard refresh, sin tocar código. Al declararla FINAL, re-subir con
// `cache-control: max-age=86400` para que el navegador sí la cachee.
const HERO_IMG = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/images/hero-portada.jpg`;

const TRUST_POINTS = [
  "Hecho a mano",
  "En pequeñas cantidades",
  "Hecho en Arequipa",
];

/** Chips flotantes con moderación: dos, no una nube. Posiciones originales;
 *  textos que no dependen de la foto exacta del hero. */
const FLOATING_CHIPS = [
  { label: "Tortas y postres", className: "left-0 top-12 -rotate-6", delay: "0s" },
  { label: "Granola Premium", className: "-right-2 bottom-16 rotate-3", delay: "2s" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FloatingIngredients />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-2 md:pt-16">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
            <span className="size-2 rounded-full bg-salvia" aria-hidden />
            Hecho artesanalmente en Arequipa
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-tinta sm:text-6xl">
            De la cocina de Nelly,{" "}
            <em className="italic text-miel-oscura">para compartir</em>
          </h1>
          <p className="max-w-md text-lg text-cacao">
            Granola artesanal, tortas caseras y pedidos personalizados,
            preparados por Nelly en pequeñas cantidades.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/tienda">Ver la tienda</ButtonLink>
            <ButtonLink href="/nosotros" variant="secondary">
              Nuestra historia
            </ButtonLink>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm font-bold text-cacao"
              >
                <span className="size-1.5 rounded-full bg-salvia" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-sm pt-6 md:max-w-md">
          {/* La foto vive DENTRO del arco de horno (forma firma) con
              hairline dorado — aplicación Tinta & Oro */}
          <div className="hairline-oro relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-2xl shadow-calida-lg">
            <Image
              src={HERO_IMG}
              alt="Vitrina de Naturelly: torta de chocolate, cupcakes, cheesecake y granola"
              fill
              sizes="(max-width: 768px) 90vw, 40vw"
              priority
              className="object-cover"
            />
          </div>

          {FLOATING_CHIPS.map((chip) => (
            <span
              key={chip.label}
              style={{ animationDelay: chip.delay }}
              className={`absolute animate-float rounded-full bg-blanco-crema px-4 py-1.5 font-display text-sm font-semibold italic text-tinta shadow-calida ${chip.className}`}
              aria-hidden
            >
              {chip.label}
            </span>
          ))}

          <RotatingSeal
            pathId="seal-hero"
            className="absolute -left-4 bottom-2 size-24 drop-shadow-sm sm:size-28"
          />
        </div>
      </div>
    </section>
  );
}
