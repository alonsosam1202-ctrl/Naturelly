import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/tienda", label: "Tienda" },
  { href: "/packs", label: "Packs" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Footer "Tinta & Oro": tinta plana (la spec la permite en footer y cintas
 * delgadas; el degradado Atmósfera se reserva para hero/banners), texto
 * crema y acentos oro.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-tinta text-crema-clara">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="font-display text-2xl font-semibold">Naturelly</p>
          <p className="max-w-xs">
            Delicias artesanales hechas por Nelly en Arequipa, Perú: granola,
            tortas caseras y pedidos personalizados.
          </p>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Enlaces del pie">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-oro">
            Explora
          </p>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit font-bold underline-offset-4 transition-all hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-oro">
            Pedidos
          </p>
          <p>Haz tu pedido desde la web y lo confirmamos juntos por WhatsApp.</p>
          <p>Arequipa, Perú</p>
        </div>
      </div>
      <div className="border-t border-crema-clara/15 px-4 py-5 text-center text-sm text-crema-clara/80">
        © {year} Naturelly. Hecho a mano en Arequipa, Perú.
      </div>
    </footer>
  );
}
