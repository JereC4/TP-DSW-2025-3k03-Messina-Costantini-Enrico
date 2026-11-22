# Documentación de la API

La API REST se documenta con **OpenAPI 3.0**, generada automáticamente desde los mismos schemas Zod que validan cada request (`apps/server/src/modules/*/*.schema.ts`), así la documentación no se desactualiza respecto del código.

| Recurso | URL |
|:-|:-|
| Swagger UI (interactivo) | https://tp-dsw-2025-3k03-messina-costantini.onrender.com/docs · local: http://localhost:3000/docs |
| Documento OpenAPI (JSON) | https://tp-dsw-2025-3k03-messina-costantini.onrender.com/docs/openapi.json |
| Copia versionada en el repo | [openapi.json](openapi.json) |

Regenerar la copia del repo: `pnpm --filter server docs:export`.

## Cómo probar endpoints protegidos

1. `POST /auth/login` con un usuario demo (ver [../deploy.md](../deploy.md)).
2. Copiar el `token` de la respuesta.
3. En Swagger UI, botón **Authorize** → pegar el token. Todas las llamadas siguientes llevan `Authorization: Bearer <token>`.

## Convenciones

- Respuestas JSON. IDs numéricos. Los importes (`DECIMAL`) viajan como string para no perder precisión. Las fechas civiles (`DATE`) viajan como ISO a medianoche UTC.
- Listados grandes paginados (`/servicios`, `/solicitudes`, `/usuarios`, `/contratistas`): `?page&pageSize` → `{ items, total, page, pageSize, totalPages }`.
- Errores siempre con la forma `{ "code": "...", "message": "...", "details": ... }`:

| HTTP | code | Cuándo |
|:-|:-|:-|
| 400 | `VALIDATION_ERROR` | body/query/params inválidos (`details` lista `{ path, message }`) |
| 400 | `FK_INVALID`, `ROLES_EXCLUYENTES`, `HECTAREAS_EXCEDIDAS`, `FECHAS_INVALIDAS`, `PASSWORD_INCORRECTA` | regla de negocio violada en la entrada |
| 401 | `UNAUTHORIZED` / `TOKEN_INVALID` | sin token, token vencido o inválido, usuario eliminado |
| 401 | `INVALID_CREDENTIALS` | login incorrecto |
| 403 | `FORBIDDEN` | sin el rol requerido o recurso de otro usuario |
| 404 | `NOT_FOUND` | recurso inexistente (o servicio inactivo para quien no es su dueño) |
| 409 | `DUPLICATE`, `IN_USE`, `INVALID_TRANSITION`, `LAST_ADMIN`, `LAST_PRICE`, `HECTAREAS_COMPROMETIDAS`, `NO_PRICE`, `NOT_COMPLETED`, `ALREADY_RATED` | conflicto con el estado actual |
| 429 | `TOO_MANY_REQUESTS` | más de 20 intentos de login/registro por IP en 15 minutos (solo en producción) |

## Matriz de permisos

| Recurso | Lectura | Escritura |
|:-|:-|:-|
| provincias, localidades, categorías, insumos | pública | ADMIN |
| usuarios | ADMIN | ADMIN (roles excluyentes productor/contratista; guard de último admin) |
| contratistas | pública, sin datos de contacto (cercanía por campo, provincia/localidad, categoría) | el contratista edita su bio en `PUT /auth/me` |
| servicios | pública (solo activos; el dueño ve los inactivos) | CONTRATISTA dueño o ADMIN; `DELETE` es baja lógica |
| precios | pública | CONTRATISTA dueño del servicio o ADMIN; no se borra el único precio vigente |
| campos | PRODUCTOR dueño, ADMIN, o contratista con una solicitud sobre el campo | PRODUCTOR dueño o ADMIN |
| solicitudes | productor (propias), contratista (recibidas), ADMIN (todas); el detalle incluye el contacto de la contraparte | crear: PRODUCTOR · aceptar/rechazar/completar: CONTRATISTA de la solicitud · cancelar: PRODUCTOR (pendiente o aceptada) o CONTRATISTA (aceptada), con motivo · borrar: ADMIN |
| valoraciones | pública (por contratista o por servicio, con promedio) | PRODUCTOR de una solicitud completada, una vez |
| /auth/me, /auth/me/password, /auth/me/resumen | el propio usuario | el propio usuario (sin roles ni email; la contraseña exige la actual) |
