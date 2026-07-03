import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/components/marca/ContactForm";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos: pedidos, ventas al por mayor o cualquier consulta sobre nuestra granola artesanal.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionHeader
            eyebrow="Contacto"
            title="Conversemos"
            description="¿Una consulta sobre tu pedido, una idea o un antojo grande? Escríbenos por aquí o directo por WhatsApp."
          />
          <div>
            <WhatsAppButton
              message="¡Hola! Vengo de la web de Naturelly y tengo una consulta."
              label="Escribir por WhatsApp"
            />
          </div>
          <p className="text-cacao">Arequipa, Perú</p>
        </div>
        <div className="rounded-2xl bg-blanco-crema p-6 shadow-calida sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
