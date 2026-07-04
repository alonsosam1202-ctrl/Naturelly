import { ButtonLink } from "@/components/ui/Button";
import BowlIllustration from "./BowlIllustration";
import RotatingSeal from "./RotatingSeal";
import FloatingIngredients from "./FloatingIngredients";

const TRUST_POINTS = [
  "Solo miel de abeja",
  "Tandas pequeñas",
  "Hecho en Arequipa",
];

/** Chips flotantes con moderación: dos, no una nube. */
const FLOATING_CHIPS = [
  { label: "Quinua", className: "left-0 top-12 -rotate-6", delay: "0s" },
  { label: "Miel de abeja", className: "-right-2 bottom-16 rotate-3", delay: "2s" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FloatingIngredients />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-2 md:pt-16">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
            <span className="size-2 rounded-full bg-salvia" aria-hidden />
            Granola artesanal de Arequipa
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-tinta sm:text-6xl">
            Tostada a mano, endulzada solo con{" "}
            <em className="italic text-miel-oscura">miel</em>
          </h1>
          <p className="max-w-md text-lg text-cacao">
            Superalimentos andinos —quinua, kiwicha, aguaymanto, cacao— en
            tandas pequeñas que salen recién tostaditas de la cocina de Nelly a
            tu mesa.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/tienda">Ver granolas</ButtonLink>
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
          {/* Arco amarillo Naturelly: protagonista, limpio y comercial */}
          <div
            className="absolute inset-x-3 bottom-1 top-0 rounded-t-full bg-amarillo"
            aria-hidden
          />
          <BowlIllustration className="relative h-auto w-full drop-shadow-sm" />

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
