# LAUNCH_CHECKLIST — Naturelly

> Actualizado 2026-07-04. Posicionamiento aprobado: **"Naturelly — Delicias
> artesanales hechas por Nelly"** ("delicias artesanales" es el término paraguas
> que une la granola, las tortas y futuros productos). La plataforma técnica está
> completa y validada en producción (https://naturelly.onrender.com).

**Realidad del negocio (confirmada por Alonso):** Nelly tiene **una sola receta de
granola validada** (ya se vende internamente a familiares y amigos; no hay otros
sabores probados) y sus productos más fuertes son las **tortas**: torta de
zanahoria (carrot cake solo como término secundario de búsqueda), torta de
chocolate, torta de naranja y **tortas personalizadas con decoración sencilla de
fondant** (sin compra directa: "Cotizar por WhatsApp"). Todos los nombres visibles
van en español.

**El plan tiene dos etapas.** La primera NO es un lanzamiento público masivo:

---

## ETAPA 1 — Uso interno (familiares, amigos y clientes actuales de Nelly)

> Objetivo: que las personas que ya le compran a Nelly pidan por la web.
> **NO bloquean esta etapa:** dominio propio, Search Console, SMTP personalizado,
> políticas legales completas, logo/branding definitivo.

- [ ] 🟠 **Migración `20260704120000_real_categories.sql` aplicada** (creada y con dry-run limpio; pendiente de aprobación de Alonso para `db push`) + `database.ts` regenerado.
- [ ] 🟠 **Productos reales cargados** (granola + 3 tortas) con la tabla de datos que completa Alonso/Nelly — sin inventar nada.
- [ ] 🟠 **Precios reales** en cada presentación.
- [ ] 🟠 **Stock/cupos iniciales** (granola = unidades; tortas = cupos de pedidos que Nelly acepta; ver Anexo 3).
- [ ] 🟠 **WhatsApp real** en Render y `.env.local` (`NEXT_PUBLIC_WHATSAPP_NUMBER`) — activa los botones verdes y la sección de tortas personalizadas (se muestra sola).
- [ ] 🟠 **Zonas básicas de entrega** definidas (aunque sea la lista corta inicial en `DELIVERY_DISTRICTS`) y costos comunicados por WhatsApp.
- [ ] 🟠 **Métodos de pago** acordados (Yape/Plin/efectivo — se coordinan por WhatsApp, como está diseñado).
- [ ] 🟠 **Cuenta admin definitiva de Nelly** creada y promovida; accesos de prueba retirados.
- [ ] 🟠 **Fotos suficientes** (al menos 1 buena foto por producto activo; las ilustraciones cubren lo que falte).
- [ ] 🟠 **Productos y packs placeholder desactivados** cuando los reales estén activos (Anexo 1).
- [ ] 🟠 **Pedido de prueba como invitado** en producción (flujo completo hasta WhatsApp real).
- [ ] 🟠 **Pedido de prueba con cuenta registrada** (correo).
- [ ] 🟠 **Pedido/login de prueba con Google.**
- [ ] 🟠 **Estados y stock probados con Nelly**: confirmar → preparar → en camino → entregado, y una cancelación verificando que el cupo/stock se repone.

## ETAPA 2 — Lanzamiento público

> Todo lo anterior más:

- [ ] 🔴 **Dominio propio** (actualizar `NEXT_PUBLIC_SITE_URL`, Site URL/Redirects en Supabase, OAuth de Google y docs).
- [ ] 🔴 **SMTP propio + dominio de envío verificado** (SPF/DKIM) — Anexo 2.
- [ ] 🔴 **Plantilla "Confirm signup" con TokenHash** aplicada y revalidada (Anexo 2).
- [ ] 🔴 **Logo definitivo** + favicon + imagen Open Graph reales.
- [ ] 🔴 **Políticas publicadas** (pedidos, pagos, cancelaciones, entregas, personalizados — sección J).
- [ ] 🔴 **Alérgenos revisados** en todos los productos publicados.
- [ ] 🔴 **Textos finales** (historia real de Nelly en `/nosotros`, FAQ completa sin TODOs).
- [ ] 🔴 **Search Console**: propiedad verificada y `sitemap.xml` enviado.
- [ ] 🔴 **Publicación definitiva de la app de Google Auth** (pantalla de consentimiento en producción, con dominio propio).
- [ ] 🔴 **Backups**: revisar la política del plan de Supabase (y plan de hosting de Render — Anexo 5).
- [ ] 🔴 **Revisión completa con Nelly**: ella opera catálogo y pedidos sola, en su celular.

---

## Cuestionario para la reunión con Nelly

**Estado de cada punto** — todos comienzan en `[P]`; ve reemplazando la letra:

- `[P]` Pendiente de definir con Nelly · `[R]` Información recibida · `[C]` Cargado en Naturelly · `[V]` Validado en producción

Marca el checkbox `[x]` cuando llegue a `[V]` (o `[C]` si no aplica validación).

**Prioridad:** 🟠 necesario para el **uso interno** · 🔴 obligatorio antes del **lanzamiento público** · 🟡 recomendado, puede esperar · 🔵 función futura.

### A. Decisiones principales de la marca

- [ ] `[P]` 🟡 Nombre comercial: "Naturelly" y el lema "Delicias artesanales hechas por Nelly" ya están aprobados por Alonso — validar con Nelly que le gustan. — Respuesta:
- [ ] `[P]` 🟡 Frase principal del hero (hoy: "De la cocina de Nelly, para compartir"). ¿La aprueba o propone otra? — Respuesta:
- [ ] `[P]` 🔴 Propuesta de valor: ¿qué hace diferentes sus productos, con sus palabras? (sin exagerar ni inventar) — Respuesta:
- [ ] `[P]` 🔴 ¿Cómo quiere presentarse Nelly? (¿con su nombre y foto, solo el nombre, o solo la marca?) — Respuesta:
- [ ] `[P]` 🟡 Público objetivo: ¿a quién le vende hoy y a quién quiere llegar? — Respuesta:
- [ ] `[P]` 🟡 Tono de comunicación: ¿cercano y casero (como está hoy), más elegante, más juvenil? — Respuesta:
- [ ] `[P]` 🟠 Productos del arranque interno: confirmar la lista (granola + torta de zanahoria + torta de chocolate + torta de naranja + personalizadas por cotización). — Respuesta:
- [ ] `[P]` 🟠 Productos que NO quiere vender todavía (para no publicarlos por error). — Respuesta:

### B. Granola artesanal

- [ ] `[P]` 🟠 Nombre definitivo de la granola (los nombres actuales de la web son de prueba). — Respuesta:
- [ ] `[P]` 🟠 Descripción corta (para la tarjeta) y descripción completa (para su página). — Respuesta:
- [ ] `[P]` 🟠 Receta e ingredientes exactos, en orden. — Respuesta:
- [ ] `[P]` 🟠 Alérgenos (frutos secos, gluten, etc.) — se publican dentro de ingredientes/descripción. — Respuesta:
- [ ] `[P]` 🟠 ¿Con qué se endulza? (la web YA NO afirma "solo miel" hasta que Nelly lo confirme). — Respuesta:
- [ ] `[P]` 🟠 Presentaciones reales y peso de cada una (¿bolsa? ¿250 g / 500 g u otros?). — Respuesta:
- [ ] `[P]` 🟠 Precio de cada presentación. — Respuesta:
- [ ] `[P]` 🟠 Stock inicial de cada presentación (o cuántas puede producir por semana). — Respuesta:
- [ ] `[P]` 🔴 ¿Cuánto dura la granola desde que se hace? — Respuesta:
- [ ] `[P]` 🟡 ¿Cómo se conserva? (indicación para el cliente) — Respuesta:
- [ ] `[P]` 🟠 Disponibilidad: ¿siempre hay, o se hace por tandas/encargo? — Respuesta:
- [ ] `[P]` 🟡 Tiempo de preparación de una tanda (si es por encargo). — Respuesta:
- [ ] `[P]` 🟡 ¿Acepta pedidos grandes (p. ej. 10+ bolsas)? ¿Con cuánta anticipación? — Respuesta:
- [ ] `[P]` 🔵 Información nutricional — SOLO si tiene datos reales; si no, no se publica. — Respuesta:
- [ ] `[P]` 🟡 Beneficios que SÍ pueden afirmarse sin exagerar (p. ej. "sin conservantes" solo si es verdad). — Respuesta:
- [ ] `[P]` 🟠 Fotografías: bolsa/empaque, granola servida, detalle de textura (guía en `BRAND_GUIDE.md`). — Respuesta:

### C. Torta de zanahoria (carrot cake)

- [ ] `[P]` 🟠 Tamaños disponibles (diámetro o nombre del molde). — Respuesta:
- [ ] `[P]` 🟠 Porciones aproximadas por tamaño. — Respuesta:
- [ ] `[P]` 🟠 Ingredientes (incluye si lleva frutos secos, pasas, etc.). — Respuesta:
- [ ] `[P]` 🟠 Relleno (¿lleva? ¿de qué?). — Respuesta:
- [ ] `[P]` 🟠 Cobertura (¿frosting de queso crema u otra?). — Respuesta:
- [ ] `[P]` 🟡 Decoraciones posibles sin costo extra. — Respuesta:
- [ ] `[P]` 🟠 Precio por tamaño. — Respuesta:
- [ ] `[P]` 🟠 Tiempo de anticipación mínimo para pedirla. — Respuesta:
- [ ] `[P]` 🟡 Conservación (¿refrigerada?) y duración recomendada. — Respuesta:
- [ ] `[P]` 🟠 Alérgenos. — Respuesta:
- [ ] `[P]` 🟠 Disponibilidad (¿cualquier día? ¿solo con encargo?). — Respuesta:
- [ ] `[P]` 🟠 Fotografías: torta entera, porción/corte, detalle de cobertura. — Respuesta:

### D. Torta de chocolate

- [ ] `[P]` 🟠 Tamaños disponibles. — Respuesta:
- [ ] `[P]` 🟠 Porciones por tamaño. — Respuesta:
- [ ] `[P]` 🟠 Ingredientes. — Respuesta:
- [ ] `[P]` 🟠 Relleno (¿fudge, manjar, otro?). — Respuesta:
- [ ] `[P]` 🟠 Cobertura. — Respuesta:
- [ ] `[P]` 🟡 Decoraciones posibles sin costo extra. — Respuesta:
- [ ] `[P]` 🟠 Precio por tamaño. — Respuesta:
- [ ] `[P]` 🟠 Anticipación mínima. — Respuesta:
- [ ] `[P]` 🟡 Conservación y duración. — Respuesta:
- [ ] `[P]` 🟠 Alérgenos. — Respuesta:
- [ ] `[P]` 🟠 Disponibilidad. — Respuesta:
- [ ] `[P]` 🟠 Fotografías: entera, porción, detalle. — Respuesta:

### E. Torta de naranja

- [ ] `[P]` 🟠 Tamaños disponibles. — Respuesta:
- [ ] `[P]` 🟠 Porciones por tamaño. — Respuesta:
- [ ] `[P]` 🟠 Ingredientes. — Respuesta:
- [ ] `[P]` 🟠 Relleno (si lleva). — Respuesta:
- [ ] `[P]` 🟠 Cobertura o glaseado. — Respuesta:
- [ ] `[P]` 🟡 Decoraciones posibles sin costo extra. — Respuesta:
- [ ] `[P]` 🟠 Precio por tamaño. — Respuesta:
- [ ] `[P]` 🟠 Anticipación mínima. — Respuesta:
- [ ] `[P]` 🟡 Conservación y duración. — Respuesta:
- [ ] `[P]` 🟠 Alérgenos. — Respuesta:
- [ ] `[P]` 🟠 Disponibilidad. — Respuesta:
- [ ] `[P]` 🟠 Fotografías: entera, porción, detalle. — Respuesta:

### F. Tortas personalizadas y fondant

> Ya existe la sección "Tortas personalizadas — Decoraciones sencillas con fondant —
> Cotizar por WhatsApp" (se publica sola cuando haya WhatsApp real). Sin precio fijo,
> sin carrito, sin configurador. Estas respuestas afinan el texto y las reglas.

- [ ] `[P]` 🟠 ¿Qué tipo de figuras sencillas puede hacer? (ejemplos concretos: animales, flores, números…) — Respuesta:
- [ ] `[P]` 🟠 ¿Qué figuras o estilos NO acepta? (para decirlo claro y evitar malentendidos) — Respuesta:
- [ ] `[P]` 🟠 Nivel máximo de complejidad que se compromete a entregar. — Respuesta:
- [ ] `[P]` 🟠 Tamaños de torta disponibles para personalizar. — Respuesta:
- [ ] `[P]` 🟠 Sabores disponibles para la torta base (¿solo los tres o más?). — Respuesta:
- [ ] `[P]` 🟡 Cantidad máxima de figuras por torta. — Respuesta:
- [ ] `[P]` 🟡 Colores con los que trabaja normalmente. — Respuesta:
- [ ] `[P]` 🟡 ¿Escribe textos o nombres en la torta? — Respuesta:
- [ ] `[P]` 🟡 ¿Acepta fotos de referencia del cliente? ¿Cómo las maneja (parecido aproximado, no copia exacta)? — Respuesta:
- [ ] `[P]` 🟠 Anticipación mínima para un pedido personalizado. — Respuesta:
- [ ] `[P]` 🟠 Rango de precios aproximado (desde / hasta) para orientar al cliente. — Respuesta:
- [ ] `[P]` 🟠 ¿Cómo quiere cotizar? (¿qué datos necesita del cliente para dar precio?) — Respuesta:
- [ ] `[P]` 🟠 ¿Pide adelanto? ¿De cuánto? — Respuesta:
- [ ] `[P]` 🔴 Política de cambios (¿hasta cuándo se puede cambiar el diseño?). — Respuesta:
- [ ] `[P]` 🔴 Política de cancelación (¿se devuelve el adelanto?). — Respuesta:
- [ ] `[P]` 🟡 Fotografías de trabajos anteriores con fondant (para mostrar el estilo real). — Respuesta:

### G. Operación

- [ ] `[P]` 🟠 Días y horarios de atención (respuesta de pedidos). — Respuesta:
- [ ] `[P]` 🟠 Días en los que produce (¿hornea todos los días?). — Respuesta:
- [ ] `[P]` 🟠 ¿Qué productos requieren pedido con anticipación y cuánta? — Respuesta:
- [ ] `[P]` 🟡 Capacidad máxima semanal (cuántas tortas/tandas puede asumir sin quedar mal). — Respuesta:
- [ ] `[P]` 🟡 Días no disponibles (descanso, viajes, fechas bloqueadas). — Respuesta:
- [ ] `[P]` 🟡 ¿Acepta pedidos urgentes (mismo día / día siguiente)? ¿Con recargo? — Respuesta:
- [ ] `[P]` 🟠 Recojo: ¿hay punto de recojo? ¿Dónde y en qué horarios? — Respuesta:
- [ ] `[P]` 🟠 Delivery: ¿quién entrega (ella, motorizado, taxi)? — Respuesta:
- [ ] `[P]` 🟠 Zonas (distritos) donde entrega. — Respuesta:
- [ ] `[P]` 🟠 Costo de delivery por zona. — Respuesta:
- [ ] `[P]` 🔴 Responsable de las entregas y qué pasa si el cliente no está. — Respuesta:
- [ ] `[P]` 🔵 ¿Pedidos fuera de Arequipa? (hoy la web dice que no; confirmar que se queda así). — Respuesta:

### H. Pagos

- [ ] `[P]` 🟠 ¿Acepta Yape? ¿A qué número/nombre? — Respuesta:
- [ ] `[P]` 🟠 ¿Acepta Plin? — Respuesta:
- [ ] `[P]` 🟡 ¿Acepta transferencia bancaria? ¿Qué banco(s)? — Respuesta:
- [ ] `[P]` 🟠 ¿Acepta efectivo contra entrega? — Respuesta:
- [ ] `[P]` 🟠 ¿Cuándo pide adelanto y cuándo pago total? (sobre todo en tortas) — Respuesta:
- [ ] `[P]` 🟡 ¿Pide comprobante de pago (captura) antes de preparar? — Respuesta:
- [ ] `[P]` 🔴 Política de devolución del dinero (¿en qué casos devuelve?). — Respuesta:

### I. WhatsApp y contacto

- [ ] `[P]` 🟠 Número de WhatsApp definitivo del negocio (hoy placeholder; botones verdes deshabilitados). — Respuesta:
- [ ] `[P]` 🟡 Nombre que se mostrará en WhatsApp (¿"Naturelly", "Nelly — Naturelly"?). — Respuesta:
- [ ] `[P]` 🟡 ¿Quiere mensaje de bienvenida automático en WhatsApp Business? — Respuesta:
- [ ] `[P]` 🟡 Horario en el que responde WhatsApp (para la web y manejar expectativas). — Respuesta:
- [ ] `[P]` 🟡 Instagram del negocio (si existe o si va a crear uno). — Respuesta:
- [ ] `[P]` 🟡 Facebook (si existe). — Respuesta:
- [ ] `[P]` 🟡 Correo del negocio. — Respuesta:
- [ ] `[P]` 🟡 Dirección o punto de recojo — SOLO si desea mostrarlo públicamente. — Respuesta:

### J. Políticas (para publicar en la Etapa 2)

- [ ] `[P]` 🔴 Política de pedidos (mínimos, cómo se confirma, cuándo queda "cerrado"). — Respuesta:
- [ ] `[P]` 🔴 Política de pagos (adelantos, plazos). — Respuesta:
- [ ] `[P]` 🔴 Política de cancelaciones (hasta cuándo; qué pasa con el adelanto). — Respuesta:
- [ ] `[P]` 🔴 Política de cambios en el pedido. — Respuesta:
- [ ] `[P]` 🔴 Política de entregas (rangos de hora, qué pasa si nadie recibe). — Respuesta:
- [ ] `[P]` 🔴 Política de personalizados (el diseño aprobado es el que se entrega, parecido razonable). — Respuesta:
- [ ] `[P]` 🔴 ¿Qué pasa si hay un error en el pedido (de ella o del cliente)? — Respuesta:
- [ ] `[P]` 🟡 Indicaciones de conservación que el cliente debe seguir. — Respuesta:
- [ ] `[P]` 🔴 Responsabilidad por alérgenos: texto claro tipo "elaborado en una cocina donde se manipulan frutos secos, gluten…" (confirmar cuáles). — Respuesta:
- [ ] `[P]` 🟡 Privacidad de datos: los datos del cliente solo se usan para el pedido (la web ya opera así). — Respuesta:

### K. Historia de Nelly y Naturelly

- [ ] `[P]` 🔴 ¿Cómo comenzó todo? — Respuesta:
- [ ] `[P]` 🔴 ¿Desde cuándo prepara estos productos? — Respuesta:
- [ ] `[P]` 🟡 ¿Por qué empezó (motivación real)? — Respuesta:
- [ ] `[P]` 🟡 ¿Quiénes fueron sus primeros clientes? (hoy la web dice que empezó con familiares y amigos — confirmar). — Respuesta:
- [ ] `[P]` 🔴 ¿Qué hace diferentes sus productos, en sus palabras? — Respuesta:
- [ ] `[P]` 🟡 ¿Cómo es su proceso artesanal (paso a paso simple)? — Respuesta:
- [ ] `[P]` 🟡 Un mensaje personal de Nelly para sus clientes (1-3 frases, con su voz). — Respuesta:
- [ ] `[P]` 🔴 ¿Qué información NO desea publicar? (privacidad primero). — Respuesta:

### L. Recursos visuales

- [ ] `[P]` 🔴 Logo definitivo (hoy: wordmark tipográfico temporal — suficiente para uso interno). — Respuesta:
- [ ] `[P]` 🟡 Versiones del logo (fondo claro/oscuro, ícono solo). — Respuesta:
- [ ] `[P]` 🟡 Paleta final: ¿aprueba la actual (crema + amarillo + tinta, "Bright Wellness")? — Respuesta:
- [ ] `[P]` 🟠 Fotos de cada producto activo (granola y cada torta) — mínimo 1 buena por producto. — Respuesta:
- [ ] `[P]` 🟡 Fotos de las presentaciones de granola (cada tamaño/empaque). — Respuesta:
- [ ] `[P]` 🟠 Fotos de tortas completas. — Respuesta:
- [ ] `[P]` 🟡 Fotos de porciones/cortes. — Respuesta:
- [ ] `[P]` 🟡 Fotos de trabajos con fondant ya entregados. — Respuesta:
- [ ] `[P]` 🟡 Foto de Nelly — solo si desea aparecer. — Respuesta:
- [ ] `[P]` 🔵 Fotos del proceso (manos, horno, cocina). — Respuesta:
- [ ] `[P]` 🔴 Imagen Open Graph definitiva (hoy temporal). — Respuesta:
- [ ] `[P]` 🔴 Favicon definitivo derivado del logo. — Respuesta:
- [ ] `[P]` 🟠 Textos alternativos descriptivos al subir cada foto (el panel los exige; ej. "Torta de zanahoria de 20 cm con frosting"). — Respuesta:

### M. Catálogo y administración

- [ ] `[P]` 🟠 Productos ACTIVOS desde el arranque interno. — Respuesta:
- [ ] `[P]` 🟠 Variantes de cada producto (presentaciones de granola / tamaños de torta con porciones). — Respuesta:
- [ ] `[P]` 🟠 Precio de cada variante. — Respuesta:
- [ ] `[P]` 🟠 Stock inicial (granola = unidades; tortas = cupos, ver Anexo 3). — Respuesta:
- [ ] `[P]` 🟠 ¿Qué productos son SOLO por encargo? (se indica en su descripción + anticipación). — Respuesta:
- [ ] `[P]` 🟡 Regla para "agotado temporal": stock en 0 o desactivar la variante. — Respuesta:
- [ ] `[P]` 🟡 Packs reales que quiera ofrecer (si ninguno, `/packs` queda con su estado vacío — no inventar combos). — Respuesta:
- [ ] `[P]` 🟠 ¿Quién actualizará el stock/cupos día a día? — Respuesta:
- [ ] `[P]` 🟠 ¿Quién revisará los pedidos nuevos y cada cuánto? — Respuesta:
- [ ] `[P]` 🟠 ¿Quién cambiará los estados (confirmado → en preparación → en camino → entregado)? — Respuesta:
- [ ] `[P]` 🟠 Cuenta administradora definitiva de Nelly (correo real; se promueve a admin; ella define su contraseña). — Respuesta:

### N. Cierre de etapa

- [ ] `[P]` 🟠 Todos los ítems de la **Etapa 1** en verde → empezar el uso interno.
- [ ] `[P]` 🔴 Todos los ítems de la **Etapa 2** en verde → lanzamiento público.
- [ ] `[P]` 🔴 Fecha de lanzamiento público acordada con Nelly. — Respuesta:

---

## Anexo 1 — Inventario de datos placeholder (estado real al 2026-07-04)

Todos los productos y packs actuales son **datos de prueba**. Nada se borra (los
pedidos históricos los referencian): se **desactiva** desde el panel. **Preferencia
acordada: crear productos NUEVOS para el catálogo real** (evita confusión con los
snapshots históricos); reutilizar un registro solo si es seguro y no confunde.

| Elemento | Estado | Pedidos históricos | Qué hacer |
|---|---|---|---|
| "Clásica de Miel" (`clasica-de-miel`) | **Activo** (placeholder) | Sí (7 ítems) | Desactivar cuando la granola real esté activa. |
| "Cholo Power" (`andina-power`, renombrado en pruebas) | **Activo** (placeholder) | Sí (5 ítems) | Desactivar cuando existan productos reales. |
| "Cacao & Café" (`cacao-cafe`) | **Activo** (placeholder) | Sí (2 ítems) | Desactivar cuando existan productos reales. |
| "Granola granolera" (`granola-granolera`, prueba interna) | **Desactivado** (2026-07-04, sin pedidos) | No | Dejar desactivado. |
| "Pack Trío Naturelly" (`pack-trio-naturelly`) | **Activo** (placeholder) | Sí (1 ítem) | Desactivar antes del uso interno (promete "tres granolas" inexistentes); `/packs` mostrará su estado vacío. |
| "Pack de prueba interna EDITADO" | Desactivado | Sí (1 ítem) | Dejar como histórico. |
| "Pack duo" (`pack-duo`, prueba interna) | **Desactivado** (2026-07-04, sin pedidos) | No | Dejar desactivado. |
| Pedidos `NAT-*` de prueba | En BD | — | Quedan como histórico (los pedidos jamás se borran). |
| Nº WhatsApp | Placeholder `51XXXXXXXXX` | — | Cargar en Render + `.env.local` + `site_settings.whatsapp_number` (Etapa 1). |
| Distritos delivery | 3 de ejemplo en `src/lib/constants.ts` | — | Reemplazar con la lista real (G) + `site_settings.delivery_districts`. |
| Costo de delivery | S/ 0 (se coordina por WhatsApp) | — | Cobrarlo online requiere cambio futuro en `create_order` (no bloquea). |
| FAQ | 6 preguntas, algunas con `TODO` | — | Completar con G, H y J. |
| Historia en `/nosotros` | Párrafo "muy pronto…" | — | Reemplazar con K (Etapa 2; para uso interno basta lo actual). |
| Imagen OG / favicon | Temporales | — | Reemplazar con el logo real (Etapa 2). |
| Seed `supabase/seed.sql` | Datos provisionales | — | Solo entornos de desarrollo nuevos; no tocar producción. |

## Anexo 2 — SMTP propio + plantilla de confirmación (Etapa 2 — NO bloquea el uso interno)

Para el **uso interno**, el correo predeterminado de Supabase alcanza: pocos
registros por día, y la web ya maneja bien el caso del enlace consumido (mensaje
claro en `/login` + botón "Reenviar correo de confirmación" con cooldown). Límite a
tener en cuenta: ~2-4 correos de auth por hora.

Antes del **lanzamiento público** es obligatorio:

1. Configurar **SMTP propio** (Resend o SES, ya contemplado en `TECH_STACK.md`) en Supabase → Authentication → SMTP.
2. **Verificar el dominio de envío** (SPF/DKIM) para que los correos no caigan a spam.
3. Reemplazar la plantilla **Confirm signup** (Authentication → Emails) por la versión con `TokenHash`, compatible con el flujo SSR (`/auth/callback` ya soporta `token_hash` + `type` con `verifyOtp`):
   ```html
   <h2>Confirma tu correo</h2>
   <p>¡Hola! Gracias por crear tu cuenta en Naturelly.</p>
   <p>Para terminar, confirma tu correo con este enlace:</p>
   <p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">Confirmar mi correo</a></p>
   <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
   ```
   Se usa `{{ .RedirectTo }}` (no `{{ .SiteURL }}`) para que el enlace conserve el origen desde el que se registró el usuario; es seguro porque el código siempre envía `emailRedirectTo` con `?next=`.
4. **Revalidar con un correo externo real**: confirmación de registro (debe terminar en `/cuenta` con sesión) y recuperación de contraseña.

## Anexo 3 — Cómo se representa el catálogo real (decisiones cerradas)

- **Categorías**: `granola`, `torta`, `personalizado` (migración `20260704120000`, pendiente de aplicar). Las categorías antiguas quedan solo para los placeholders.
- **Granola** → producto con variantes por presentación; `weight_grams` con el peso real; `stock` = unidades disponibles.
- **Tortas** → un producto por torta, variantes por tamaño en `size_label` ("Pequeña — 8 porciones", "Mediana — 12 porciones", "Grande — 20 porciones"); `weight_grams` vacío (NULL); **`stock` = cupos de producción**: `5` significa "Nelly acepta hasta 5 pedidos de esta torta por ahora", `0` significa "no acepto más por el momento". Ella lo ajusta desde el panel; el checkout valida y la cancelación repone el cupo igual que siempre. **Sin calendarios ni reservas.**
- **Tortas personalizadas** → NO son un producto comprable. Ya existe la sección informativa (`CustomCakesSection` en `/tienda`): decoración sencilla con fondant, diseños sujetos a evaluación, coordinación de tamaño/sabor/decoración y botón "Cotizar por WhatsApp". **Se publica sola cuando `NEXT_PUBLIC_WHATSAPP_NUMBER` deje de ser placeholder**; sin precio, sin carrito, sin configurador. No se agregó columna `quote_only`: no hace falta porque no participa del catálogo comprable.
- **`/packs`**: técnicamente disponible con estado vacío correcto; fuera de protagonismo hasta que Nelly defina promociones reales. No inventar combos.
- **`/recetas`**: existe pero fuera de la navegación principal (Fase 2).

## Anexo 4 — Migración `20260704120000_real_categories.sql` (creada; PENDIENTE de aprobación para `db push`)

Estado: archivo creado en `supabase/migrations/`, **dry-run limpio** (solo esa
migración saldría), `DATABASE_SCHEMA.md` ya actualizado, código del panel y tipos ya
adaptados. **No se aplica sin aprobación expresa de Alonso.**

```sql
alter table public.products drop constraint products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('granola', 'torta', 'personalizado',
                      'clasica', 'andina', 'chocolate', 'especial'));
alter table public.product_variants alter column weight_grams drop not null;
```

- **No toca datos**: conserva productos, variantes, precios, stock, pedidos e `order_items`; solo amplía el CHECK y relaja un NOT NULL.
- **Rollback** (solo posible si aún no hay filas con categorías nuevas ni `weight_grams` NULL):
  ```sql
  alter table public.products drop constraint products_category_check;
  alter table public.products add constraint products_category_check
    check (category in ('clasica', 'andina', 'chocolate', 'especial'));
  alter table public.product_variants alter column weight_grams set not null;
  ```
- Tras aplicar: regenerar `src/types/database.ts` (`supabase gen types typescript --linked`). El panel ya ofrece las categorías nuevas y el peso opcional — **no crear productos con categoría nueva o sin peso ANTES de aplicar la migración** (la BD los rechazaría).

## Anexo 5 — Recomendaciones que no bloquean ninguna etapa

- 🟡 **Plan de hosting**: el plan gratuito de Render duerme el servicio tras inactividad (arranques fríos de ~30–60 s); molesto incluso en uso interno — evaluar plan de pago o keep-alive.
- 🔵 **Fase 2**: blog/recetas gestionables, FAQ administrable, datos estructurados de producto, analytics, testimonios.
- 🔵 **Fase 3**: pagos online (Culqi vs Mercado Pago, Yape/Plin), correos transaccionales, páginas legales (T&C, privacidad, libro de reclamaciones — requisito legal para cobrar online en Perú).
- 🔵 **Mejoras opcionales**: rate limiting en `/api/pedidos`, columna de alérgenos, `compare_at_price`/`badge`/orden en packs, modo "por encargo" sin stock, monitoreo de errores.
