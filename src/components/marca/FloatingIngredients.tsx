/**
 * Capa decorativa de ingredientes flotando (hojuela, gota de miel, hoja,
 * fruto, grano). Reglas de BRAND_GUIDE.md: UN solo grupo por sección
 * principal (hoy: solo el hero), agrupado como composición — no elementos
 * sueltos a ambos lados. Siempre aria-hidden; en mobile se atenúa y se
 * reduce a lo esencial. Animación CSS pura (float, suave);
 * prefers-reduced-motion la detiene.
 */

const OAT = (
  <svg viewBox="0 0 24 24" className="size-full">
    <rect x="3" y="9" width="18" height="7" rx="3.5" fill="#FEDB5F" transform="rotate(-16 12 12)" />
  </svg>
);

const HONEY_DROP = (
  <svg viewBox="0 0 24 24" className="size-full">
    <path d="M12 3c3.4 5 5 7.2 5 10a5 5 0 1 1-10 0c0-2.8 1.6-5 5-10Z" fill="#E6A12D" />
  </svg>
);

const LEAF = (
  <svg viewBox="0 0 24 24" className="size-full">
    <path d="M5 19C5 9 12 4 20 4c-1 9-6 15-15 15Z" fill="#7CA66A" />
  </svg>
);

const BERRY = (
  <svg viewBox="0 0 24 24" className="size-full">
    <circle cx="12" cy="13" r="8" fill="#E9B6D0" />
    <circle cx="9.5" cy="10.5" r="2" fill="#FFFBF6" opacity="0.8" />
  </svg>
);

const GRAIN = (
  <svg viewBox="0 0 24 24" className="size-full">
    <ellipse cx="12" cy="12" rx="5" ry="8" fill="#5A3A28" transform="rotate(24 12 12)" />
  </svg>
);

/**
 * Composición única en la esquina superior derecha: acompaña al arco del
 * bowl sin tapar el titular ni los CTAs (columna izquierda). Un poco más
 * grande que antes; los elementos menores desaparecen en pantallas chicas.
 */
const ITEMS = [
  { svg: HONEY_DROP, className: "right-[6%] top-[8%] size-7 opacity-90", delay: "0s" },
  { svg: OAT, className: "right-[15%] top-[19%] size-8 opacity-85", delay: "1.6s" },
  { svg: LEAF, className: "right-[3%] top-[30%] size-7 opacity-80 hidden md:block", delay: "2.8s" },
  { svg: BERRY, className: "right-[12%] top-[40%] size-5 opacity-85 hidden md:block", delay: "0.9s" },
  { svg: GRAIN, className: "right-[22%] top-[7%] size-5 opacity-50 hidden lg:block", delay: "3.6s" },
];

export default function FloatingIngredients({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 max-md:opacity-50 ${className}`}
      aria-hidden
    >
      {ITEMS.map((item, index) => (
        <span
          key={index}
          className={`absolute animate-float ${item.className}`}
          style={{ animationDelay: item.delay }}
        >
          {item.svg}
        </span>
      ))}
    </div>
  );
}
