import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminHeader({ name }: { name: string | null }) {
  return (
    <div className="border-b border-amarillo-suave bg-blanco-crema">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
            Panel de Naturelly
          </p>
          <p className="font-display text-xl font-semibold text-tinta">
            Hola{name ? `, ${name}` : ""}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Panel">
          <Link
            href="/admin"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Resumen
          </Link>
          <Link
            href="/admin/pedidos"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Pedidos
          </Link>
          <Link
            href="/admin/productos"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Productos
          </Link>
          <Link
            href="/admin/packs"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Packs
          </Link>
          <Link
            href="/admin/cuenta"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Mi cuenta
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </div>
  );
}
