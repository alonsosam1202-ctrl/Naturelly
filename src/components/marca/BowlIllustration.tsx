type BowlIllustrationProps = {
  /** Acento primario del sabor (hex). Ver FLAVOR_ACCENTS en constants.ts. */
  primary?: string;
  /** Acento secundario del sabor (hex). */
  secondary?: string;
  className?: string;
};

/**
 * Ilustración temporal de producto: bowl cerámico claro con granola,
 * frutos del sabor y chorrito de miel, sobre un halo suave.
 *
 * ⚠️ Placeholder visual: cuando existan fotos reales de producto
 * (fondo crema, luz natural, misma paleta), este componente se reemplaza
 * por <Image> manteniendo el arco y el fondo pastel por sabor.
 */
export default function BowlIllustration({
  primary = "#E6A12D",
  secondary = "#FEDB5F",
  className = "",
}: BowlIllustrationProps) {
  // Id estable por combinación de sabor para los gradientes del SVG
  const uid = `${primary.replace("#", "")}${secondary.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 240 210"
      role="img"
      aria-label="Ilustración de un bowl de granola artesanal"
      className={className}
    >
      <defs>
        <linearGradient id={`honey-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FEDB5F" />
          <stop offset="1" stopColor="#E6A12D" />
        </linearGradient>
        <radialGradient id={`halo-${uid}`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor={primary} stopOpacity="0.2" />
          <stop offset="0.7" stopColor={primary} stopOpacity="0.07" />
          <stop offset="1" stopColor={primary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo de color del sabor */}
      <circle cx="120" cy="100" r="96" fill={`url(#halo-${uid})`} />
      <circle cx="120" cy="100" r="66" fill="#FFFDF9" opacity="0.6" />

      {/* Sombra suave */}
      <ellipse cx="120" cy="184" rx="64" ry="9" fill="#18212A" opacity="0.07" />

      {/* Montículo de granola */}
      <path
        d="M56 102c4-24 26-42 64-42s60 18 64 42c-14 6-42 10-64 10s-50-4-64-10Z"
        fill="#F5DFB8"
      />
      {/* Hojuelas tostadas */}
      <rect x="70" y="82" width="13" height="7" rx="3.5" fill="#ECC488" transform="rotate(-18 76 85)" />
      <rect x="128" y="66" width="13" height="7" rx="3.5" fill="#ECC488" transform="rotate(12 134 69)" />
      <rect x="158" y="88" width="12" height="7" rx="3.5" fill="#ECC488" transform="rotate(-10 164 91)" />
      <rect x="100" y="92" width="12" height="7" rx="3.5" fill="#F2D19E" transform="rotate(22 106 95)" />
      {/* Clusters crocantes con brillo */}
      <circle cx="88" cy="74" r="9" fill="#C29254" />
      <circle cx="85" cy="71" r="2.4" fill="#FFFBF6" opacity="0.85" />
      <circle cx="146" cy="78" r="10" fill="#8A5F3E" />
      <circle cx="143" cy="74" r="2.6" fill="#FFFBF6" opacity="0.75" />
      <circle cx="118" cy="64" r="8" fill="#D0A164" />
      <circle cx="116" cy="61" r="2.2" fill="#FFFBF6" opacity="0.85" />
      <circle cx="68" cy="92" r="6.5" fill="#8A5F3E" opacity="0.85" />
      <circle cx="170" cy="98" r="6" fill="#C29254" />
      {/* Frutos del sabor (acentos vivos) */}
      <circle cx="103" cy="76" r="7" fill={primary} />
      <circle cx="100.5" cy="73.5" r="2" fill="#FFFBF6" opacity="0.9" />
      <circle cx="133" cy="92" r="6.5" fill={secondary} />
      <circle cx="130.8" cy="89.8" r="1.8" fill="#FFFBF6" opacity="0.9" />
      <circle cx="160" cy="72" r="5.5" fill={primary} opacity="0.9" />
      {/* Hojita fresca */}
      <path d="M78 62c-2-8 3-14 11-15-1 8-4 13-11 15Z" fill="#7CA66A" />
      {/* Chorrito de miel */}
      <path
        d="M96 46c8 10 20 14 28 26"
        stroke={`url(#honey-${uid})`}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="127" cy="76" r="4" fill="#FEDB5F" opacity="0.95" />

      {/* Bowl cerámico claro con banda del sabor */}
      <path
        d="M42 104h156c0 36-26 62-58 68l-3 8h-34l-3-8c-32-6-58-32-58-68Z"
        fill="#FFFDF9"
        stroke="#FFF1F4"
        strokeWidth="3"
      />
      <path
        d="M56 128c20 9 108 9 128 0"
        stroke={secondary}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M64 146c18 8 94 8 112 0"
        stroke={primary}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
    </svg>
  );
}
