"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/validations/order";
import { DELIVERY_DISTRICTS } from "@/lib/constants";
import { useCartStore } from "@/stores/cart";

type CheckoutFormProps = {
  /** Prefill desde el perfil del cliente logueado (editable por pedido). */
  defaultName?: string;
  defaultPhone?: string;
};

export default function CheckoutForm({
  defaultName = "",
  defaultPhone = "",
}: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryMethod: "delivery",
      customerName: defaultName,
      customerPhone: defaultPhone,
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitError(null);

    // Regla de oro: el pedido se registra en la BD ANTES de ir a WhatsApp.
    // El carrito solo envía ids + cantidades; el servidor recalcula precios.
    const response = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        items: items.map((item) =>
          item.kind === "variant"
            ? { variantId: item.id, quantity: item.quantity }
            : { bundleId: item.id, quantity: item.quantity }
        ),
      }),
    });

    const data: { codigo?: string; error?: string } = await response
      .json()
      .catch(() => ({}));

    if (!response.ok || !data.codigo) {
      setSubmitError(
        data.error ??
          "No pudimos registrar tu pedido. Inténtalo de nuevo en un momento."
      );
      return;
    }

    clearCart();
    router.push(`/pedido/${data.codigo}/confirmado`);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Aviso de entrega VISIBLE antes de llenar nada (hallazgo C1 de la
          auditoría): que nadie complete el pedido creyendo que llega hoy */}
      <p className="rounded-2xl border border-oro/40 bg-oro/10 px-4 py-3 text-sm text-tinta">
        <strong>Entrega a partir de mañana:</strong> tus delicias se preparan
        por encargo, así que la entrega o el recojo se coordinan por WhatsApp
        para el día siguiente en adelante. El costo del delivery va aparte.
      </p>

      <Input
        label="Tu nombre"
        placeholder="¿Cómo te llamas?"
        autoComplete="name"
        error={errors.customerName?.message}
        {...register("customerName")}
      />
      <Input
        label="Tu celular"
        type="tel"
        inputMode="numeric"
        placeholder="9XXXXXXXX"
        autoComplete="tel"
        hint="Al terminar, TÚ envías tu pedido por WhatsApp desde este número — así se confirma."
        error={errors.customerPhone?.message}
        {...register("customerPhone")}
      />

      <fieldset>
        <legend className="mb-2 font-bold text-tinta">
          ¿Cómo quieres recibir tu pedido?
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-colors ${
              deliveryMethod === "delivery"
                ? "border-miel bg-blanco-crema"
                : "border-amarillo-suave bg-blanco-crema/60"
            }`}
          >
            <input
              type="radio"
              value="delivery"
              className="mr-2 accent-oro"
              {...register("deliveryMethod")}
            />
            <span className="font-bold text-tinta">Delivery</span>
            <p className="mt-1 text-sm text-cacao">
              Te lo llevamos en Arequipa.
            </p>
          </label>
          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-colors ${
              deliveryMethod === "recojo"
                ? "border-miel bg-blanco-crema"
                : "border-amarillo-suave bg-blanco-crema/60"
            }`}
          >
            <input
              type="radio"
              value="recojo"
              className="mr-2 accent-oro"
              {...register("deliveryMethod")}
            />
            <span className="font-bold text-tinta">Recojo</span>
            <p className="mt-1 text-sm text-cacao">
              Coordinamos el punto de recojo por WhatsApp.
            </p>
          </label>
        </div>
      </fieldset>

      {deliveryMethod === "delivery" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-district" className="font-bold text-tinta">
              Distrito
            </label>
            <select
              id="checkout-district"
              className={`rounded-2xl border-2 bg-blanco-crema px-4 py-3 text-tinta focus:border-miel focus:outline-none ${
                errors.deliveryDistrict
                  ? "border-terracota"
                  : "border-amarillo-suave"
              }`}
              defaultValue=""
              {...register("deliveryDistrict")}
            >
              <option value="" disabled>
                Elige tu distrito
              </option>
              {DELIVERY_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.deliveryDistrict && (
              <p className="text-sm font-bold text-terracota">
                {errors.deliveryDistrict.message}
              </p>
            )}
          </div>
          <Input
            label="Dirección de entrega"
            placeholder="Calle, número y una referencia"
            autoComplete="street-address"
            error={errors.deliveryAddress?.message}
            {...register("deliveryAddress")}
          />
        </>
      )}

      <Textarea
        label="Notas para tu pedido (opcional)"
        placeholder="Ej. dedicatoria para la torta, sin pasas, una referencia de tu dirección…"
        error={errors.notes?.message}
        {...register("notes")}
      />

      {submitError && (
        <p
          role="alert"
          className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota"
        >
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting || items.length === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Registrando tu pedido…
          </>
        ) : (
          "Confirmar pedido"
        )}
      </Button>
      <p className="text-sm text-cacao">
        Al confirmar, tu pedido queda registrado y te llevamos a WhatsApp para
        coordinar la entrega y el pago con Nelly.
      </p>
    </form>
  );
}
