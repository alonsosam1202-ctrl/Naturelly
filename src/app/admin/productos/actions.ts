"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/supabase/require-admin";
import { productFormSchema, splitLines } from "@/lib/validations/product";

export type ActionResult = {
  ok: boolean;
  message: string;
  productId?: string;
};

const NO_PERMISSION: ActionResult = {
  ok: false,
  message: "No tienes permisos para hacer esto. Vuelve a iniciar sesión.",
};

/** Revalida las páginas públicas y del admin afectadas por el catálogo. */
function revalidateCatalog(slug?: string, previousSlug?: string) {
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath("/packs");
  if (slug) revalidatePath(`/producto/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/producto/${previousSlug}`);
  }
}

function mapDbError(message: string): string {
  if (message.includes("products_slug_key")) {
    return "Ya existe un producto con ese enlace (slug). Cambia el enlace.";
  }
  if (message.includes("product_variants_sku_key")) {
    return "Uno de los SKU ya está en uso por otro producto.";
  }
  return "No se pudo guardar. Inténtalo de nuevo en un momento.";
}

/**
 * Crea o actualiza un producto con sus variantes.
 * - Verifica sesión + rol admin (y RLS vuelve a verificar en la BD).
 * - Unicidad de slug y SKU verificada antes de escribir (los constraints
 *   de BD quedan como red final).
 * - Si al CREAR fallan las variantes, se elimina el producto recién creado
 *   (compensación) para no dejar productos a medias.
 * - Las variantes existentes nunca se borran (tienen historial de pedidos):
 *   se desactivan con is_active.
 */
export async function saveProduct(input: unknown): Promise<ActionResult> {
  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Revisa los datos del formulario." };
  }

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const data = parsed.data;
  const isCreate = !data.id;

  // ── Unicidad de slug ────────────────────────────────────────────────────
  let slugQuery = supabase.from("products").select("id").eq("slug", data.slug);
  if (data.id) slugQuery = slugQuery.neq("id", data.id);
  const { data: slugRows } = await slugQuery;
  if ((slugRows ?? []).length > 0) {
    return {
      ok: false,
      message: "Ya existe un producto con ese enlace (slug). Cambia el enlace.",
    };
  }

  // ── Unicidad de SKU (global, excluyendo las variantes propias) ─────────
  const ownVariantIds = data.variants
    .map((v) => v.id)
    .filter((id): id is string => Boolean(id));
  const { data: skuRows } = await supabase
    .from("product_variants")
    .select("id, sku")
    .in("sku", data.variants.map((v) => v.sku));
  const skuConflict = (skuRows ?? []).find(
    (row) => !ownVariantIds.includes(row.id)
  );
  if (skuConflict) {
    return {
      ok: false,
      message: `El SKU "${skuConflict.sku}" ya está en uso por otro producto.`,
    };
  }

  const productFields = {
    name: data.name,
    slug: data.slug,
    category: data.category,
    badge: data.badge === "" ? null : data.badge,
    tagline: data.tagline || null,
    description: data.description || null,
    story: data.story || null,
    ingredients: splitLines(data.ingredientsText),
    benefits: splitLines(data.benefitsText),
    allergens: splitLines(data.allergensText),
    is_quote_only: data.is_quote_only,
    is_active: data.is_active,
  };

  let productId = data.id ?? "";
  let previousSlug: string | undefined;

  if (isCreate) {
    // Nuevos productos al final del catálogo
    const { data: maxRow } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (maxRow?.sort_order ?? 0) + 1;

    const { data: created, error: createError } = await supabase
      .from("products")
      .insert({ ...productFields, sort_order: sortOrder })
      .select("id")
      .single();
    if (createError || !created) {
      console.error("crear producto falló:", createError?.message);
      return { ok: false, message: mapDbError(createError?.message ?? "") };
    }
    productId = created.id;

    // Los solo-cotización no llevan variantes: no hay nada que insertar
    const { error: variantsError } = data.variants.length === 0
      ? { error: null }
      : await supabase
      .from("product_variants")
      .insert(
        data.variants.map((v) => ({
          product_id: productId,
          size_label: v.size_label,
          weight_grams: v.weight_grams,
          price: v.price,
          compare_at_price: v.compare_at_price,
          stock: v.stock,
          sku: v.sku,
          is_active: v.is_active,
        }))
      );
    if (variantsError) {
      // Compensación: el producto recién creado no tiene pedidos, se elimina
      await supabase.from("products").delete().eq("id", productId);
      console.error("crear variantes falló:", variantsError.message);
      return { ok: false, message: mapDbError(variantsError.message) };
    }
  } else {
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .eq("id", productId)
      .maybeSingle();
    if (!existing) {
      return { ok: false, message: "No encontramos el producto." };
    }
    previousSlug = existing.slug;

    const { error: updateError } = await supabase
      .from("products")
      .update(productFields)
      .eq("id", productId);
    if (updateError) {
      console.error("actualizar producto falló:", updateError.message);
      return { ok: false, message: mapDbError(updateError.message) };
    }

    for (const variant of data.variants) {
      const fields = {
        size_label: variant.size_label,
        weight_grams: variant.weight_grams,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        stock: variant.stock,
        sku: variant.sku,
        is_active: variant.is_active,
      };
      const { error: variantError } = variant.id
        ? await supabase
            .from("product_variants")
            .update(fields)
            .eq("id", variant.id)
            .eq("product_id", productId)
        : await supabase
            .from("product_variants")
            .insert({ ...fields, product_id: productId });
      if (variantError) {
        console.error("guardar variante falló:", variantError.message);
        return { ok: false, message: mapDbError(variantError.message) };
      }
    }
  }

  revalidateCatalog(data.slug, previousSlug);
  return {
    ok: true,
    message: isCreate
      ? "¡Producto creado! Ahora agrega sus fotos."
      : "Cambios guardados.",
    productId,
  };
}

const toggleSchema = z.object({
  productId: z.string().uuid(),
  isActive: z.boolean(),
});

/** Activa o desactiva (soft delete) un producto. Nunca se borra de la BD. */
export async function toggleProductActive(
  input: unknown
): Promise<ActionResult> {
  const parsed = toggleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  if (parsed.data.isActive) {
    // Comportamiento documentado: no activar sin presentaciones activas.
    // Excepción: los solo-cotización no llevan presentaciones.
    const { data: product } = await supabase
      .from("products")
      .select("is_quote_only")
      .eq("id", parsed.data.productId)
      .maybeSingle();
    if (!product?.is_quote_only) {
      const { data: activeVariant } = await supabase
        .from("product_variants")
        .select("id")
        .eq("product_id", parsed.data.productId)
        .eq("is_active", true)
        .not("price", "is", null)
        .limit(1)
        .maybeSingle();
      if (!activeVariant) {
        return {
          ok: false,
          message:
            "Este producto no tiene presentaciones activas con precio. Ponle precio y activa al menos una antes de mostrarlo en la tienda.",
        };
      }
    }
  }

  const { data: updated, error } = await supabase
    .from("products")
    .update({ is_active: parsed.data.isActive })
    .eq("id", parsed.data.productId)
    .select("slug")
    .maybeSingle();
  if (error || !updated) {
    console.error("toggle producto falló:", error?.message);
    return { ok: false, message: "No se pudo actualizar el producto." };
  }

  revalidateCatalog(updated.slug);
  return {
    ok: true,
    message: parsed.data.isActive
      ? "El producto ya está visible en la tienda."
      : "Producto desactivado: ya no se muestra en la tienda (no se borró nada).",
  };
}

// ── Imágenes ────────────────────────────────────────────────────────────────

const BUCKET = "product-images";

/** Extrae la ruta interna del bucket desde la URL pública. */
function pathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

const addImageSchema = z.object({
  productId: z.string().uuid(),
  url: z.string().url(),
  alt: z
    .string()
    .trim()
    .min(3, "Describe la imagen (mínimo 3 caracteres) para accesibilidad"),
});

/**
 * Registra en BD una imagen YA subida al bucket por el navegador (la subida
 * la autoriza la política RLS de Storage: solo admin).
 */
export async function addProductImage(input: unknown): Promise<ActionResult> {
  const parsed = addImageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  // Sanidad: la URL debe apuntar a nuestro bucket y a la carpeta del producto
  const path = pathFromUrl(parsed.data.url);
  if (!path || !path.startsWith(`${parsed.data.productId}/`)) {
    return { ok: false, message: "La imagen no pertenece a este producto." };
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", parsed.data.productId);

  const { error } = await supabase.from("product_images").insert({
    product_id: parsed.data.productId,
    url: parsed.data.url,
    alt: parsed.data.alt,
    position: count ?? 0,
  });
  if (error) {
    console.error("registrar imagen falló:", error.message);
    return { ok: false, message: "No se pudo guardar la imagen." };
  }

  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", parsed.data.productId)
    .maybeSingle();
  revalidateCatalog(product?.slug);
  return { ok: true, message: "Foto agregada." };
}

const imageIdSchema = z.object({ imageId: z.string().uuid() });

/**
 * Elimina una imagen: PRIMERO la fila en BD y, solo tras confirmarse,
 * el archivo del bucket (si el archivo quedara huérfano por un fallo de
 * Storage, no afecta a la web y se limpia a mano).
 */
export async function deleteProductImage(
  input: unknown
): Promise<ActionResult> {
  const parsed = imageIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const { data: image } = await supabase
    .from("product_images")
    .select("id, url, product_id, products(slug)")
    .eq("id", parsed.data.imageId)
    .maybeSingle();
  if (!image) return { ok: false, message: "No encontramos la imagen." };

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", image.id);
  if (error) {
    console.error("eliminar imagen falló:", error.message);
    return { ok: false, message: "No se pudo eliminar la imagen." };
  }

  // BD confirmada: recién ahora se toca Storage
  const path = pathFromUrl(image.url);
  if (path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([path]);
    if (storageError) {
      console.error("limpiar storage falló (archivo huérfano):", storageError.message);
    }
  }

  revalidateCatalog(image.products?.slug ?? undefined);
  return { ok: true, message: "Foto eliminada." };
}

const replaceImageSchema = z.object({
  imageId: z.string().uuid(),
  newUrl: z.string().url(),
});

/**
 * Reemplaza el archivo de una imagen existente (mismo alt y posición).
 * El archivo anterior se borra del bucket solo después de actualizar la BD.
 */
export async function replaceProductImage(
  input: unknown
): Promise<ActionResult> {
  const parsed = replaceImageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const { data: image } = await supabase
    .from("product_images")
    .select("id, url, product_id, products(slug)")
    .eq("id", parsed.data.imageId)
    .maybeSingle();
  if (!image) return { ok: false, message: "No encontramos la imagen." };

  const newPath = pathFromUrl(parsed.data.newUrl);
  if (!newPath || !newPath.startsWith(`${image.product_id}/`)) {
    return { ok: false, message: "La imagen no pertenece a este producto." };
  }

  const { error } = await supabase
    .from("product_images")
    .update({ url: parsed.data.newUrl })
    .eq("id", image.id);
  if (error) {
    console.error("reemplazar imagen falló:", error.message);
    return { ok: false, message: "No se pudo reemplazar la imagen." };
  }

  const oldPath = pathFromUrl(image.url);
  if (oldPath && oldPath !== newPath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([oldPath]);
    if (storageError) {
      console.error("limpiar storage falló (archivo huérfano):", storageError.message);
    }
  }

  revalidateCatalog(image.products?.slug ?? undefined);
  return { ok: true, message: "Foto reemplazada." };
}

const altSchema = z.object({
  imageId: z.string().uuid(),
  alt: z
    .string()
    .trim()
    .min(3, "Describe la imagen (mínimo 3 caracteres) para accesibilidad"),
});

export async function updateImageAlt(input: unknown): Promise<ActionResult> {
  const parsed = altSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  const { data: updated, error } = await supabase
    .from("product_images")
    .update({ alt: parsed.data.alt })
    .eq("id", parsed.data.imageId)
    .select("products(slug)")
    .maybeSingle();
  if (error || !updated) {
    return { ok: false, message: "No se pudo guardar la descripción." };
  }

  revalidateCatalog(updated.products?.slug ?? undefined);
  return { ok: true, message: "Descripción guardada." };
}

const reorderSchema = z.object({
  productId: z.string().uuid(),
  imageIds: z.array(z.string().uuid()).min(1),
});

export async function reorderImages(input: unknown): Promise<ActionResult> {
  const parsed = reorderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };

  const session = await getAdminSession();
  if (!session) return NO_PERMISSION;
  const { supabase } = session;

  for (let index = 0; index < parsed.data.imageIds.length; index++) {
    const { error } = await supabase
      .from("product_images")
      .update({ position: index })
      .eq("id", parsed.data.imageIds[index])
      .eq("product_id", parsed.data.productId);
    if (error) {
      console.error("reordenar imágenes falló:", error.message);
      return { ok: false, message: "No se pudo cambiar el orden." };
    }
  }

  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", parsed.data.productId)
    .maybeSingle();
  revalidateCatalog(product?.slug);
  return { ok: true, message: "Orden actualizado." };
}
