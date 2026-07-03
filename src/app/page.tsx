import Hero from "@/components/marca/Hero";
import IngredientMarquee from "@/components/marca/IngredientMarquee";
import StorySection from "@/components/marca/StorySection";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/tienda/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { getProducts } from "@/lib/catalog";

export const revalidate = 60;

const ORDER_STEPS = [
  {
    accent: "bg-amarillo text-tinta",
    title: "Elige tus granolas",
    description: "Explora la tienda y arma tu carrito desde el celular.",
  },
  {
    accent: "bg-salvia text-blanco-crema",
    title: "Confirma tu pedido",
    description: "Tu pedido queda registrado con un código único.",
  },
  {
    accent: "bg-berry text-tinta",
    title: "Coordinamos por WhatsApp",
    description: "Nelly te confirma la entrega y el pago, sin vueltas.",
  },
  {
    accent: "bg-tinta text-amarillo",
    title: "Llega a tu mesa",
    description: "Recién tostadita, por delivery en Arequipa o recojo.",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <Hero />
      <IngredientMarquee />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="La tanda de esta semana"
            title="Nuestras granolas"
            description="Hechas a mano, sin apuro y sin nada que no pondrías en tu propia cocina. Cada sabor tiene su propio color."
          />
          <ButtonLink href="/tienda" variant="secondary">
            Ver toda la tienda
          </ButtonLink>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 120}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <StorySection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeader
          eyebrow="Así de simple"
          title="¿Cómo pido mi granola?"
          align="center"
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ORDER_STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal
                replay
                delay={index * 100}
                className="flex h-full flex-col gap-3 rounded-3xl bg-blanco-crema p-6 shadow-calida"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-full font-display text-lg font-semibold italic ${step.accent}`}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="font-bold text-tinta">{step.title}</h3>
                <p className="text-sm text-cacao">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA final: bloque amarillo Naturelly, el color protagonista.
          Sin ingredientes flotantes: el único grupo vive en el hero. */}
      <section className="relative overflow-hidden bg-amarillo">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-20">
          <Reveal replay className="flex flex-col items-center gap-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-tinta/70">
              Recién tostadita
            </p>
            <h2 className="max-w-2xl font-display text-3xl font-semibold text-tinta sm:text-5xl">
              ¿Antojo de granola <em className="italic">crocante y dorada</em>?
            </h2>
            <p className="max-w-xl text-lg text-tinta/80">
              Nada empalagosa, con miel de verdad. Haz tu pedido hoy y
              coordinamos la entrega al toque.
            </p>
            <ButtonLink href="/tienda">Ver granolas</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
