"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso en ms para escalonar tarjetas de una misma grilla. */
  delay?: number;
  /** Si true, la animación se repite cada vez que el elemento reentra al viewport. */
  replay?: boolean;
  /** Porción del elemento que debe verse para dispararse. */
  threshold?: number;
  /** Margen del observador (negativo abajo = se dispara un poco antes del borde). */
  rootMargin?: string;
};

/**
 * Aparición suave al entrar al viewport, sin riesgo para SEO:
 * - El contenido nace VISIBLE en el HTML del servidor (Google lo indexa).
 * - Solo tras hidratar, y solo si el elemento está bajo el fold, se oculta
 *   e inmediatamente se observa para animarlo al entrar.
 * - Con `replay`, al salir del viewport vuelve a ocultarse y se anima de
 *   nuevo al reentrar. Sin `replay`, anima una sola vez.
 * - prefers-reduced-motion y navegadores sin IntersectionObserver lo
 *   dejan estático.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  replay = false,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    // Above the fold: no animar (evita parpadeo en el primer render)
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          if (!replay) observer.disconnect();
        } else if (replay) {
          setPhase("hidden");
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [replay, threshold, rootMargin]);

  return (
    <div
      ref={ref}
      style={phase === "shown" ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${
        phase === "hidden"
          ? "translate-y-5 opacity-0"
          : "translate-y-0 opacity-100"
      } transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
