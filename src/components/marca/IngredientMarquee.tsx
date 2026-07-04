import { MARQUEE_INGREDIENTS } from "@/lib/constants";

/** Separadores en acentos rotativos para que la cinta se sienta viva.
 *  Decorativos (la cinta entera es aria-hidden): usan los tonos vivos,
 *  exentos de contraste AA. */
const SEPARATOR_COLORS = [
  "text-miel",
  "text-amarillo",
  "text-salvia",
  "text-berry",
];

/**
 * Cinta de ingredientes andinos en fondo tinta: la firma visual de la marca
 * y el único bloque oscuro permitido. UN solo carril (BRAND_GUIDE.md), en
 * una sola dirección; la lista va duplicada para que el loop de -50% sea
 * continuo y sin saltos. Se pausa al hover y se detiene con
 * prefers-reduced-motion.
 */
export default function IngredientMarquee() {
  const items = [...MARQUEE_INGREDIENTS, ...MARQUEE_INGREDIENTS];
  return (
    <div className="overflow-hidden bg-tinta py-2.5" aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-6 hover:[animation-play-state:paused]">
        {items.map((ingredient, index) => (
          <span
            key={`${ingredient}-${index}`}
            className="flex items-center gap-6 whitespace-nowrap font-display text-base italic text-crema sm:text-lg"
          >
            {ingredient}
            <span className={SEPARATOR_COLORS[index % SEPARATOR_COLORS.length]}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
