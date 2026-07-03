import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  message: string;
  label?: string;
  className?: string;
};

/**
 * Botón de WhatsApp (verde reservado solo para esto). Si el número del
 * negocio aún no está configurado, lo dice claramente en vez de romperse.
 */
export default function WhatsAppButton({
  message,
  label = "Confirmar por WhatsApp",
  className = "",
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(message);

  if (!url) {
    return (
      <p className="rounded-2xl bg-amarillo-suave px-4 py-3 text-sm text-cacao">
        El número de WhatsApp de la tienda aún no está configurado.
        {/* TODO: confirmar con Nelly y completar NEXT_PUBLIC_WHATSAPP_NUMBER */}
      </p>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-bold text-blanco-crema shadow-calida transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-calida-lg ${className}`}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}
