import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PILLARS = [
  {
    accent: "bg-miel",
    title: "Miel como único endulzante",
    description: "Nada de azúcar refinada ni jarabes: dulzor de verdad.",
  },
  {
    accent: "bg-salvia",
    title: "Del origen, no del catálogo",
    description: "Quinua, kiwicha y aguaymanto comprados frescos, de la tierra.",
  },
  {
    accent: "bg-amarillo",
    title: "Tandas pequeñas",
    description: "Cada lote sale tostadito, crocante y con nombre propio.",
  },
];

/**
 * Sección editorial: cita grande en Fraunces sobre lino, aire generoso y
 * pilares ligeros en vez de bloques de cards sobre beige.
 */
export default function StorySection() {
  return (
    <section className="bg-blush">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pb-12 pt-16 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel">
          Del Perú para el mundo
        </p>
        <p className="font-display text-3xl font-semibold leading-snug text-tinta sm:text-4xl">
          Mientras otras marcas presumen{" "}
          <em className="italic text-cacao">granos ancestrales</em>, nosotros
          venimos de la tierra donde{" "}
          <em className="italic text-salvia">nacieron esos granos</em>.
        </p>
        <p className="max-w-xl text-lg text-cacao">
          Cada lote se tuesta a mano en la cocina de Nelly, en Arequipa: de su
          cocina a tu mesa.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <li
              key={pillar.title}
              className="flex flex-col gap-2 rounded-3xl bg-blanco-crema p-6 shadow-calida"
            >
              <span className={`size-3 rounded-full ${pillar.accent}`} aria-hidden />
              <h3 className="font-bold text-tinta">{pillar.title}</h3>
              <p className="text-sm text-cacao">{pillar.description}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link
            href="/nosotros"
            className="inline-flex items-center gap-2 font-bold text-miel transition-colors hover:text-miel-oscura"
          >
            Conoce nuestra historia
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
