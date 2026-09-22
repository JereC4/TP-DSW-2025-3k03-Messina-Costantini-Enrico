# Documentación — AgroApp (TP DSW 2025, 3k03)

Punto de entrada de la documentación exigida por la cátedra. Todo en Markdown dentro de este directorio.

## Grupo
* 53112 - Costantini, Jeremías
* 52911 - Messina, Tiziano Leonel

## Índice

| Contenido | Dónde |
|:-|:-|
| Propuesta actualizada (tema, modelo, alcance) | [../proposal.md](../proposal.md) |
| Modelo de dominio: glosario, DER (Mermaid), reglas y limitaciones | [modelo.md](modelo.md) |
| Auditoría de coherencia del negocio: los 53 hallazgos y cómo se resolvieron | [auditoria.md](auditoria.md) |
| Links a los PR | [pull-requests.md](pull-requests.md) |
| Instrucciones de instalación y ejecución | [instalacion.md](instalacion.md) |
| Registro de coordinación y avance por hito | [minutas/](minutas/) |
| Tracking de features, bugs e issues | [tracking.md](tracking.md) |
| Documentación de la API (OpenAPI + Swagger UI) | [api/README.md](api/README.md) |
| Evidencia de ejecución de tests automáticos | [tests/evidencia.md](tests/evidencia.md) |
| Deploy, URLs y credenciales de demo | [deploy.md](deploy.md) |
| Video de demo | [video.md](video.md) · guion en [video-guion.md](video-guion.md) |
| Pendientes y próximos pasos | [pendientes.md](pendientes.md) |

## Qué es AgroApp

Plataforma que conecta **productores** agropecuarios con **contratistas** rurales. El contratista publica sus servicios (siembra, cosecha, pulverización…) con precio por hectárea; el productor registra sus campos, busca contratistas cercanos y solicita el servicio indicando hectáreas, fechas e insumos. El sistema calcula los importes, gestiona el ciclo de vida de la solicitud y permite valorar el trabajo al terminar.

## Resumen técnico

- **Arquitectura**: monorepo pnpm + Turborepo. Backend y frontend agnósticos, comunicados por una API REST con JSON documentada con OpenAPI.
- **Backend** (`apps/server`): Node 22 + Express 5 + TypeScript. Capas por módulo: `router → controller → service → repository`. Validación con Zod en body, query y params; errores uniformes `{ code, message, details }`. Persistencia con **Prisma** sobre **MySQL** (Aiven en producción, Docker Percona en local) con `CHECK` constraints. Autenticación **JWT** propia con tres niveles de acceso (`ADMIN`, `PRODUCTOR`, `CONTRATISTA`) revalidados en cada request; `helmet`, rate limiting y CORS restringido. Ambientes vía `.env`.
- **Frontend** (`apps/web`): React 18 + Vite + TypeScript + **Tailwind** (mobile-first, tema claro/oscuro), Framer Motion, Headless UI y Leaflet. React Router con `ProtectedRoute` por rol, contexto de auth, capa de servicios tipada en `src/api`, componentes con input/output properties, feedback con toasts y diálogos accesibles.
- **Tests**: Vitest en back (114: unitarios + integración con Supertest sobre la DB) y front (24: componentes con Testing Library); **Playwright** para el e2e del negocio completo.

## Alcance implementado

| Req | Detalle |
|:-|:-|
| CRUD simple | Categoría de servicio, Insumo (con precio de referencia), Provincia, Usuario (con roles) |
| CRUD dependiente | Localidad → Provincia; Servicio → Categoría + Contratista; Precio → Servicio; Campo → Productor + Localidad; Solicitud → Servicio + Campo + Productor + Contratista (+ insumos) |
| Listado + detalle | Servicios filtrados por categoría, provincia y texto → detalle con categoría, contratista, historial de precios y valoraciones. Contratistas filtrados por cercanía al campo, provincia/localidad y categoría → perfil con servicios y opiniones. Campos del productor → detalle con mapa y solicitudes. Solicitudes filtradas por estado → detalle con las 6 clases involucradas e importes |
| CUU | 1. **Publicar un servicio** (contratista, con precio inicial y historial). 2. **Solicitar un servicio** (productor: campo propio, hectáreas, fechas, insumos con proveedor; importes calculados). 3. **Gestionar la solicitud** (aceptar con fecha, rechazar o cancelar con motivo, completar). 4. **Valorar el trabajo** (productor, una vez, promedio en perfil y catálogo). Cada CUU usa la información registrada por el anterior |
| Adicionales | Dashboard por rol con gráfico, mapa de campos, cercanía por localidad y por distancia real al campo, historial de eventos y avisos de la solicitud, confirmación del email al registrarse, modo oscuro, OpenAPI/Swagger, CI |
