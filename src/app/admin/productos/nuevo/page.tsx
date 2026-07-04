import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default function AdminNuevoProductoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 font-bold text-miel hover:text-miel-oscura"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver a productos
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-tinta">
          Nuevo producto
        </h1>
        <p className="mt-1 text-cacao">
          Completa los datos y guarda: después podrás agregar las fotos.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
