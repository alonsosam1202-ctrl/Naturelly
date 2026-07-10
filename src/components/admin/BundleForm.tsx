"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  bundleFormSchema,
  type BundleFormValues,
  type VariantOption,
} from "@/lib/validations/bundle";
import { saveBundle } from "@/app/admin/packs/actions";
import { formatPrice, slugify } from "@/lib/utils";

type BundleFormProps = {
  /** Sin `initial` = crear; con `initial` = editar. */
  initial?: BundleFormValues;
  /** Catálogo de variantes cargado en SERVIDOR (precios/stock confiables). */
  variantOptions: VariantOption[];
};

const inputClass =
  "rounded-2xl border-2 border-amarillo-suave bg-blanco-crema px-4 py-3 text-tinta focus:border-miel focus:outline-none";

export default function BundleForm({ initial, variantOptions }: BundleFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  const optionsById = useMemo(() => {
    const map = new Map<string, VariantOption>();
    variantOptions.forEach((option) => map.set(option.variantId, option));
    return map;
  }, [variantOptions]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BundleFormValues>({
    resolver: zodResolver(bundleFormSchema),
    defaultValues: initial ?? {
      name: "",
      slug: "",
      description: "",
      price: 0,
      is_active: true,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "fieldKey",
  });

  const nameValue = watch("name");
  useEffect(() => {
    if (!slugEdited) {
      setValue("slug", slugify(nameValue ?? ""));
    }
  }, [nameValue, slugEdited, setValue]);

  const watchedItems = watch("items");
  const watchedPrice = watch("price");

  // ── Resumen informativo (el precio real SIEMPRE lo valida el servidor) ──
  const summary = useMemo(() => {
    let sumCents = 0;
    let availability: number | null = null;
    for (const item of watchedItems ?? []) {
      const option = optionsById.get(item.variantId);
      const quantity = Number(item.quantity) || 0;
      if (!option || quantity < 1) continue;
      sumCents += Math.round(option.price * 100) * quantity;
      const itemAvailability = Math.floor(option.stock / quantity);
      availability =
        availability === null
          ? itemAvailability
          : Math.min(availability, itemAvailability);
    }
    const sum = sumCents / 100;
    const price = Number(watchedPrice) || 0;
    return {
      sum,
      saving: sum - price,
      availability: availability ?? 0,
    };
  }, [watchedItems, watchedPrice, optionsById]);

  const availableOptions = variantOptions.filter(
    (option) =>
      !(watchedItems ?? []).some((item) => item.variantId === option.variantId)
  );

  function handleAddVariant() {
    if (!selectedVariantId) return;
    append({ variantId: selectedVariantId, quantity: 1 });
    setSelectedVariantId("");
  }

  async function onSubmit(values: BundleFormValues) {
    setResult(null);
    const response = await saveBundle(values);
    if (response.ok && !isEdit && response.bundleId) {
      router.push(`/admin/packs/${response.bundleId}/editar?creado=1`);
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
          label="Nombre del pack"
          placeholder="Ej. Pack Trío Naturelly"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Enlace (slug)"
          hint="Identificador único del pack en la web."
          error={errors.slug?.message}
          {...register("slug", { onChange: () => setSlugEdited(true) })}
        />
        <Textarea
          label="Descripción"
          placeholder="¿Qué incluye y por qué conviene este pack?"
          error={errors.description?.message}
          {...register("description")}
        />
        <Input
          label="Precio del pack (S/)"
          type="number"
          inputMode="decimal"
          step="0.10"
          min={0}
          hint="El precio es fijo, definido por ti: ahí está el descuento del pack."
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        <label className="flex items-center gap-3 font-bold text-tinta">
          <input
            type="checkbox"
            className="size-5 accent-oro"
            {...register("is_active")}
          />
          Visible en la tienda
        </label>
      </section>

      {/* ── Productos del pack ────────────────────────────────────── */}
      <section className="flex flex-col gap-5 rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="font-display text-xl font-semibold text-tinta">
          Productos del pack
        </h2>

        {typeof errors.items?.message === "string" && (
          <p className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota">
            {errors.items.message}
          </p>
        )}
        {errors.items?.root?.message && (
          <p className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota">
            {errors.items.root.message}
          </p>
        )}

        {fields.length === 0 && (
          <p className="rounded-2xl bg-crema px-4 py-3 text-cacao">
            Aún no agregaste productos. Elige uno abajo y presiona
            &quot;Agregar al pack&quot;.
          </p>
        )}

        <ul className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const option = optionsById.get(watch(`items.${index}.variantId`));
            const itemErrors = errors.items?.[index];
            return (
              <li
                key={field.fieldKey}
                className="flex flex-col gap-3 rounded-2xl bg-crema p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-tinta">
                      {option
                        ? `${option.productName} · ${option.sizeLabel}`
                        : "Producto no disponible"}
                    </p>
                    {option && (
                      <p className="text-sm text-cacao">
                        SKU {option.sku} · {formatPrice(option.price)} · Stock:{" "}
                        {option.stock}
                      </p>
                    )}
                    {option && !option.isActive && (
                      <p className="mt-1 text-sm font-bold text-terracota">
                        ⚠ Este producto está desactivado: no se muestra solo en
                        la tienda, pero el pack sí podría venderlo.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-terracota hover:bg-terracota/10"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Quitar
                  </button>
                </div>
                <div className="max-w-40">
                  <Input
                    label="Cantidad en el pack"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    error={itemErrors?.quantity?.message}
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                {itemErrors?.variantId?.message && (
                  <p className="text-sm font-bold text-terracota">
                    {itemErrors.variantId.message}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-amarillo-suave p-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="variant-picker" className="font-bold text-tinta">
              Agregar producto
            </label>
            <select
              id="variant-picker"
              className={inputClass}
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
            >
              <option value="">Elige una presentación…</option>
              {availableOptions.map((option) => (
                <option key={option.variantId} value={option.variantId}>
                  {option.label}
                  {option.isActive ? "" : " (desactivado)"}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            disabled={!selectedVariantId}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-tinta px-5 py-3 font-bold text-tinta hover:bg-tinta hover:text-amarillo disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden />
            Agregar al pack
          </button>
        </div>
      </section>

      {/* ── Resumen informativo ───────────────────────────────────── */}
      <section className="flex flex-col gap-2 rounded-3xl bg-amarillo/30 p-6">
        <h2 className="font-display text-xl font-semibold text-tinta">
          Resumen para el cliente
        </h2>
        <p className="flex justify-between text-tinta">
          <span>Suma de precios individuales</span>
          <span className="font-bold">{formatPrice(summary.sum)}</span>
        </p>
        <p className="flex justify-between text-tinta">
          <span>Precio del pack</span>
          <span className="font-bold">
            {formatPrice(Number(watchedPrice) || 0)}
          </span>
        </p>
        <p className="flex justify-between font-bold text-tinta">
          <span>Ahorro estimado del cliente</span>
          <span className={summary.saving > 0 ? "text-salvia-oscura" : "text-terracota"}>
            {formatPrice(summary.saving)}
          </span>
        </p>
        <p className="flex justify-between text-tinta">
          <span>Disponibilidad estimada (según stock actual)</span>
          <span className="font-bold">{summary.availability} packs</span>
        </p>
        <p className="text-sm text-cacao">
          Estos números son referenciales: al comprar, el servidor vuelve a
          validar precio y stock.
        </p>
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
          "Crear pack"
        )}
      </Button>
    </form>
  );
}
