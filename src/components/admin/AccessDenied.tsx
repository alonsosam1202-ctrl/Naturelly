import { ButtonLink } from "@/components/ui/Button";
import LogoutButton from "./LogoutButton";

/**
 * Pantalla para usuarios autenticados SIN rol admin que llegan a /admin
 * por URL directa. La autorización real también vive en la BD (RLS + RPC),
 * esto es solo la cara amable.
 */
export default function AccessDenied() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-tinta">
        Acceso denegado
      </h1>
      <p className="text-cacao">
        Esta sección es solo para la administración de Naturelly. Tu cuenta no
        tiene permisos de administración.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Volver a la tienda</ButtonLink>
        <LogoutButton />
      </div>
    </div>
  );
}
