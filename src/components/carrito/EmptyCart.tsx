import { ButtonLink } from "@/components/ui/Button";

/**
 * Vacío como invitación (BRAND_GUIDE.md).
 */
export default function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex w-full flex-col items-center gap-4 py-10 text-center">
      <p className="font-display text-2xl font-semibold text-tinta">
        Tu carrito está vacío
      </p>
      <p className="text-cacao">La Andina Power te está esperando →</p>
      <ButtonLink href="/tienda" onClick={onNavigate}>
        Ver granolas
      </ButtonLink>
    </div>
  );
}
