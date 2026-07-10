import type { Metadata } from "next";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import IngredientMarquee from "@/components/marca/IngredientMarquee";
import { ButtonLink } from "@/components/ui/Button";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// ⚠️ IMAGEN INTERINA (generada): manos trabajando masa en una cocina.
// Se reemplaza por la FOTO REAL de Nelly / su cocina cuando exista
// (LAUNCH_CHECKLIST secciones K y L). Asset de Alonso en site-assets.
const NOSOTROS_IMG = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/images/nosotros-interina.png`;

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "La historia de Naturelly: delicias artesanales hechas por Nelly en Arequipa, Perú.",
};

/* CONTENIDO REAL confirmado (Alonso, 2026-07): por encargo con cupos
   diarios, entrega al día siguiente, delivery en toda Arequipa (externo,
   coordinado por WhatsApp) o recojo, pago por Yape coordinado por
   WhatsApp, atención L-S 10 am - 7 pm. Nada de esto es borrador. */
const PASOS = [
  {
    numero: "1",
    titulo: "Pides por la web",
    detalle:
      "Eliges tus delicias y tu pedido queda registrado con un código único.",
  },
  {
    numero: "2",
    titulo: "Nelly lo prepara por encargo",
    detalle:
      "Cada día acepta pocos pedidos: lo tuyo se hornea para ti, no sale de una vitrina.",
  },
  {
    numero: "3",
    titulo: "Llega al día siguiente",
    detalle:
      "Coordinas por WhatsApp la entrega en toda Arequipa (o el recojo) y el pago por Yape.",
  },
];

const PROMESAS = [
  {
    titulo: "Hecho a mano, de verdad",
    detalle:
      "Sin fábrica ni producción en masa: una cocina, dos manos y tandas pequeñas.",
  },
  {
    titulo: "Cupos limitados por día",
    detalle:
      "Preferimos decir “por hoy ya no” antes que entregar algo hecho al apuro.",
  },
  {
    titulo: "Hablas con quien hornea",
    detalle:
      "Tu pedido se confirma por WhatsApp directamente con Nelly, sin intermediarios.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      {/* ── Historia (REAL, con el párrafo final pendiente de Nelly) ── */}
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeader as="h1"
            eyebrow="Nuestra historia"
            title="Lo que Nelly haría para su propia familia"
          />
          <div className="space-y-4 text-lg text-cacao">
            <p>
              Naturelly nace en Arequipa, en la cocina de Nelly. De ahí salen
              su granola artesanal —una receta propia que empezó conquistando
              a familiares y amigos—, sus tortas caseras y sus postres, con
              decoraciones sencillas en fondant cuando la ocasión lo pide.
            </p>
            <p>
              Todo se prepara a mano y en tandas pequeñas: aquí no hay
              fábrica, hay una cocina. Por eso trabajamos por encargo, con
              cupos limitados cada día, y tu pedido se entrega recién hecho
              al día siguiente.
            </p>
          </div>
          <ButtonLink href="/tienda" className="w-fit">
            Ver la tienda
          </ButtonLink>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <div className="hairline-oro relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-2xl shadow-calida">
            <Image
              src={NOSOTROS_IMG}
              alt="Manos amasando sobre una mesa de trabajo, con harina, huevos y naranjas"
              fill
              sizes="(max-width: 768px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <IngredientMarquee />

      {/* ── Así funciona un pedido (REAL: reglas confirmadas del negocio) ── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeader
          eyebrow="Así trabajamos"
          title="Un pedido, paso a paso"
          align="center"
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {PASOS.map((paso) => (
            <li
              key={paso.numero}
              className="flex flex-col gap-3 rounded-3xl bg-blanco-crema p-6 shadow-calida"
            >
              <span
                className="flex size-10 items-center justify-center rounded-full bg-oro font-display text-lg font-semibold italic text-tinta"
                aria-hidden
              >
                {paso.numero}
              </span>
              <h3 className="font-bold text-tinta">{paso.titulo}</h3>
              <p className="text-sm text-cacao">{paso.detalle}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-sm text-piedra">
          Atendemos pedidos de lunes a sábado, de 10 de la mañana a 7 de la
          noche.
        </p>
      </section>

      {/* ── Nuestra promesa (REAL: solo afirmaciones verificables) ── */}
      <section className="bg-blush">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Nuestra promesa"
            title="Pocas cosas, bien hechas"
            align="center"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {PROMESAS.map((promesa) => (
              <li
                key={promesa.titulo}
                className="flex flex-col gap-2 rounded-3xl bg-blanco-crema p-6 shadow-calida"
              >
                <span className="size-3 rounded-full bg-oro" aria-hidden />
                <h3 className="font-bold text-tinta">{promesa.titulo}</h3>
                <p className="text-sm text-cacao">{promesa.detalle}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── BORRADOR/INTERINO — historia personal de Nelly ──────────────
          Pendiente de la conversación con ella (LAUNCH_CHECKLIST sección
          K: cómo empezó, desde cuándo, primeros clientes, su mensaje).
          NO inventar anécdotas ni citas: este bloque solo anuncia la
          historia y se reemplaza con sus palabras reales. ── */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-oro-texto">
          Muy pronto
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-tinta">
          La historia de Nelly, con sus propias palabras
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-cacao">
          Cómo empezó todo, quiénes fueron sus primeros clientes y por qué
          cocinar es su manera de cuidar. Estamos preparando esta parte con
          calma — mientras tanto, cualquier duda se la puedes preguntar
          directamente.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton
            message="¡Hola! Vengo de la web de Naturelly y quiero hacerles una consulta."
            label="Escríbele a Naturelly"
          />
        </div>
      </section>
    </>
  );
}
