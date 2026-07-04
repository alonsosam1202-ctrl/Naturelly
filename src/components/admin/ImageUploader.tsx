"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  addProductImage,
  deleteProductImage,
  replaceProductImage,
  reorderImages,
  updateImageAlt,
  type ActionResult,
} from "@/app/admin/productos/actions";

type ProductImageRow = {
  id: string;
  url: string;
  alt: string;
  position: number;
};

type ImageUploaderProps = {
  productId: string;
  images: ProductImageRow[];
};

const BUCKET = "product-images";
const MAX_SIZE_MB = 5;

/**
 * Gestión de fotos del producto. La subida va directo del navegador al
 * bucket con la sesión del admin (autorizada por la política RLS de
 * Storage); el registro/borrado en BD va por server actions, y los archivos
 * se eliminan de Storage solo DESPUÉS de confirmar la BD.
 */
export default function ImageUploader({ productId, images }: ImageUploaderProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>({});

  // Nueva foto (con vista previa antes de guardar)
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [newAlt, setNewAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const sorted = [...images].sort((a, b) => a.position - b.position);

  function validateFile(file: File): string | null {
    if (!file.type.startsWith("image/")) {
      return "El archivo debe ser una imagen (JPG, PNG o WebP).";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `La imagen pesa demasiado (máximo ${MAX_SIZE_MB} MB).`;
    }
    return null;
  }

  async function uploadToBucket(
    file: File
  ): Promise<{ url: string } | { error: string }> {
    try {
      const supabase = createClient();
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `${productId}/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) {
        return { error: "No se pudo subir la imagen. Inténtalo de nuevo." };
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { url: data.publicUrl };
    } catch {
      return { error: "No se pudo conectar para subir la imagen." };
    }
  }

  /** Si la BD rechaza el registro, se limpia el archivo recién subido. */
  async function cleanupUpload(url: string) {
    try {
      const marker = `/object/public/${BUCKET}/`;
      const path = decodeURIComponent(url.slice(url.indexOf(marker) + marker.length));
      await createClient().storage.from(BUCKET).remove([path]);
    } catch {
      // Archivo huérfano tolerado: no afecta a la web
    }
  }

  function handleSelectNew(file: File | null) {
    setResult(null);
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      setResult({ ok: false, message: problem });
      return;
    }
    if (newPreview) URL.revokeObjectURL(newPreview);
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
  }

  async function handleUploadNew() {
    if (!newFile) return;
    if (newAlt.trim().length < 3) {
      setResult({
        ok: false,
        message:
          "Escribe una descripción corta de la foto (la usan las personas con lector de pantalla).",
      });
      return;
    }
    setBusy(true);
    setResult(null);
    const uploaded = await uploadToBucket(newFile);
    if ("error" in uploaded) {
      setResult({ ok: false, message: uploaded.error });
      setBusy(false);
      return;
    }
    const response = await addProductImage({
      productId,
      url: uploaded.url,
      alt: newAlt.trim(),
    });
    if (!response.ok) {
      await cleanupUpload(uploaded.url);
    } else {
      if (newPreview) URL.revokeObjectURL(newPreview);
      setNewFile(null);
      setNewPreview(null);
      setNewAlt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    }
    setResult(response);
    setBusy(false);
  }

  async function handleReplace(file: File | null) {
    if (!file || !replacingId) return;
    const problem = validateFile(file);
    if (problem) {
      setResult({ ok: false, message: problem });
      setReplacingId(null);
      return;
    }
    setBusy(true);
    setResult(null);
    const uploaded = await uploadToBucket(file);
    if ("error" in uploaded) {
      setResult({ ok: false, message: uploaded.error });
    } else {
      const response = await replaceProductImage({
        imageId: replacingId,
        newUrl: uploaded.url,
      });
      if (!response.ok) await cleanupUpload(uploaded.url);
      else router.refresh();
      setResult(response);
    }
    setReplacingId(null);
    if (replaceInputRef.current) replaceInputRef.current.value = "";
    setBusy(false);
  }

  async function run(action: () => Promise<ActionResult>) {
    setBusy(true);
    setResult(null);
    const response = await action();
    setResult(response);
    if (response.ok) router.refresh();
    setBusy(false);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((image) => image.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(() => reorderImages({ productId, imageIds: ids }));
  }

  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-blanco-crema p-6 shadow-calida">
      <div>
        <h2 className="font-display text-xl font-semibold text-tinta">Fotos</h2>
        <p className="mt-1 text-sm text-cacao">
          La primera foto es la principal (se muestra en la tienda). Usa las
          flechas para cambiar el orden.
        </p>
      </div>

      {result && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 font-bold ${
            result.ok
              ? "bg-salvia/15 text-salvia"
              : "bg-terracota/10 text-terracota"
          }`}
        >
          {result.message}
        </p>
      )}

      {sorted.length === 0 && (
        <p className="rounded-2xl bg-crema px-4 py-3 text-cacao">
          Este producto aún no tiene fotos. Mientras tanto, la tienda muestra
          la ilustración de la marca.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {sorted.map((image, index) => (
          <li
            key={image.id}
            className="flex flex-col gap-3 rounded-2xl bg-crema p-4"
          >
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-blanco-crema">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {index === 0 && (
                  <span className="w-fit rounded-full bg-amarillo px-3 py-1 text-xs font-bold uppercase tracking-wide text-tinta">
                    Principal
                  </span>
                )}
                <label className="text-sm font-bold text-tinta">
                  Descripción de la foto
                  <input
                    type="text"
                    defaultValue={image.alt}
                    onChange={(event) =>
                      setAltDrafts((drafts) => ({
                        ...drafts,
                        [image.id]: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-2xl border-2 border-amarillo-suave bg-blanco-crema px-3 py-2 font-normal text-tinta focus:border-miel focus:outline-none"
                  />
                </label>
                {altDrafts[image.id] !== undefined &&
                  altDrafts[image.id] !== image.alt && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        run(() =>
                          updateImageAlt({
                            imageId: image.id,
                            alt: altDrafts[image.id],
                          })
                        )
                      }
                      className="w-fit rounded-full bg-tinta px-4 py-1.5 text-sm font-bold text-amarillo disabled:opacity-50"
                    >
                      Guardar descripción
                    </button>
                  )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy || index === 0}
                onClick={() => move(index, -1)}
                aria-label="Subir en el orden"
                className="rounded-full border-2 border-amarillo-suave p-2 text-tinta hover:border-tinta disabled:opacity-40"
              >
                <ArrowUp className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                disabled={busy || index === sorted.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Bajar en el orden"
                className="rounded-full border-2 border-amarillo-suave p-2 text-tinta hover:border-tinta disabled:opacity-40"
              >
                <ArrowDown className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setReplacingId(image.id);
                  replaceInputRef.current?.click();
                }}
                className="rounded-full border-2 border-tinta px-4 py-1.5 text-sm font-bold text-tinta hover:bg-tinta hover:text-amarillo disabled:opacity-50"
              >
                Cambiar foto
              </button>
              {confirmingDelete === image.id ? (
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-tinta">
                    ¿Eliminar esta foto?
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setConfirmingDelete(null);
                      void run(() => deleteProductImage({ imageId: image.id }));
                    }}
                    className="rounded-full bg-terracota px-4 py-1.5 text-sm font-bold text-blanco-crema disabled:opacity-50"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(null)}
                    className="rounded-full border-2 border-tinta px-4 py-1.5 text-sm font-bold text-tinta"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmingDelete(image.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-terracota hover:bg-terracota/10 disabled:opacity-50"
                >
                  <Trash2 className="size-4" aria-hidden />
                  Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Input oculto compartido para "Cambiar foto" */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleReplace(event.target.files?.[0] ?? null)}
      />

      {/* ── Agregar nueva foto ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-amarillo-suave p-4">
        <p className="font-bold text-tinta">Agregar una foto</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => handleSelectNew(event.target.files?.[0] ?? null)}
          className="text-sm text-cacao file:mr-3 file:rounded-full file:border-0 file:bg-tinta file:px-4 file:py-2 file:font-bold file:text-amarillo"
        />
        {newPreview && (
          <div className="relative size-32 overflow-hidden rounded-2xl bg-crema">
            {/* Vista previa local antes de guardar (objectURL) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={newPreview}
              alt="Vista previa de la nueva foto"
              className="size-full object-cover"
            />
          </div>
        )}
        {newFile && (
          <>
            <label className="text-sm font-bold text-tinta">
              Descripción de la foto (obligatoria)
              <input
                type="text"
                value={newAlt}
                onChange={(event) => setNewAlt(event.target.value)}
                placeholder="Ej. Bolsa de granola Clásica de Miel de 250 g"
                className="mt-1 w-full rounded-2xl border-2 border-amarillo-suave bg-blanco-crema px-3 py-2 font-normal text-tinta focus:border-miel focus:outline-none"
              />
            </label>
            <Button
              type="button"
              onClick={handleUploadNew}
              disabled={busy || newAlt.trim().length < 3}
              className="w-full sm:w-fit"
            >
              {busy ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  Subiendo…
                </>
              ) : (
                "Subir foto"
              )}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
