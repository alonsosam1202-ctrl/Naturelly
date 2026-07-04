"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  removeBundleImage,
  setBundleImage,
  type ActionResult,
} from "@/app/admin/packs/actions";

type BundleImageManagerProps = {
  bundleId: string;
  bundleName: string;
  imageUrl: string | null;
};

const BUCKET = "product-images"; // según DATABASE_SCHEMA.md: fotos de productos Y bundles
const MAX_SIZE_MB = 5;

/**
 * Imagen única del pack (bundles.image_url; el esquema no soporta galería
 * ni alt propio — la tienda usa el nombre del pack como texto alternativo).
 * Subida directa navegador→bucket con la sesión del admin; la BD se
 * confirma primero y el archivo anterior se limpia después.
 */
export default function BundleImageManager({
  bundleId,
  bundleName,
  imageUrl,
}: BundleImageManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);

  function handleSelect(file: File | null) {
    setResult(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setResult({ ok: false, message: "El archivo debe ser una imagen (JPG, PNG o WebP)." });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setResult({ ok: false, message: `La imagen pesa demasiado (máximo ${MAX_SIZE_MB} MB).` });
      return;
    }
    if (newPreview) URL.revokeObjectURL(newPreview);
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!newFile) return;
    setBusy(true);
    setResult(null);
    try {
      const supabase = createClient();
      const safeName = newFile.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `bundles/${bundleId}/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, newFile, { cacheControl: "3600", upsert: false });
      if (error) {
        setResult({ ok: false, message: "No se pudo subir la imagen. Inténtalo de nuevo." });
        setBusy(false);
        return;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const response = await setBundleImage({ bundleId, url: data.publicUrl });
      if (!response.ok) {
        // La BD rechazó: se limpia el archivo recién subido
        await supabase.storage.from(BUCKET).remove([path]);
      } else {
        if (newPreview) URL.revokeObjectURL(newPreview);
        setNewFile(null);
        setNewPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh();
      }
      setResult(response);
    } catch {
      setResult({ ok: false, message: "No se pudo conectar para subir la imagen." });
    }
    setBusy(false);
  }

  async function handleRemove() {
    setBusy(true);
    setResult(null);
    const response = await removeBundleImage({ bundleId });
    setResult(response);
    setConfirmingRemove(false);
    if (response.ok) router.refresh();
    setBusy(false);
  }

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-blanco-crema p-6 shadow-calida">
      <div>
        <h2 className="font-display text-xl font-semibold text-tinta">
          Foto del pack
        </h2>
        <p className="mt-1 text-sm text-cacao">
          Una sola foto. Si no hay, la tienda muestra la ilustración de la
          marca.
        </p>
      </div>

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

      {imageUrl ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-crema">
            <Image
              src={imageUrl}
              alt={`Foto del pack ${bundleName}`}
              fill
              sizes="360px"
              className="object-cover"
            />
          </div>
          {confirmingRemove ? (
            <div className="flex flex-col gap-2 rounded-2xl bg-terracota/10 p-4">
              <p className="font-bold text-tinta">¿Quitar la foto del pack?</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleRemove}
                  className="w-full rounded-full bg-terracota px-5 py-2.5 font-bold text-blanco-crema disabled:opacity-50 sm:flex-1"
                >
                  {busy ? "Quitando…" : "Sí, quitar"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmingRemove(false)}
                  className="w-full rounded-full border-2 border-tinta px-5 py-2.5 font-bold text-tinta disabled:opacity-50 sm:flex-1"
                >
                  No, volver
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmingRemove(true)}
              className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-terracota hover:bg-terracota/10 disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden />
              Quitar foto
            </button>
          )}
        </div>
      ) : (
        <p className="rounded-2xl bg-crema px-4 py-3 text-cacao">
          Este pack aún no tiene foto.
        </p>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-amarillo-suave p-4">
        <p className="font-bold text-tinta">
          {imageUrl ? "Reemplazar foto" : "Subir foto"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => handleSelect(event.target.files?.[0] ?? null)}
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
          <Button
            type="button"
            onClick={handleUpload}
            disabled={busy}
            className="w-full sm:w-fit"
          >
            {busy ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Subiendo…
              </>
            ) : (
              "Guardar foto"
            )}
          </Button>
        )}
      </div>
    </section>
  );
}
