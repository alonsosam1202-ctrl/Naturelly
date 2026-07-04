import { ButtonLink } from "@/components/ui/Button";
import BowlIllustration from "@/components/marca/BowlIllustration";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
      <BowlIllustration className="h-auto w-40" />
      <h1 className="font-display text-3xl font-semibold text-tinta">
        Esta página se la comieron
      </h1>
      <p className="text-cacao">
        No encontramos lo que buscabas, pero la cocina sigue abierta.
      </p>
      <ButtonLink href="/">Volver al inicio</ButtonLink>
    </div>
  );
}
