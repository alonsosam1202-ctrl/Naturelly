# Naturelly 🥣

Ecommerce artesanal premium para **Naturelly**, marca de granolas hechas a mano por Nelly en Arequipa, Perú. Construido con Next.js, TypeScript, Tailwind CSS y Supabase.

> Granola artesanal con superalimentos andinos, tostada en tandas pequeñas y endulzada solo con miel de abeja.

## ¿Qué es este proyecto?

Una tienda online completa que permite a los clientes descubrir la marca, explorar el catálogo, armar su carrito y realizar pedidos (fase 1: cierre por WhatsApp, con el pedido registrado en Supabase). Incluye cuentas de cliente con historial de pedidos y un panel de administración para que la fundadora gestione productos, precios, imágenes y pedidos sin tocar código.

## Problema que resuelve

Hoy los pedidos se gestionan de forma manual e informal (mensajes sueltos de WhatsApp, sin registro centralizado). Eso genera:

- Pedidos perdidos o mal anotados.
- Cero visibilidad de historial, clientes frecuentes o productos más vendidos.
- Una imagen de marca que no refleja la calidad premium del producto.

Este proyecto profesionaliza la marca con una experiencia de compra moderna, ordena los pedidos en una base de datos y deja lista la infraestructura para pagos online.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS |
| Backend / BD | Supabase (Postgres, Auth, Storage, RLS) |
| Estado del carrito | Zustand (persistido en localStorage) |
| Validación | Zod |
| Deploy | Render (https://naturelly.onrender.com) |

Detalle completo en [`TECH_STACK.md`](./TECH_STACK.md).

## Documentación

| Archivo | Contenido |
|---|---|
| [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) | Visión, alcance, funcionalidades, páginas y flujos |
| [`TECH_STACK.md`](./TECH_STACK.md) | Tecnologías, versiones y justificación |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Estructura de carpetas, rutas y componentes |
| [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) | Modelo de datos en Supabase + políticas RLS |
| [`BRAND_GUIDE.md`](./BRAND_GUIDE.md) | Identidad visual, paleta, tipografía y tono |
| [`ROADMAP.md`](./ROADMAP.md) | Fases de desarrollo |
| [`TODO.md`](./TODO.md) | Tareas pendientes por fase |
| [`CLAUDE.md`](./CLAUDE.md) | Contexto y reglas para desarrollo asistido por IA |

## Inicio rápido (una vez creado el proyecto)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Completar: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
# SUPABASE_SECRET_KEY (solo server), NEXT_PUBLIC_WHATSAPP_NUMBER

# 3. Correr en desarrollo
npm run dev
```

## Estado actual

🚧 **Fase 1 — MVP en desarrollo.** La tienda pública (catálogo, carrito, checkout y flujo de pedido por WhatsApp) ya está implementada y compila; funciona con catálogo placeholder mientras no se configure Supabase. Pendientes de la fase: crear el proyecto Supabase y aplicar migraciones, cuentas de cliente y panel admin. Ver [`TODO.md`](./TODO.md) y [`ROADMAP.md`](./ROADMAP.md).

## Licencia

Proyecto privado. Todos los derechos reservados a Naturelly.
