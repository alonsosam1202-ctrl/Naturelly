import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PILLARS = [
  {
    accent: "bg-miel",
    title: "Hecho a mano",
    description: "Cada delicia sale de la cocina de Nelly, no de una fábrica.",
  },
  {
    accent: "bg-salvia",
    title: "Recetas que ya conquistaron",
    description: "Las mismas que su familia y amigos piden una y otra vez.",
  },
  {
    accent: "bg-amarillo",
    title: "En tandas pequeñas",
    description: "Sin producción en masa: lo justo para que llegue fresco.",
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
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
          Hecho en Arequipa
        </p>
        <p className="font-display text-3xl font-semibold leading-snug text-tinta sm:text-4xl">
          Nada sale de esta cocina sin haber pasado por{" "}
          <em className="italic text-salvia-oscura">las manos de Nelly</em>.
        </p>
        <p className="max-w-xl text-lg text-cacao">
          Sus delicias empezaron conquistando a familiares y amigos. Ahora
          también puedes pedirlas tú.
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
            className="inline-flex items-center gap-2 font-bold text-miel-oscura transition-colors hover:text-tinta"
          >
            Conoce nuestra historia
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
