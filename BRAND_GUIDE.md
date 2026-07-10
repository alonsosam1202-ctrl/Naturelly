# BRAND_GUIDE — Naturelly

## Esencia de marca

**Naturelly es la granola que una madre haría para su propia familia.** Artesanal de verdad, andina de origen, premium sin pretensión. La referencia de nivel es Purely Elizabeth (categoría wellness premium), pero la identidad es propia: donde ellos dicen "ancestral grains", nosotros decimos "de la tierra donde nacieron esos granos".

**Personalidad:** cálida, honesta, orgullosamente peruana, cuidadosa con el detalle. Nunca fría, nunca corporativa, nunca "healthy culposo".

## Dirección de arte VIGENTE — "Tinta & Oro / Atmósfera" (2026-07-07)

> Paleta y aplicación definitivas elegidas por Alonso (exploración en Claude
> Design; spec completa en `Naturelly - Spec Tinta & Oro (Atmósfera).md`,
> fuente de verdad junto con los tokens de `src/app/globals.css`). Sustituye
> a "Bright Wellness" (abajo, conservada como histórico). Los NOMBRES de
> token legado se conservan remapeados en globals.css.

**Tipografía:** Fraunces (títulos; la spec pide wght 500 — el ajuste fino de
pesos queda pendiente del pase completo de rediseño) + **Instrument Sans**
(UI y cuerpo; reemplaza a Karla). La firma "Nelly" del sello sigue en
Dancing Script (única excepción).

### Núcleo
| Rol | Token | Hex |
|---|---|---|
| Ancla (degradado, footer, texto principal) | `tinta` | `#1B1A17` |
| Texto secundario sobre claro | `piedra` (alias legado `cacao`) | `#4C463A` |
| Fondo general (Marfil) | `crema` | `#FAF7F0` |
| Superficie de tarjetas | `blanco-crema` | `#FFFFFF` |
| Bordes/divisores sobre claro (Lino) | `lino` (alias `amarillo-suave`) | `#E4DDCD` |
| Texto claro sobre Tinta | `crema-clara` | `#F2ECDF` |
| Tinte editorial suave (derivado) | `blush` | `#F2EDE2` |

### Oro (acento primario)
| Rol | Token | Hex |
|---|---|---|
| CTAs/eyebrows sobre Tinta; fondo botón primario | `oro` (alias `amarillo`/`miel`) | `#C39A52` |
| Hover del botón oro | `oro-hover` | `#D2AB63` |
| Oro como TEXTO normal sobre claro (AA 4.7:1) | `oro-texto` (alias `miel-oscura`) | `#8A6A2F` |
| Oro texto grande (≥24px / ≥18.5px bold) | `oro-grande` | `#A8823E` |

**Regla dura:** `#C39A52` JAMÁS como texto sobre fondos claros (2.4:1).
Texto sobre botón oro: siempre `tinta`.

### Joyas de categoría (solo dots, tags y detalles — nunca bloques grandes)
| Categoría | Token | Hex | Nota AA |
|---|---|---|---|
| Tortas | `chocolate` | `#5F3A26` | pasa AA como texto |
| Postres | `esmeralda` (alias `salvia`) | `#2F6353` | pasa AA |
| Cupcakes | `frambuesa` (alias `berry`) | `#A2496B` | pasa AA |
| Granola | `ambar` | `#97722E` | solo dots/texto grande; texto normal → `ambar-texto` `#7D5E24` |
| **RESERVA** (futura 5ª categoría — NO asignar) | `ciruela` | `#55405F` | pasa AA |
| Salados (PROVISIONAL, la spec no lo define) | `piedra` | `#4C463A` | pasa AA |

### Aplicación "Atmósfera" (utilidades en globals.css)
- `.bg-atmosfera`: el degradado de tres capas de la spec (luz dorada arriba-
  derecha + calor chocolate abajo-izquierda + base tinta 160deg). Se usa en
  el hero de `/tienda` y banners destacados (CTA final de la portada) —
  **la tinta nunca va plana en bloques grandes**.
- `.hairline-oro`: borde 1px oro al 35% + `rounded-xl` (12px) en el panel.
- `.hairline-crema`: borde 1px crema al 18% para fotos/video DENTRO del panel.
- `.sello-atmosfera`: pills de sellos sobre el degradado (borde oro 40%,
  fondo oro 8%, texto crema 88%).
- Footer y cintas delgadas (marquee): tinta plana `#1B1A17` — permitido en
  dosis pequeñas.

### Qué se conserva del sistema anterior
Arcos de horno, RotatingSeal (recolorado a tinta+oro), marquee de una línea,
tono de voz peruano, disciplina AA/reduced-motion, sombras cálidas.
Pendientes del pase completo de rediseño: favicon y OG definitivos (assets
de Alonso vía Gemini), ilustración del hero de portada, pesos Fraunces 500.

---

## Dirección de arte HISTÓRICA — "Naturelly Bright Wellness" (2026-07-03 → 2026-07-07, sustituida)

Naturelly se ve **fresca, luminosa, apetecible y comercial**, sin perder lo artesanal. La lógica visual (no el diseño) se inspira en el bright wellness retail: fondos limpios, color protagonista, producto al centro.

> **Mandato creativo:** la IA tiene permiso y mandato para proponer direcciones visuales creativas, modernas y premium — más color, más contraste, formas orgánicas, mockups, microanimaciones y secciones dinámicas — siempre dentro de la personalidad de marca (cálida, honesta, peruana) y sin copiar el diseño de Purely Elizabeth. Su **lógica** sí es referencia válida: producto protagonista, colores vivos por sabor, fotografía apetecible, sensación editorial. Toda animación respeta `prefers-reduced-motion`, no oculta contenido al SEO y no usa videos pesados ni canvas para texto.

Principios:

1. **Fondos limpios y luminosos.** Crema `#FFFBF6`, blush y blanco dominan. El marrón NUNCA es bloque: el cacao queda como detalle y texto secundario.
2. **El amarillo Naturelly es el color de la marca.** Protagonista en el arco del hero, el footer, el CTA final y el sabor clásico. Si una pantalla no tiene amarillo, probablemente le falta marca.
3. **Negro tinta como contraste fuerte.** Títulos, navegación, botones primarios, píldoras activas y la cinta de ingredientes. El dúo tinta + amarillo es la firma comercial.
4. **Producto protagonista sobre bloques pastel.** Cada sabor vive sobre su color pastel fuerte (amarillo, salvia, lavanda, berry) — nada de tintes tímidos.
5. **Aire editorial con pasteles.** Secciones sobre blush, lavanda o amarillo suave; citas grandes en Fraunces itálica; espacio generoso.
6. **Nada plano ni vacío.** Arcos, sellos, ingredientes flotantes y microanimaciones — con moderación (ver reglas).

## Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `crema` | `#FFFBF6` | Fondo principal (body), casi blanco |
| `blush` | `#FFF1F4` | Secciones editoriales, fondos suaves |
| `blanco-crema` | `#FFFDF9` | Cards, superficies elevadas, sellos |
| `amarillo` | `#FEDB5F` | **Amarillo Naturelly, protagonista**: footer, arcos, CTA, sabor clásico |
| `amarillo-suave` | `#FFE9A8` | Bordes, paneles cálidos, estados suaves |
| `tinta` | `#18212A` | Negro tinta: títulos, texto principal, nav, botones primarios, marquee |
| `miel` | `#E6A12D` | Miel tostada DECORATIVA: fondos, gradientes, ilustraciones (no cumple AA como texto) |
| `miel-oscura` | `#9C6410` | Miel para TEXTO: precios, links, eyebrows, foco visible (AA 4.5:1 sobre fondos claros) |
| `salvia` | `#7CA66A` | Salvia DECORATIVA: fondos, arcos, puntos, ilustraciones |
| `salvia-oscura` | `#3E6B35` | Salvia para TEXTO: mensajes de éxito, badges (AA sobre fondos claros y tintes) |
| `berry` | `#E9B6D0` | Pastel frutal: sabor especial, acentos editoriales |
| `lavanda` | `#E8C7F0` | Pastel editorial: fondo del sabor chocolate, variedad de bloques |
| `cacao` | `#5A3A28` | SOLO detalle: texto secundario, granos ilustrados. Nunca bloque de fondo |
| `terracota` | `#B04527` | SOLO errores, urgencia y estado cancelado (AA como texto y con texto blanco) |

**Regla de accesibilidad (obligatoria):** los acentos vivos (`miel`, `salvia`) son solo decorativos; todo TEXTO en esos tonos usa su variante `-oscura` (contraste AA ≥ 4.5:1 verificado). Los badges sobre `bg-miel` usan texto `tinta`, nunca blanco. Excepción: elementos `aria-hidden` puramente decorativos (p. ej. los separadores del marquee).

Reglas de color: el verde WhatsApp (`#2E7D3F`, tono oscuro AA con texto blanco) se reserva exclusivamente para acciones de WhatsApp. Los estados de pedido usan colores semánticos consistentes (pendiente/en preparación/en camino = amarillos con texto cacao, confirmado/entregado = salvia, cancelado = terracota). El único bloque oscuro permitido es la cinta de ingredientes (fondo tinta); el footer es **amarillo**, no oscuro.

## Formas orgánicas y sellos

- **Arcos de horno:** la forma firma de la marca. Áreas visuales de producto con `rounded-t-[10rem]` (tarjetas) o `rounded-t-full` (hero), con el fondo pastel fuerte del sabor. En el hero el arco es amarillo sólido.
- **Sello personal (`RotatingSeal`):** composición "HECHO POR / *Nelly* / AREQUIPA · PERÚ". Círculo fino de trazo orgánico y arcos en Karla (mayúsculas, tracking amplio) que giran en 60 s; la firma manuscrita **Nelly** queda estática al centro para leerse siempre. Tinta sobre fondo transparente, con dos granos amarillos como acento. **Máximo un sello protagonista por sección** — es firma, no confeti.
- **Stickers:** badges con rotación leve (≤4°) sobre el arco. Uno por tarjeta como máximo.
- **Ingredientes flotantes (`FloatingIngredients`):** capa decorativa `aria-hidden` con hojuela amarilla, gota de miel, hoja salvia, fruto berry y grano cacao. **Un único grupo en toda la página, solo en el hero**, compuesto como una sola esquina decorativa (no elementos sueltos a ambos lados), amplitud ≤10 px, sin tapar texto ni botones; en mobile se atenúa y se reduce a lo esencial.

## Acentos por sabor

Cada sabor es dueño de un color pastel fuerte (definido en `FLAVOR_ACCENTS`, `src/lib/constants.ts`):

| Sabor / categoría | Primario | Secundario | Fondo del arco | Sensación |
|---|---|---|---|---|
| Clásica de Miel (`clasica`) | miel `#E6A12D` | amarillo `#FEDB5F` | amarillo al 70% | Dorado, de marca |
| Andina Power (`andina`) | salvia `#7CA66A` | amarillo `#FEDB5F` | salvia al 30% | Fresco, de la tierra |
| Cacao & Café (`chocolate`) | cacao `#5A3A28` | miel `#E6A12D` | lavanda al 50% | Chocolate moderno |
| Frutos Rojos — futuro (`especial`) | berry `#E9B6D0` | miel `#E6A12D` | berry al 50% | Frutal, natural |

Los fondos de sabor son **pastel fuertes, notorios**. El dúo se aplica en: fondo del arco, frutos de la ilustración, banda del bowl, badge/sticker y barra de gradiente inferior. Cuando lleguen fotos reales, el fondo del arco se mantiene como escenografía del sabor.

## Animación (CSS-first, liviana)

Sin librerías: solo keyframes CSS y un observador de intersección propio. Inventario permitido:

| Animación | Especificación | Dónde |
|---|---|---|
| `float` | translateY ±9 px, 6 s, ease-in-out | Ingredientes flotantes, chips del hero |
| `spin-slow` | 360° en 60 s, lineal | Sello giratorio |
| `pop` | scale 0.4→1.2→1, 0.35 s | Contador del carrito al agregar |
| `drawer` / `fade` | slide-in 0.28 s / fade 0.25 s | CartDrawer y su overlay |
| Marquee | **Un solo carril**, una sola dirección, loop continuo sin saltos, pausa al hover | Cinta de ingredientes |
| Reveal | fade + 20 px al entrar al viewport, 0.7 s; con `replay` se repite al reentrar (usarlo con criterio, no en todo) | Secciones bajo el fold; `replay` en pasos de compra y CTA |
| Hover producto | lift + rotación ≤1° + scale 1.05 del bowl | Tarjetas |

Reglas duras: `prefers-reduced-motion` apaga TODO; el contenido nace visible en el SSR (Reveal nunca oculta nada antes de hidratar ni al bot de Google); solo se anima `transform`/`opacity` (nada que cause reflow); nada de canvas para texto ni videos pesados.

## Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Fraunces** (variable, eje SOFT alto en cursivas) | H1–H3, precios destacados, citas |
| Texto | **Karla** | Párrafos, formularios, navegación, admin |
| Firma | **Dancing Script** (700) | EXCLUSIVAMENTE la firma "Nelly" del sello — no usarla en ningún otro texto |

Escala: base 16 px; jerarquía con `clamp()` para fluidez móvil→desktop. Los títulos nunca en mayúsculas sostenidas; los eyebrows (etiquetas sobre títulos) sí, en Karla bold con tracking amplio.

## Componentes visuales

- **Bordes:** radios generosos (`rounded-3xl` en cards, `rounded-full` en botones y chips) → sensación amable y moderna.
- **Sombras:** suaves y frescas (base `rgba(24,33,42,0.07)`), nunca grises sucios. Cards con `ring-1 ring-tinta/5` para definición sin peso.
- **Botones:** píldora, con micro-elevación al hover y press al click. **Primario = tinta** (contraste comercial), secundario = outline tinta con hover tinta+amarillo, WhatsApp = verde WhatsApp.
- **Ilustración temporal:** bowl cerámico claro con banda del color del sabor, clusters con brillo, frutos en los acentos del sabor, chorrito de miel amarillo-dorado y halo suave (`BowlIllustration`). Es un placeholder consciente: se reemplaza por fotografía real manteniendo arco y fondo pastel.
- **Fotografía (cuando exista):** luz natural brillante, fondos pastel de esta paleta por sabor, manos e ingredientes reales, nada de stock genérico. Toda la sesión comparte la misma paleta para que catálogo, bowls y lifestyle se sientan de una sola familia visual.
- **Firma visual:** la cinta (marquee) de ingredientes andinos, en fondo **tinta** con texto crema y separadores ✦ de colores, es el elemento distintivo de la marca en la web. **Un solo carril, delgado** — una franja fina y discreta, no dos filas apiladas ni una banda gruesa. Es el único bloque oscuro permitido.

## Tono y voz (UX writing)

- **Idioma:** español peruano, cercano pero cuidado. Se permite calidez local ("al toque", "recién tostadita") en marketing; el admin y los mensajes de sistema son claros y neutros.
- Hablar de comida con antojo, no con jerga nutricional. "Crocante, dorada y nada empalagosa" antes que "alta en fibra prebiótica".
- La historia de Nelly es real: nunca inventar datos, premios ni cifras.
- Mensajes de error: qué pasó y cómo resolverlo, sin disculpas dramáticas. Vacíos como invitación: "Tu carrito está vacío. La Andina Power te está esperando →".

## Lo que Naturelly NO es

1. **No es una copia de Purely Elizabeth.** Prohibido replicar su layout, su logo, su navegación, sus fotos o sus textos. La inspiración es la *lógica visual* (base clara, producto protagonista, color por sabor), no el diseño.
2. No es una tienda genérica de plantilla: nada de heroes con gradiente morado, cards grises ni tipografía Inter por defecto.
3. No es una marca "fitness": no usamos culpa, calorías ni cuerpos como argumento. Vendemos disfrute y origen.
4. No es corporativa: cero lorem ipsum, cero stock photos de oficinas, cero inglés innecesario ("Shop now" → "Ver granolas").
5. **Ya no es café/beige.** El marrón fue la dirección anterior: hoy es detalle, no identidad. Si una sección se siente beige-marrón dominante, está mal.
