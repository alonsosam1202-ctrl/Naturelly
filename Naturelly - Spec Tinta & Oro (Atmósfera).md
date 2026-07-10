# Naturelly — Paleta definitiva "Tinta & Oro / Atmósfera"

Dirección aprobada: opción **3b** del canvas de exploración. Fondo marfil + ancla grafito ("Tinta") aplicada como degradado atmosférico (nunca bloque plano en zonas grandes) + oro como acento primario + joyas de categoría, con el chocolate reintegrado como acento puntual.

Tipografía: **Fraunces** (títulos, wght 500, itálica para el logotipo) + **Instrument Sans** (UI y cuerpo).

---

## 1 · Colores

### Núcleo
| Rol | Nombre | Hex |
|---|---|---|
| Ancla (base del degradado, footer, texto principal sobre claro) | Tinta | `#1B1A17` |
| Texto principal sobre Marfil | Tinta texto | `#21201C` |
| Texto secundario sobre Marfil | Piedra | `#4C463A` |
| Fondo general | Marfil | `#FAF7F0` |
| Superficie de tarjetas | Blanco | `#FFFFFF` |
| Bordes/divisores sobre claro | Lino | `#E4DDCD` |
| Texto/elementos claros sobre Tinta | Crema | `#F2ECDF` (muted: `rgba(242,236,223,.85)`) |

### Oro (acento primario)
| Rol | Hex |
|---|---|
| Oro — CTAs, eyebrows y detalles **sobre Tinta**; fondo de botón primario | `#C39A52` |
| Oro hover (fondo de botón) | `#D2AB63` |
| Oro texto **sobre Marfil/Blanco** — texto normal (links, labels) | `#8A6A2F` |
| Oro texto grande (≥24px o ≥18.5px bold) sobre Marfil | `#A8823E` |

Texto sobre botón oro: siempre Tinta `#1B1A17`.

### Joyas de categoría (5)
Solo como color de categoría, dots, tags y detalles — nunca como bloque grande.

| Categoría | Nombre | Hex | Variante para texto normal sobre Marfil |
|---|---|---|---|
| Tortas | Chocolate | `#5F3A26` | mismo (pasa AA) |
| Postres | Esmeralda | `#2F6353` | mismo (pasa AA) |
| Cupcakes | Frambuesa | `#A2496B` | mismo (pasa AA) |
| Granola | Ámbar | `#97722E` | `#7D5E24` para texto; `#97722E` solo dots/texto grande |
| Reserva (futura 5ª categoría) | Ciruela | `#55405F` | mismo (pasa AA) |

Uso del chocolate: categoría Tortas + tags puntuales (ej. pill "Best seller · Chocolate 70%": fondo `#5F3A26`, texto `#F2E5D8`). Nunca como fondo de sección.

---

## 2 · Degradado "Atmósfera" (bloque ancla del hero)

Tres capas apiladas en un solo `background`, sobre panel con `border-radius: 12px`:

```css
background:
  /* 1. luz dorada — esquina superior derecha */
  radial-gradient(120% 150% at 88% 0%, rgba(195,154,82,.22), transparent 46%),
  /* 2. calor chocolate — esquina inferior izquierda (el marrón como atmósfera) */
  radial-gradient(90% 120% at 0% 100%, rgba(95,58,38,.35), transparent 55%),
  /* 3. base: tinta en diagonal, de cálido-arriba a más profundo-abajo */
  linear-gradient(160deg, #2B2721 0%, #1B1A17 55%, #151412 100%);

/* hairline dorado */
border: 1px solid rgba(195,154,82,.35);
border-radius: 12px;
```

Notas:
- Dirección de la base: diagonal `160deg` (casi vertical, cayendo hacia abajo-derecha). Paradas: `#2B2721` (0%), `#1B1A17` (55%), `#151412` (100%).
- Las dos radiales usan Oro (`#C39A52`) y Chocolate (`#5F3A26`) en rgba — así el marrón vive dentro del ancla como calor, no como color plano.
- El hairline es siempre 1px, oro al 35% de opacidad. Mismo recurso aplicable a la foto/imagen dentro del bloque: `border: 1px solid rgba(242,236,223,.18)`.
- Sellos (pills) sobre el degradado: `border: 1px solid rgba(195,154,82,.4)`, `background: rgba(195,154,82,.08)`, texto `rgba(242,236,223,.88)`.
- El degradado se reserva para el bloque hero (y opcionalmente banners destacados). Footer y cintas delgadas usan Tinta plana `#1B1A17` — en dosis pequeñas la tinta plana sí funciona.

---

## 3 · Contraste (WCAG AA) — verificado para esta versión

Sobre el degradado (peor caso relevante indicado):

- Crema `#F2ECDF` sobre Tinta plana `#1B1A17`: **14.8:1** ✓ AAA
- Crema sobre la parada más clara `#2B2721`: **12.6:1** ✓ AAA
- Crema sobre la zona del glow dorado (compuesto ≈ `#4C4029`): **≈8.6:1** ✓ AA/AAA — aun así, evitar colocar párrafos largos justo en la esquina del glow
- Oro `#C39A52` sobre Tinta `#1B1A17`: **6.7:1** ✓ AA (eyebrows, links sobre oscuro)
- Oro sobre parada oscura `#151412`: **7.1:1** ✓ AA
- Tinta `#1B1A17` sobre botón Oro `#C39A52`: **6.7:1** ✓ AA

Sobre Marfil `#FAF7F0` / Blanco:

- Tinta texto `#21201C`: **>15:1** ✓ AAA
- Piedra `#4C463A` (texto secundario): **≈9:1** ✓ AAA
- Oro texto `#8A6A2F`: **4.7:1** ✓ AA texto normal
- `#A8823E`: **3.3:1** — solo texto grande (≥24px / ≥18.5px bold) o elementos no textuales
- `#C39A52` sobre Marfil: **2.4:1** ✗ — nunca como texto sobre claro; solo fondos de botón y elementos decorativos
- Chocolate `#5F3A26`: **9.3:1** ✓ · Esmeralda `#2F6353`: **6.5:1** ✓ · Frambuesa `#A2496B`: **5.3:1** ✓ · Ciruela `#55405F`: **8.6:1** ✓
- Ámbar `#97722E`: **4.1:1** ✗ texto normal → usar `#7D5E24` (**5.6:1** ✓) para texto; `#97722E` queda para dots y texto grande

Regla general: sobre fondos claros el oro nunca lleva texto en su tono de marca; se usan las variantes `#8A6A2F` / `#A8823E` según tamaño.
