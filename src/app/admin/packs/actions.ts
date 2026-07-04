"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/supabase/require-admin";
import { bundleFormSchema } from "@/lib/validations/bundle";

export type ActionResult = {
  ok: boolean;
  message: string;
  bundleId?: string;
};

const NO_PERMISSION: ActionResult = {
  ok: false,
  message: "No tienes permisos para hacer esto. Vuelve a iniciar sesión.",
};

const BUCKET = "product-images"; // según DATABASE_SCHEMA.md guarda fotos de productos Y bundles

function revalidatePacks() {
  revalidatePath("/admin/packs");
  revalidatePath("/packs");
}

function mapDbError(message: string): string {
  if (message.includes("bundles_slug_key")) {
    return "Ya existe un pack con ese enlace (slug). Cambia el enlace.";
  }
  return "No se pudo guardar. Inténtalo de nuevo en un momento.";
}

/**
 * Crea o actualiza un pack con sus productos.
 * - Verifica sesión + rol admin (RLS re-verifica en BD).
 * - Slug único; variantes existentes verificadas contra la BD.
 * - Un pack ACTIVO exige al menos una variante activa (comportamiento
 *   documentado en DATABASE_SCHEMA.md).
 * - Los ítems se REEMPLAZAN al guardar: los pedidos históricos no se ven
 *   afectados porque order_items referencia bundle_id y guarda snapshot de
 *   nombre y precio.
 */
export async function saveBundle(input: unknown): Promise<ActionResult> {
  const parsed = bundleFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Revisa los datos del formulario." };
  }

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const data = parsed.data;
  const isCreate = !data.id;

  // Unicidad de slug
  let slugQuery = supabase.from("bundles").select("id").eq("slug", data.slug);
  if (data.id) slugQuery = slugQuery.neq("id", data.id);
  const { data: slugRows } = await slugQuery;
  if ((slugRows ?? []).length > 0) {
    return {
      ok: false,
      message: "Ya existe un pack con ese enlace (slug). Cambia el enlace.",
    };
  }

  // Las variantes deben existir; y un pack activo necesita >= 1 activa
  const variantIds = data.items.map((item) => item.variantId);
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, is_active, products(is_active)")
    .in("id", variantIds);
  const found = variants ?? [];
  if (found.length !== variantIds.length) {
    return {
      ok: false,
      message: "Uno de los productos seleccionados ya no existe. Recarga la página.",
    };
  }
  const hasActiveComponent = found.some(
    (v) => v.is_active && v.products?.is_active
  );
  if (data.is_active && !hasActiveComponent) {
    return {
      ok: false,
      message:
        "Un pack activo necesita al menos un producto activo. Activa un producto o guarda el pack como desactivado.",
    };
  }

  const bundleFields = {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    price: data.price,
    is_active: data.is_active,
  };

  let bundleId = data.id ?? "";

  if (isCreate) {
    const { data: created, error: createError } = await supabase
      .from("bundles")
      .insert(bundleFields)
      .select("id")
      .single();
    if (createError || !created) {
      console.error("crear pack falló:", createError?.message);
      return { ok: false, message: mapDbError(createError?.message ?? "") };
    }
    bundleId = created.id;

    const { error: itemsError } = await supabase.from("bundle_items").insert(
      data.items.map((item) => ({
        bundle_id: bundleId,
        variant_id: item.variantId,
        quantity: item.quantity,
      }))
    );
    if (itemsError) {
      // Compensación: pack recién creado sin pedidos, se elimina
      await supabase.from("bundles").delete().eq("id", bundleId);
      console.error("crear items del pack falló:", itemsError.message);
      return { ok: false, message: mapDbError(itemsError.message) };
    }
  } else {
    const { data: existing } = await supabase
      .from("bundles")
      .select("id")
      .eq("id", bundleId)
      .maybeSingle();
    if (!existing) {
      return { ok: false, message: "No encontramos el pack." };
    }

    const { error: updateError } = await supabase
      .from("bundles")
      .update(bundleFields)
      .eq("id", bundleId);
    if (updateError) {
      console.error("actualizar pack falló:", updateError.message);
      return { ok: false, message: mapDbError(updateError.message) };
    }

    // Reemplazo de ítems con restauración si falla el insert
    const { data: oldItems } = await supabase
      .from("bundle_items")
      .select("variant_id, quantity")
      .eq("bundle_id", bundleId);

    const { error: deleteError } = await supabase
      .from("bundle_items")
      .delete()
      .eq("bundle_id", bundleId);
    if (deleteError) {
      console.error("limpiar items del pack falló:", deleteError.message);
      return { ok: false, message: "No se pudo guardar. Inténtalo de nuevo." };
    }

    const { error: insertError } = await supabase.from("bundle_items").insert(
      data.items.map((item) => ({
        bundle_id: bundleId,
        variant_id: item.variantId,
        quantity: item.quantity,
      }))
    );
    if (insertError) {
      // Restauración (mejor esfuerzo) de la composición anterior
      if (oldItems && oldItems.length > 0) {
        await supabase.from("bundle_items").insert(
          oldItems.map((item) => ({
            bundle_id: bundleId,
            variant_id: item.variant_id,
            quantity: item.quantity,
          }))
        );
      }
      console.error("guardar items del pack falló:", insertError.message);
      return { ok: false, message: mapDbError(insertError.message) };
    }
  }

  revalidatePacks();
  return {
    ok: true,
    message: isCreate ? "¡Pack creado!" : "Cambios guardados.",
    bundleId,
  };
}

const toggleSchema = z.object({
  bundleId: z.string().uuid(),
  isActive: z.boolean(),
});

/** Activa o desactiva (soft delete) un pack. Nunca se borra de la BD. */
export async function toggleBundleActive(
  input: unknown
): Promise<ActionResult> {
  const parsed = toggleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  if (parsed.data.isActive) {
    // No activar un pack compuesto solo por variantes/productos inactivos
    const { data: items } = await supabase
      .from("bundle_items")
      .select("product_variants(is_active, products(is_active))")
      .eq("bundle_id", parsed.data.bundleId);
    const hasActiveComponent = (items ?? []).some(
      (item) =>
        item.product_variants?.is_active &&
        item.product_variants?.products?.is_active
    );
    if (!hasActiveComponent) {
      return {
        ok: false,
        message:
          "Este pack no tiene productos activos. Activa al menos uno antes de mostrarlo en la tienda.",
      };
    }
  }

  const { data: updated, error } = await supabase
    .from("bundles")
    .update({ is_active: parsed.data.isActive })
    .eq("id", parsed.data.bundleId)
    .select("id")
    .maybeSingle();
  if (error || !updated) {
    console.error("toggle pack falló:", error?.message);
    return { ok: false, message: "No se pudo actualizar el pack." };
  }

  revalidatePacks();
  return {
    ok: true,
    message: parsed.data.isActive
      ? "El pack ya está visible en la tienda."
      : "Pack desactivado: ya no se muestra en la tienda (no se borró nada).",
  };
}

// ── Imagen del pack (una sola: bundles.image_url) ─────────────────────────

function pathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

const setImageSchema = z.object({
  bundleId: z.string().uuid(),
  url: z.string().url(),
});

/**
 * Guarda la imagen del pack (ya subida al bucket por el navegador con la
 * sesión del admin). El archivo anterior se borra solo tras confirmar la BD.
 */
export async function setBundleImage(input: unknown): Promise<ActionResult> {
  const parsed = setImageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const newPath = pathFromUrl(parsed.data.url);
  if (!newPath || !newPath.startsWith(`bundles/${parsed.data.bundleId}/`)) {
    return { ok: false, message: "La imagen no pertenece a este pack." };
  }

  const { data: bundle } = await supabase
    .from("bundles")
    .select("image_url")
    .eq("id", parsed.data.bundleId)
    .maybeSingle();
  if (!bundle) return { ok: false, message: "No encontramos el pack." };

  const { error } = await supabase
    .from("bundles")
    .update({ image_url: parsed.data.url })
    .eq("id", parsed.data.bundleId);
  if (error) {
    console.error("guardar imagen del pack falló:", error.message);
    return { ok: false, message: "No se pudo guardar la imagen." };
  }

  // BD confirmada: recién ahora se limpia el archivo anterior
  const oldPath = bundle.image_url ? pathFromUrl(bundle.image_url) : null;
  if (oldPath && oldPath !== newPath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([oldPath]);
    if (storageError) {
      console.error("limpiar storage falló (archivo huérfano):", storageError.message);
    }
  }

  revalidatePacks();
  return { ok: true, message: "Foto del pack guardada." };
}

const removeImageSchema = z.object({ bundleId: z.string().uuid() });

export async function removeBundleImage(
  input: unknown
): Promise<ActionResult> {
  const parsed = removeImageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const { data: bundle } = await supabase
    .from("bundles")
    .select("image_url")
    .eq("id", parsed.data.bundleId)
    .maybeSingle();
  if (!bundle) return { ok: false, message: "No encontramos el pack." };
  if (!bundle.image_url) return { ok: true, message: "El pack no tiene foto." };

  const { error } = await supabase
    .from("bundles")
    .update({ image_url: null })
    .eq("id", parsed.data.bundleId);
  if (error) {
    console.error("quitar imagen del pack falló:", error.message);
    return { ok: false, message: "No se pudo quitar la imagen." };
  }

  const path = pathFromUrl(bundle.image_url);
  if (path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([path]);
    if (storageError) {
      console.error("limpiar storage falló (archivo huérfano):", storageError.message);
    }
  }

  revalidatePacks();
  return {
    ok: true,
    message: "Foto quitada: la tienda mostrará la ilustración de la marca.",
  };
}
