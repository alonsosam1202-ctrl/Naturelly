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
    title: "Elige tus antojos",
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
    description: "Recién hecho, por delivery en Arequipa o recojo.",
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
            eyebrow="Recién salido de la cocina"
            title="Nuestras delicias"
            description="Preparaciones artesanales hechas a mano, sin apuro y sin nada que no pondrías en tu propia cocina."
          />
          <ButtonLink href="/tienda" variant="secondary">
            Ver toda la tienda
          </ButtonLink>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            // h-full: el grid estira este envoltorio; sin él, la tarjeta
            // interior queda con su altura natural y las tres se desalinean
            <Reveal key={product.id} delay={index * 120} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <StorySection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeader
          eyebrow="Así de simple"
          title="¿Cómo hago mi pedido?"
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

      {/* CTA final: banner destacado con la aplicación "Atmósfera" de la
          spec Tinta & Oro (degradado + hairline dorado, nunca bloque plano). */}
      <section className="px-4 pb-16 sm:px-6 md:pb-20">
        <div className="bg-atmosfera hairline-oro relative mx-auto max-w-6xl overflow-hidden rounded-xl">
          <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center md:py-20">
            <Reveal replay className="flex flex-col items-center gap-6">
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-oro">
                Hecho a mano
              </p>
              <h2 className="max-w-2xl font-display text-3xl font-semibold text-crema-clara sm:text-5xl">
                ¿Antojo de algo <em className="italic text-oro">hecho en casa</em>?
              </h2>
              <p className="max-w-xl text-lg text-crema-clara/85">
                Granola recién tostada o una torta para compartir. Haz tu pedido
                hoy y coordinamos la entrega al toque.
              </p>
              <ButtonLink href="/tienda">Ver la tienda</ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
