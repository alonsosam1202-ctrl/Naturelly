# CLAUDE.md — Contexto y reglas para desarrollo asistido por IA

> Este archivo lo lee Claude Code automáticamente al trabajar en el proyecto. Es la fuente de verdad sobre CÓMO trabajar aquí. Ante cualquier conflicto, el orden de autoridad es: instrucciones del desarrollador en el chat → este archivo → el resto de la documentación.

## Qué es este proyecto

Ecommerce artesanal premium para **Naturelly**, marca de granolas hechas a mano por Nelly en Arequipa, Perú. Stack: Next.js 15 (App Router) + TypeScript estricto + Tailwind CSS + Supabase. Fase 1: pedidos registrados en Supabase que se confirman por WhatsApp. Leer `PROJECT_BRIEF.md` antes de cualquier tarea.

## Documentos que debes consultar

| Antes de... | Lee |
|---|---|
| Cualquier tarea | `PROJECT_BRIEF.md` |
| Tocar rutas, carpetas o componentes | `ARCHITECTURE.md` |
| Tocar base de datos o queries | `DATABASE_SCHEMA.md` |
| Escribir UI o textos | `BRAND_GUIDE.md` |
| Decidir qué hacer ahora | `ROADMAP.md` y `TODO.md` |

## Reglas de comportamiento (QUÉ NO HACER)

1. **NO copiar Purely Elizabeth.** Es la referencia de nivel, no de diseño. Prohibido replicar su layout, paleta, textos, fotos, estructura de navegación o nombres de producto. Si una decisión visual se parece demasiado, cámbiala y explica el cambio. Sí está permitido (y se espera) tomar inspiración de su **lógica**: producto protagonista, colores vivos por sabor, fotos apetecibles, sensación editorial y ecommerce premium.
2. **NO inventar datos del negocio.** Precios, nombres de producto, testimonios, cifras de ventas, direcciones y teléfonos reales vienen del desarrollador o de Nelly. Si falta un dato, usa un placeholder marcado (`TODO: confirmar con Nelly`) y repórtalo; no lo rellenes con inventos plausibles.
3. **NO saltarte fases.** No implementes pagos, suscripciones ni features de fases futuras "de paso". Las ideas nuevas van a `TODO.md` → backlog.
4. **NO confiar en el cliente.** Precios y totales se recalculan siempre en el servidor desde la BD. El carrito solo envía `variant_id` + `quantity`. Todo input externo se valida con Zod en el servidor aunque ya se haya validado en el cliente.
5. **NO exponer secretos.** `SUPABASE_SERVICE_ROLE_KEY` solo en código de servidor. Nunca en componentes cliente, nunca hardcodeado, nunca en logs.
6. **NO crear tablas ni columnas fuera de `DATABASE_SCHEMA.md`.** Si el esquema necesita cambiar, primero se actualiza el documento, luego la migración.
7. **NO desactivar RLS** ni crear políticas permisivas "temporales" para destrabar un bug.
8. **NO borrar datos de pedidos.** Los pedidos se cancelan (cambio de estado), jamás se eliminan.
9. **NO usar librerías nuevas sin justificarlo** en el chat primero. El stack de `TECH_STACK.md` es el aprobado.
10. **NO escribir UI en inglés.** Toda la interfaz, mensajes de error y textos van en español peruano según el tono de `BRAND_GUIDE.md`. El código (variables, funciones, commits) sí va en inglés.
11. **NO usar la estética de plantilla genérica** (gradientes morados, Inter por defecto, cards grises). Los tokens de `BRAND_GUIDE.md` son obligatorios.
12. **NO marcar tareas de `TODO.md` como hechas** sin que el código correspondiente exista y compile.

### Libertad creativa visual (SÍ HACER)

Las reglas duras de arriba (seguridad, Supabase, RLS, datos reales, precios en servidor, pedidos, fases) son inamovibles. En lo **visual**, en cambio, la IA tiene permiso y mandato para proponer direcciones creativas, modernas y premium:

- No limitarse a beige/marrón: puede usar más color, más contraste y acentos vivos por sabor.
- Puede proponer aire editorial, formas orgánicas, imágenes/mockups, microanimaciones y secciones dinámicas.
- Las animaciones deben ser progresivas y accesibles: CSS/SVG primero, `prefers-reduced-motion` respetado, sin ocultar contenido al SEO, sin videos pesados ni canvas para texto importante.
- Toda exploración visual se documenta en `BRAND_GUIDE.md` antes o junto con el código; los tokens siguen siendo la fuente de verdad.

## Convenciones de código

- TypeScript `strict`; prohibido `any` (usar `unknown` + narrowing si hace falta).
- Server Components por defecto; `"use client"` solo con interactividad real.
- Un componente por archivo; nombres `PascalCase`; hooks `useCamelCase`.
- Tailwind directo en JSX; si una combinación se repite 3+ veces, extraer componente (no `@apply`).
- Precios: siempre `numeric` en BD y formateo con helper `formatPrice()` (`S/ 18.00`); nunca aritmética de flotantes para dinero en lógica crítica (trabajar en céntimos si hay que operar).
- Fechas en `timestamptz`; mostrar en zona `America/Lima`.
- Commits: convención `feat: | fix: | docs: | refactor: | style: | chore:` con mensajes en inglés.
- Migraciones SQL numeradas y descriptivas en `supabase/migrations/`; nunca editar una migración ya aplicada.

## Flujo de trabajo esperado

1. Leer la tarea en `TODO.md` y su contexto en los docs.
2. Anunciar plan breve antes de tocar código si la tarea es grande.
3. Implementar respetando arquitectura y marca.
4. Verificar que compila (`npm run build` o al menos `tsc --noEmit`) antes de dar por cerrado.
5. Marcar la tarea en `TODO.md` y resumir qué se hizo y qué quedó pendiente.

## Contexto humano importante

- **Nelly (admin) no es técnica.** Cada pantalla del admin debe entenderse sin manual: labels claros, confirmaciones antes de acciones destructivas, mensajes de éxito visibles.
- **Los clientes compran desde el celular.** Mobile-first no es un lema: se desarrolla y revisa primero en 360–400 px.
- El desarrollador (Alonso) conoce Supabase, RLS y AWS; puede evaluar decisiones técnicas. Explicar las decisiones importantes, no sobre-explicar lo básico.
