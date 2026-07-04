import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import FaqAccordion from "@/components/marca/FaqAccordion";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resolvemos tus dudas sobre pedidos, delivery y nuestra granola artesanal.",
};

// Contenido fijo en el MVP; en Fase 2 se gestiona desde el admin.
const FAQS = [
  {
    question: "¿Cómo hago mi pedido?",
    answer:
      "Arma tu carrito en la tienda, completa tus datos en el checkout y tu pedido queda registrado con un código único. Al final te llevamos a WhatsApp para confirmarlo directamente con Nelly.",
  },
  {
    question: "¿Dónde hacen delivery?",
    answer:
      "Por ahora entregamos en Arequipa. Los distritos disponibles y el costo se confirman por WhatsApp al coordinar tu pedido.", // TODO: confirmar con Nelly distritos y tarifas
  },
  {
    question: "¿Cómo pago?",
    answer:
      "El pago se coordina por WhatsApp al confirmar tu pedido. Muy pronto podrás pagar directamente desde la web.",
  },
  {
    question: "¿La granola tiene azúcar añadida?",
    answer:
      "No. Usamos miel de abeja como único endulzante, sobre avena y superalimentos andinos tostados a mano.",
  },
  {
    question: "¿Hacen envíos fuera de Arequipa?",
    answer:
      "Todavía no, pero está en nuestros planes. Si eres de otra ciudad, escríbenos y te avisamos apenas llegemos allá.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <SectionHeader as="h1"
        eyebrow="Preguntas frecuentes"
        title="¿Tienes dudas? Aquí las resolvemos"
      />
      <div className="mt-10">
        <FaqAccordion faqs={FAQS} />
      </div>
      <div className="mt-10 rounded-2xl bg-amarillo-suave/60 p-6 text-center">
        <p className="font-bold text-tinta">¿No encontraste tu respuesta?</p>
        <div className="mt-4">
          <ButtonLink href="/contacto" variant="secondary">
            Escríbenos
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
