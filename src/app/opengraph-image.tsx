import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Imagen OG definitiva "Tinta & Oro": isotipo (arco + N, asset de Alonso) +
// wordmark en Fraunces real sobre tarjeta marfil, con el fondo en el
// degradado Atmósfera y hairline dorado (assets locales en src/app/og para
// no depender de la red durante el build).

export const alt =
  "Naturelly — Delicias artesanales hechas por Nelly en Arequipa, Perú";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [fraunces, isotipo] = await Promise.all([
    readFile(join(process.cwd(), "src/app/og/Fraunces-600.ttf")),
    readFile(join(process.cwd(), "src/app/og/isotipo-tinta.png")),
  ]);
  const isotipoSrc = `data:image/png;base64,${isotipo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Base del degradado Atmósfera (satori no soporta multicapa)
          background: "linear-gradient(160deg, #2B2721 0%, #1B1A17 55%, #151412 100%)",
        }}
      >
        {/* Hairline dorado perimetral (la "caja" de la marca) */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1px solid rgba(195, 154, 82, 0.4)",
            borderRadius: 18,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#FAF7F0", // marfil
            borderRadius: 24,
            padding: "48px 96px 44px",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={isotipoSrc} alt="" width={150} height={150} />
          <div
            style={{
              marginTop: 8,
              fontSize: 96,
              fontFamily: "Fraunces",
              color: "#1B1A17", // tinta
              letterSpacing: -2,
            }}
          >
            Naturelly
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 28,
              color: "#4C463A", // piedra
              textAlign: "center",
            }}
          >
            Delicias artesanales hechas por Nelly · Arequipa, Perú
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
      ],
    }
  );
}
