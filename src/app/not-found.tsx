import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

// Plato con migas (asset de Alonso, site-assets, fondo transparente):
// el chiste visual de "esta página se la comieron". Mismo tratamiento de
// arco + hairline dorado que el resto de imágenes del sitio.
const NOT_FOUND_IMG = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/images/404.png`;

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
      <div className="hairline-oro relative aspect-[4/5] w-56 overflow-hidden rounded-t-full rounded-b-2xl bg-blush">
        <Image
          src={NOT_FOUND_IMG}
          alt="Plato vacío con migas de torta y un tenedor"
          fill
          sizes="224px"
          className="object-contain p-5"
        />
      </div>
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
