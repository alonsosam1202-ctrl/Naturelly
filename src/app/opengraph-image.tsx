import { ImageResponse } from "next/og";

// ⚠️ TODO: reemplazar esta imagen OG temporal cuando exista el logo
// definitivo de Naturelly (por ahora: wordmark tipográfico, sin isotipo
// inventado). Colores de BRAND_GUIDE.md (Bright Wellness), sin recursos
// remotos (fuente por defecto de next/og).

export const alt =
  "Naturelly — Granola artesanal de Arequipa, endulzada solo con miel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FEDB5F", // amarillo Naturelly
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#FFFBF6", // crema
            borderRadius: 48,
            padding: "56px 112px",
            boxShadow: "0 24px 80px rgba(24, 33, 42, 0.18)",
          }}
        >
          {/* Granos decorativos en los acentos de la marca */}
          <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                backgroundColor: "#E6A12D", // miel
              }}
            />
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                backgroundColor: "#7CA66A", // salvia
              }}
            />
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                backgroundColor: "#E9B6D0", // berry
              }}
            />
          </div>
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              color: "#18212A", // tinta
              letterSpacing: -4,
            }}
          >
            Naturelly
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 34,
              color: "#5A3A28", // cacao
              textAlign: "center",
            }}
          >
            Granola artesanal de Arequipa · endulzada solo con miel
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
