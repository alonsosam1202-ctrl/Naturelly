# Auditoría integral — 2026-07-07 (pre-rediseño)

> Cuatro revisiones especializadas corridas en paralelo (diseño/marca, UX del
> funnel, negocio/conversión, técnica) sobre el código y el sitio vivo.
> Este doc es la síntesis priorizada; los informes completos están en la
> conversación de trabajo del 2026-07-07. NADA de esto está implementado aún.

## Veredicto central (los 4 ángulos convergen)

**El sistema visual fue diseñado para una marca de granola wellness y el
negocio hoy es ~90% pastelería.** La paleta "Bright Wellness" (amarillo
saturado protagonista + pasteles lavanda/berry) comunica snack saludable
juvenil, no repostería artesanal premium — la sospecha de Alonso es correcta.
Lo que más daña la venta no es código: son las ilustraciones de bowls de
granola como placeholder de TODAS las tortas, los precios sin confirmar y la
información de encargo (entrega al día siguiente) enterrada en el FAQ.
La base técnica es sólida; la deuda real son 4 puntos concretos.

## Diseño/marca — hallazgos clave

- Amarillo #FEDB5F en bloques grandes = código visual de fast food/infantil;
  en repostería premium el dorado se expresa como oro tostado/caramelo/miel
  oscura. Lavanda y berry pastel al 50% = baby shower, no tiramisú de S/ 80.
- El "marrón NUNCA es bloque" de BRAND_GUIDE tiró el activo más premium de la
  categoría (chocolate/espresso/caramelo). Esa regla debe reescribirse.
- CONSERVAR: Fraunces (excelente), arcos de horno, RotatingSeal, marquee,
  tono de voz peruano, disciplina de tokens/AA/reduced-motion, lógica "un
  color por categoría" (solo cambia la familia tonal).
- Regla nueva sugerida: bloques de interfaz en crema o espresso; el color vivo
  solo en acentos pequeños; la comida pone el color.

### Las 3 familias de paleta propuestas (jerarquía completa)

En las tres, el amarillo actual no muere: **madura** — de `#FEDB5F` a la
familia oro/caramelo, reconocible como "Naturelly dorado" pero sin gritar.

#### Opción A — "Cacao y Crema" (pastelería moderna cálida) ★ recomendada

La evolución natural: conserva la calidez actual, sustituye el amarillo
protagonista por oro caramelo y devuelve el marrón al centro.

| Rol | Hex | Nota |
|---|---|---|
| Fondo | `#FAF4EA` | Crema masa, apenas más cálido que el actual |
| Superficie/cards | `#FFFDF8` | Se conserva el actual |
| Bloques ancla (footer, cinta, CTA) | `#2B1A12` | Espresso profundo — reemplaza al footer amarillo |
| Texto principal | `#26170E` | Near-black cálido (reemplaza la tinta azulada) |
| Texto secundario | `#6B4A33` | Evolución del cacao actual |
| **Acento primario** | `#C08A3E` | Oro caramelo/miel horneada — heredero del amarillo; variante AA para texto `#8A5F22` |
| Tinte suave | `#F3E3C3` | "Mantequilla": paneles cálidos, reemplaza amarillo-suave |
| Categorías | tortas `#8E3B46` (frambuesa profunda) · postres `#B45A38` (caramelo quemado) · granola `#C08A3E` (oro) · salados `#5F7047` (oliva) · cupcakes `#C2647A` (frambuesa clara) | Tonos joya plenos, nunca al 50% de opacidad |

#### Opción B — "Vitrina de autor" (contraste alto, más carácter)

Base casi austera para que la foto mande; oro + joyas en dosis pequeñas.
Registro Pierre Hermé / bean-to-bar.

| Rol | Hex |
|---|---|
| Fondo | `#F7F1E6` (marfil) |
| Superficie | `#FFFCF5` |
| Bloques ancla / hero alterno | `#3B2418` (chocolate 70%) |
| Texto | `#221611` |
| Acento primario | `#D9A441` (oro miel — el amarillo actual desaturado y profundizado; texto AA `#8F6A1B`) |
| Categorías | tortas `#A83250` · postres `#7D3F8C` (ciruela, no lavanda) · granola `#B67F2F` · salados `#77683B` · cupcakes `#C05621` (naranja quemada) |

#### Opción C — "Andina contemporánea" (la más peruana)

Ancla la marca en Arequipa: sillar, ocre, terracota volcánica. Conserva más
luminosidad del sistema actual.

| Rol | Hex |
|---|---|
| Fondo | `#FBF6ED` (sillar cálido) |
| Superficie | `#FFFDF7` |
| Bloques ancla | `#32211A` |
| Texto | `#2A1B10` / secundario `#7A5138` |
| Acento primario | `#C2542F` (terracota arequipeña — hoy relegada a errores; pasaría a firma de marca, y los errores migran a un rojo `#9E2B25`) |
| Acento secundario | `#DFA333` (ocre dorado) |
| Categorías | tortas `#9E3A52` · postres `#DFA333` · granola `#8A6A2F` · salados `#4C6444` · cupcakes `#C2542F` |

Estrategias detrás (de marcas que sí transmiten calidad): neutros cálidos
comestibles como base; marrones profundos como ancla de categoría; acentos
joya (frambuesa, pistacho, naranja quemada) en dosis pequeñas en vez de
pasteles en bloques; oro/caramelo como señal de lujo en lugar de amarillo
saturado; la interfaz se subordina a la fotografía del producto.

## UX del funnel — hallazgos priorizados

- **C1 (crítico)**: "entrega al día siguiente" no aparece en carrito, checkout
  ni confirmación; el placeholder de notas sugiere entrega hoy ("después de
  las 3 pm"). El cliente se entera por WhatsApp = peor momento.
- **C2 (crítico)**: la página de confirmación celebra "¡registrado!" con check
  verde y el botón de WhatsApp queda bajo el fold; el hint del checkout dice
  "te escribiremos" (pasivo) cuando el flujo exige que el cliente escriba.
  Riesgo real de pedidos pendientes sin mensaje.
- **C3 (crítico)**: agotado invisible en la tarjeta; el panel preselecciona
  variants[0] aunque esté agotada y no marca cuál variante tiene cupo.
- **I1**: 24 productos en UNA columna móvil ≈ 17 pantallas de scroll hasta
  cupcakes, sin filtros ni encabezados de sección. `?categoria=` ya funciona.
- **I2**: error de stock en checkout genérico y sin acción de recuperación.
- **I3**: los botones de variante no muestran su precio.
- **I4**: copy "¡Quedan solo 1 de esta tanda!" confunde en tortas por encargo
  (son cupos de producción, no vitrina).
- **I5**: el "Total" de la confirmación y del mensaje de WhatsApp no recuerdan
  que el delivery va aparte.
- Menores: teléfono rechaza formatos naturales (espacios/+51), drawer sin
  focus trap, eliminar del carrito sin deshacer, key por name en confirmación.

## Negocio/conversión — antes de Etapa 2

Bloqueantes (contenido, no código): **fotos reales** (4 tortas top + granola +
1 corte servido + 2-3 fondant + foto de Nelly), **precios reales** (0/45
confirmados), historia real en /nosotros (hoy dice "muy pronto"), 3-5
testimonios de Etapa 1, enlace a Instagram (el comprador arequipeño verifica
ahí), WhatsApp real en producción (ya está ✓).
Código barato que vende: anclaje de precio ("S/ 70 · ~20 personas · S/ 3.20
por porción"), sello "Pedido hoy, listo mañana" fuera del FAQ, badges nuevos
("Para compartir", "Integral/Fit"; retirar "Edición limitada"), aviso de
delivery aparte en carrito/checkout, hora de corte del "día siguiente",
CustomCakesSection también en portada (hoy vive tras 26 productos),
"escribimos tu dedicatoria" en fichas de tortas.
Idea fuerza: una tarde con Nelly y un celular resuelve el 80% (fotos, precios,
historia, testimonios).

## Técnica — deuda que vale la pena YA (1-2 días, antes del rediseño)

1. **/tienda es dinámica sin querer**: leer `searchParams` anula el
   `revalidate=60`; cada visita = SSR + query en Render Free. Quitar la
   lectura (el filtro está oculto de todos modos) restaura ISR. 30 min.
2. **Video del hero**: se descarga entero aunque haya reduced-motion
   (display:none no evita la carga); viola WCAG 2.2.2 (falta botón de pausa
   para movimiento >5 s); overlay tinta/50 no garantiza AA sobre frames
   claros (subir a /65-70); comprimir a ≤1 MB + poster + montaje client-side
   con matchMedia (elimina además el hack dangerouslySetInnerHTML). Medio día.
3. **Fallo de Supabase = tienda "vacía" que miente** (y el estado vacío se
   cachea 60 s): lanzar error → error.tsx honesto. 1-2 h.
4. **Blast radius del cambio de paleta**: tokens en globals.css + hex sueltos
   en 11 archivos (FLAVOR_ACCENTS, BowlIllustration ~25 hex, FloatingIngredients,
   RotatingSeal, opengraph-image y icon.svg a mano, 6× accent-[#E6A12D]).
   Si se conservan los NOMBRES de token: ~11 archivos. Si cambian: ~73.
   Pre-trabajo recomendado: capa de alias semánticos (--color-primary → token),
   accent-miel en vez de hex, FLAVOR_ACCENTS con var(--color-*). 1-2 h.
5. Limpieza de categorías legado (clasica/andina/chocolate/especial en types,
   constants, zod y CHECK de BD — ya sin productos) + poda de
   placeholder-catalog.ts. 2-3 h. Requiere doc → migración → aprobación.
6. Menores: GoogleIcon duplicado en LoginForm/RegisterForm; React.cache() en
   getProductBySlug (doble fetch metadata+page); scripts de verificación
   viven fuera del repo (traer a scripts/); comentario stale en constants.ts
   sobre "torta de naranja retirada" (ya se vende — solo el comentario miente).
7. **Rate limiting en /api/pedidos y /api/contacto**: create_order descuenta
   stock en pendientes — un script puede drenar los cupos sin comprar. ~20
   líneas in-memory bastan en Render Free. Subirlo a bloqueante de Etapa 2.

## Correcciones a los informes (verificado después)

- "La home viva muestra placeholders (Cholo Power…)": caché stale del fetch
  del auditor — verificado en producción: la home ya muestra Granola Premium
  y cero placeholders.
- La afirmación de que "la mayoría de tortas no muestra porciones" no coincide
  con la BD (las 32 variantes M/G tienen '— 22/26 porciones'); probablemente
  caché. El punto válido que queda: los botones de variante no muestran precio.

## Orden de ataque propuesto

1. **Pre-rediseño técnico** (items 1-4 técnicos) — deja el terreno barato.
2. **Rediseño de paleta** con la dirección que elija Alonso (Claude Design);
   reescribir BRAND_GUIDE (incl. las 3 reglas que institucionalizan el
   amarillo) ANTES o junto con los tokens.
3. **Fixes de conversión/UX de código barato** (C1, C2, C3, I1, anclaje de
   precio, badges) — idealmente ya con la paleta nueva para no retrabajar.
4. **Contenido con Nelly** (fotos, precios, historia, testimonios) — puede
   correr en paralelo a todo.
5. Rate limiting + hora de corte antes de abrir al público (Etapa 2).
