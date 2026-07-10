import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getWhatsAppNumber } from "@/lib/whatsapp";

/**
 * Sección informativa de tortas personalizadas (decoración sencilla con
 * fondant). Reglas de producto (aprobadas 2026-07-04):
 * - SIN precio fijo, SIN "Agregar al carrito", SIN configurador: todo se
 *   coordina y cotiza por WhatsApp antes de confirmar.
 * - No prometer diseños complejos: solo figuras sencillas, sujetas a
 *   evaluación de Nelly.
 * - No se publica mientras el número de WhatsApp siga siendo placeholder
 *   (getWhatsAppNumber() devuelve null): la sección entera se oculta.
 * Reutilizable en /tienda u otras páginas públicas.
 */
export default function CustomCakesSection() {
  if (!getWhatsAppNumber()) return null;

  return (
    <section
      id="personalizadas"
      className="mt-14 scroll-mt-24 overflow-hidden rounded-3xl bg-blush"
    >
      <div className="flex flex-col gap-4 p-8 text-center sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
          Tortas personalizadas
        </p>
        <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-tinta">
          Decoraciones sencillas con{" "}
          <em className="italic text-miel-oscura">fondant</em>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-cacao">
          ¿Tienes una celebración? Nelly prepara tortas con figuras sencillas
          de fondant. El tamaño, el sabor y la decoración se coordinan
          contigo antes de confirmar: cada diseño se evalúa primero y el
          precio depende de lo que elijas.
        </p>
        <p className="mx-auto max-w-2xl text-sm text-cacao">
          Sin compra directa desde la web: cuéntanos tu idea y te respondemos
          con una cotización.
        </p>
        <div className="mx-auto mt-2">
          <WhatsAppButton
            message="¡Hola! Vengo de la web de Naturelly y quiero cotizar una torta personalizada."
            label="Cotizar por WhatsApp"
          />
        </div>
      </div>
    </section>
  );
}
