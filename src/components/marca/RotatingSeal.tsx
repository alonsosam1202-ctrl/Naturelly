import { Dancing_Script } from "next/font/google";

// Manuscrita elegante SOLO para la firma "Nelly" del sello (ver BRAND_GUIDE.md)
const script = Dancing_Script({ subsets: ["latin"], weight: "700" });

type RotatingSealProps = {
  className?: string;
  /** Id único de los paths cuando hay más de un sello en la misma página. */
  pathId?: string;
};

/**
 * Sello personal de la marca: "HECHO POR · Nelly · AREQUIPA · PERÚ".
 * Composición propia (no copia de referentes): círculo fino de trazo
 * orgánico, arcos en Karla con tracking amplio y la firma manuscrita al
 * centro. El aro exterior gira lento (spin-slow, 60 s) mientras "Nelly"
 * permanece estática para leerse siempre; prefers-reduced-motion detiene
 * el giro. Regla de BRAND_GUIDE.md: máximo UN sello protagonista por
 * sección. Fondo transparente.
 */
export default function RotatingSeal({
  className = "",
  pathId = "seal",
}: RotatingSealProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Sello: hecho por Nelly en Arequipa, Perú"
      className={className}
    >
      <defs>
        {/* Arco superior (texto hacia afuera) */}
        <path id={`${pathId}-top`} d="M 22 60 A 38 38 0 0 1 98 60" />
        {/* Arco inferior (sentido inverso para que se lea derecho) */}
        <path id={`${pathId}-bottom`} d="M 15 60 A 45 45 0 0 0 105 60" />
      </defs>

      {/* Aro giratorio: círculo orgánico + arcos + acentos */}
      <g className="animate-spin-slow" style={{ transformOrigin: "60px 60px" }}>
        {/* Círculo fino de radio constante; la "mano alzada" es solo una
            desviación de ±0.4 para no deformarlo (gira, y toda asimetría
            grande se percibe como bamboleo) */}
        <path
          d="M 60 12 C 86.6 11.7 108.3 33.6 108 60 C 107.7 86.4 86.4 108.3 60 108 C 33.6 107.7 11.7 86.4 12 60 C 12.3 33.6 33.6 11.7 60 12 Z"
          fill="none"
          stroke="#1B1A17"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <text
          fill="#1B1A17"
          fontSize="9"
          fontWeight="700"
          letterSpacing="2.4"
          fontFamily="var(--font-instrument), system-ui, sans-serif"
        >
          <textPath href={`#${pathId}-top`} startOffset="50%" textAnchor="middle">
            HECHO POR
          </textPath>
        </text>
        <text
          fill="#1B1A17"
          fontSize="9"
          fontWeight="700"
          letterSpacing="2.4"
          fontFamily="var(--font-instrument), system-ui, sans-serif"
        >
          <textPath
            href={`#${pathId}-bottom`}
            startOffset="50%"
            textAnchor="middle"
          >
            AREQUIPA · PERÚ
          </textPath>
        </text>
        {/* Dos granos que equilibran la composición a los lados */}
        <circle cx="16.5" cy="60" r="2.1" fill="#C39A52" stroke="#1B1A17" strokeWidth="0.6" />
        <circle cx="103.5" cy="60" r="2.1" fill="#C39A52" stroke="#1B1A17" strokeWidth="0.6" />
      </g>

      {/* Firma estática: protagonista y siempre legible */}
      <text
        x="60"
        y="69"
        textAnchor="middle"
        fill="#1B1A17"
        fontSize="30"
        style={{ fontFamily: `${script.style.fontFamily}, cursive` }}
      >
        Nelly
      </text>
    </svg>
  );
}
