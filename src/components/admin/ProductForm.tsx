"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { saveProduct } from "@/app/admin/productos/actions";
import { CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

type ProductFormProps = {
  /** Sin `initial` = crear; con `initial` = editar. */
  initial?: ProductFormValues;
};

const EMPTY_VARIANT = {
  size_label: "",
  weight_grams: 250,
  price: 0,
  compare_at_price: null,
  stock: 0,
  sku: "",
  is_active: true,
};

const inputClass =
  "rounded-2xl border-2 border-amarillo-suave bg-blanco-crema px-4 py-3 text-tinta focus:border-miel focus:outline-none";

export default function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initial ?? {
      name: "",
      slug: "",
      category: "clasica",
      badge: "",
      tagline: "",
      description: "",
      story: "",
      ingredientsText: "",
      benefitsText: "",
      is_active: true,
      variants: [EMPTY_VARIANT],
    },
  });

  // keyName evita que RHF pise el `id` real de las variantes existentes
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
    keyName: "fieldKey",
  });

  // El enlace se sugiere desde el nombre hasta que Nelly lo edite a mano
  const nameValue = watch("name");
  useEffect(() => {
    if (!slugEdited) {
      setValue("slug", slugify(nameValue ?? ""));
    }
  }, [nameValue, slugEdited, setValue]);

  async function onSubmit(values: ProductFormValues) {
    setResult(null);
    const response = await saveProduct(values);
    if (response.ok && !isEdit && response.productId) {
      router.push(`/admin/productos/${response.productId}/editar?creado=1`);
      return;
    }
    setResult(response);
    if (response.ok) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      {/* ── Lo básico ─────────────────────────────────────────────── */}
      <section className="flex flex-col gap-5 rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="font-display text-xl font-semibold text-tinta">
          Lo básico
        </h2>
        <Input
          label="Nombre del producto"
          placeholder="Ej. Clásica de Miel"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Enlace (slug)"
          hint="Es la parte final de la dirección web: naturelly.com/producto/…"
          error={errors.slug?.message}
          {...register("slug", { onChange: () => setSlugEdited(true) })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-category" className="font-bold text-tinta">
              Categoría
            </label>
            <select
              id="product-category"
              className={inputClass}
              {...register("category")}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm font-bold text-terracota">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-badge" className="font-bold text-tinta">
              Etiqueta (opcional)
            </label>
            <select id="product-badge" className={inputClass} {...register("badge")}>
              <option value="">Sin etiqueta</option>
              <option value="nuevo">Nuevo</option>
              <option value="mas_vendido">Más vendido</option>
              <option value="edicion_limitada">Edición limitada</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 font-bold text-tinta">
          <input
            type="checkbox"
            className="size-5 accent-[#E6A12D]"
            {...register("is_active")}
          />
          Visible en la tienda
        </label>
      </section>

      {/* ── Textos ────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-5 rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="font-display text-xl font-semibold text-tinta">
          Textos
        </h2>
        <Input
          label="Frase corta (aparece en la tarjeta)"
          placeholder="Ej. La receta de siempre, dorada y crocante"
          error={errors.tagline?.message}
          {...register("tagline")}
        />
        <Textarea
          label="Descripción"
          placeholder="¿Qué hace especial a esta granola?"
          error={errors.description?.message}
          {...register("description")}
        />
        <Textarea
          label="Su historia (aparece en la página del producto)"
          placeholder="Cuenta de dónde viene, cómo nació la receta…"
          error={errors.story?.message}
          {...register("story")}
        />
        <Textarea
          label="Ingredientes (uno por línea)"
          placeholder={"Avena\nMiel de abeja\nQuinua"}
          error={errors.ingredientsText?.message}
          {...register("ingredientsText")}
        />
        <Textarea
          label="Beneficios (uno por línea)"
          placeholder={"Endulzada solo con miel\nTostada a mano"}
          error={errors.benefitsText?.message}
          {...register("benefitsText")}
        />
      </section>

      {/* ── Presentaciones y precios ──────────────────────────────── */}
      <section className="flex flex-col gap-5 rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="font-display text-xl font-semibold text-tinta">
          Presentaciones y precios
        </h2>
        {typeof errors.variants?.message === "string" && (
          <p className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota">
            {errors.variants.message}
          </p>
        )}
        {errors.variants?.root?.message && (
          <p className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota">
            {errors.variants.root.message}
          </p>
        )}

        {fields.map((field, index) => {
          const isSaved = Boolean(watch(`variants.${index}.id`));
          const variantErrors = errors.variants?.[index];
          return (
            <div
              key={field.fieldKey}
              className="flex flex-col gap-4 rounded-2xl bg-crema p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-tinta">
                  Presentación {index + 1}
                </p>
                {!isSaved && fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-terracota hover:bg-terracota/10"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Quitar
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Presentación"
                  placeholder="Ej. 250 g"
                  error={variantErrors?.size_label?.message}
                  {...register(`variants.${index}.size_label`)}
                />
                <Input
                  label="Peso en gramos"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  error={variantErrors?.weight_grams?.message}
                  {...register(`variants.${index}.weight_grams`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  label="Precio (S/)"
                  type="number"
                  inputMode="decimal"
                  step="0.10"
                  min={0}
                  error={variantErrors?.price?.message}
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  label="Precio anterior tachado (opcional)"
                  type="number"
                  inputMode="decimal"
                  step="0.10"
                  min={0}
                  hint="Para ofertas: se muestra tachado junto al precio"
                  error={variantErrors?.compare_at_price?.message}
                  {...register(`variants.${index}.compare_at_price`, {
                    setValueAs: (value) =>
                      value === "" || value === null ? null : Number(value),
                  })}
                />
                <Input
                  label="Stock disponible"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  error={variantErrors?.stock?.message}
                  {...register(`variants.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  label="SKU (código único)"
                  placeholder="Ej. NAT-CLA-250"
                  error={variantErrors?.sku?.message}
                  {...register(`variants.${index}.sku`)}
                />
              </div>
              <label className="flex items-center gap-3 font-bold text-tinta">
                <input
                  type="checkbox"
                  className="size-5 accent-[#E6A12D]"
                  {...register(`variants.${index}.is_active`)}
                />
                Presentación activa (se puede comprar)
              </label>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => append(EMPTY_VARIANT)}
          className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-tinta px-5 py-2.5 font-bold text-tinta hover:bg-tinta hover:text-amarillo"
        >
          <Plus className="size-4" aria-hidden />
          Agregar presentación
        </button>
      </section>

      {result && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 font-bold ${
            result.ok
              ? "bg-salvia/15 text-salvia-oscura"
              : "bg-terracota/10 text-terracota"
          }`}
        >
          {result.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Guardando…
          </>
        ) : isEdit ? (
          "Guardar cambios"
        ) : (
          "Crear producto"
        )}
      </Button>
    </form>
  );
}
