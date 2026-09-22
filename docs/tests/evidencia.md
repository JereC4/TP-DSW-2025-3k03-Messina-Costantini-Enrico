# Evidencia de ejecución de tests automáticos

Ejecutados el 2026-09-22 en Windows 11, Node 24, contra la base local (Docker Percona 8) con el seed cargado, sobre `main` con todo lo mergeado hasta el PR #24.
Además, cada push y PR corre las suites de backend y frontend en GitHub Actions ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)); ver la pestaña *Actions* del repo.

## Resumen

| Suite | Herramienta | Archivos | Tests | Resultado |
|:-|:-|:-|:-|:-|
| Backend unitarios | Vitest | `apps/server/src/core/auth/auth.test.ts` (Jeremías), `apps/server/src/core/util/geo.test.ts`, `apps/server/src/modules/auth/resumen.test.ts`, `apps/server/src/modules/contratista/contratista.service.test.ts`, `apps/server/src/modules/servicio/servicio.service.test.ts`, `apps/server/src/modules/solicitud/solicitud.service.test.ts`, `apps/server/src/modules/usuario/usuario.service.test.ts` | 82 | ✅ 82/82 |
| Backend integración | Vitest + Supertest sobre `createApp()` y la DB | `apps/server/test/api.integration.test.ts` | 32 | ✅ 32/32 |
| Frontend componentes | Vitest + Testing Library (jsdom) | `apps/web/src/auth/ProtectedRoute.test.tsx`, `apps/web/src/pages/AuthPage.test.tsx` (el caso de confirmación de email es de Jeremías), `apps/web/src/components/ui/Stars.test.tsx`, `apps/web/src/components/ui/Charts.test.tsx`, `apps/web/src/components/NotificacionesMenu.test.tsx`, `apps/web/src/components/SolicitudTimeline.test.tsx` | 24 | ✅ 24/24 |
| Frontend end-to-end | Playwright (Chromium) | `apps/web/e2e/flujo.spec.ts` | 4 | ✅ 4/4 |

## Backend: `pnpm --filter server test`

```
✓ test/api.integration.test.ts > autenticación y errores > rechaza credenciales inválidas con 401 y el mismo mensaje
✓ test/api.integration.test.ts > autenticación y errores > valida el body con 400 y detalles
✓ test/api.integration.test.ts > autenticación y errores > rutas desconocidas devuelven 404 JSON
✓ test/api.integration.test.ts > autenticación y errores > GET /auth/me devuelve roles y perfil del subtipo sin password_hash
✓ test/api.integration.test.ts > autenticación y errores > el registro no permite ser productor y contratista a la vez ni ADMIN
✓ test/api.integration.test.ts > permisos y privacidad > un PRODUCTOR no puede escribir catálogos ni listar usuarios
✓ test/api.integration.test.ts > permisos y privacidad > el listado público de contratistas no expone email ni domicilio
✓ test/api.integration.test.ts > permisos y privacidad > el admin no puede quitarse el rol ADMIN siendo el único
✓ test/api.integration.test.ts > cercanía > sin radio filtra por la localidad del campo y cae a provincia si no hay nadie, e informa la distancia
✓ test/api.integration.test.ts > cercanía > con radio filtra por distancia real y ordena de más cerca a más lejos
✓ test/api.integration.test.ts > cercanía > el punto propio del contratista le gana al centro de su localidad y nunca se expone
✓ test/api.integration.test.ts > cercanía > amplía el radio cuando no hay nadie tan cerca
✓ test/api.integration.test.ts > cercanía > un campo sin coordenadas cae a la búsqueda por localidad y lo dice
✓ test/api.integration.test.ts > caso de uso completo > el contratista publica un servicio con precio inicial (vigente desde hoy)
✓ test/api.integration.test.ts > caso de uso completo > el productor registra un campo con localidad y coordenadas
✓ test/api.integration.test.ts > caso de uso completo > solicita con insumos: solo se cobran los del contratista y el precio sale del catálogo
✓ test/api.integration.test.ts > caso de uso completo > no acepta más hectáreas que las del campo ni insumos repetidos
✓ test/api.integration.test.ts > caso de uso completo > el contratista puede ver el campo de la solicitud; otro contratista no
✓ test/api.integration.test.ts > caso de uso completo > el productor no puede aceptar; el contratista acepta y se fija fecha_inicio
✓ test/api.integration.test.ts > caso de uso completo > no se puede reducir el campo por debajo de las hectáreas comprometidas
✓ test/api.integration.test.ts > caso de uso completo > no se puede valorar antes de completar; después sí, y una sola vez
✓ test/api.integration.test.ts > caso de uso completo > el historial registra alta, aceptación, completado y valoración con su actor
✓ test/api.integration.test.ts > caso de uso completo > cada cambio de estado le deja un aviso a la contraparte, y solo a ella
✓ test/api.integration.test.ts > caso de uso completo > marcar como leída baja el contador y no deja tocar avisos ajenos
✓ test/api.integration.test.ts > caso de uso completo > las notificaciones exigen sesión
✓ test/api.integration.test.ts > caso de uso completo > la ficha del campo resume trabajos, hectáreas e inversión solo para el dueño
✓ test/api.integration.test.ts > caso de uso completo > el precio de referencia se calcula con los servicios comparables del sistema
✓ test/api.integration.test.ts > caso de uso completo > solo un administrador otorga o quita la insignia de verificado
✓ test/api.integration.test.ts > caso de uso completo > el motivo de la cancelación queda en el historial
✓ test/api.integration.test.ts > caso de uso completo > el productor cancela una pendiente con motivo (obligatorio)
✓ test/api.integration.test.ts > caso de uso completo > desactivar el servicio lo saca del catálogo pero conserva el detalle para el dueño
✓ test/api.integration.test.ts > caso de uso completo > el resumen del dashboard cuenta por estado
✓ src/modules/contratista/contratista.service.test.ts > puntoDeContratista > el punto propio le gana al centro de la localidad
✓ src/modules/contratista/contratista.service.test.ts > puntoDeContratista > sin punto propio usa el centro de su localidad
✓ src/modules/contratista/contratista.service.test.ts > puntoDeContratista > sin ninguno de los dos no hay punto
✓ src/modules/contratista/contratista.service.test.ts > conDistancia > mide desde el origen y conserva de dónde salió cada punto
✓ src/modules/contratista/contratista.service.test.ts > filtrarPorRadio > deja afuera a los que superan el radio
✓ src/modules/contratista/contratista.service.test.ts > filtrarPorRadio > el borde exacto entra
✓ src/modules/contratista/contratista.service.test.ts > filtrarPorRadio > quien no tiene ubicación queda afuera, pero se cuenta
✓ src/modules/contratista/contratista.service.test.ts > ordenarPorDistancia > de más cerca a más lejos
✓ src/modules/contratista/contratista.service.test.ts > ordenarPorDistancia > los que no tienen distancia van al final
✓ src/modules/contratista/contratista.service.test.ts > ordenarPorDistancia > a igual distancia desempata por apellido
✓ src/modules/contratista/contratista.service.test.ts > paginarEnMemoria > corta la página pedida y conserva el total
✓ src/modules/contratista/contratista.service.test.ts > paginarEnMemoria > la última página puede venir incompleta
✓ src/modules/contratista/contratista.service.test.ts > paginarEnMemoria > una página fuera de rango devuelve vacío sin romper
✓ src/modules/contratista/contratista.service.test.ts > escaleraDeRadios > prueba el pedido, el doble y el cuádruple
✓ src/modules/contratista/contratista.service.test.ts > escaleraDeRadios > no se pasa del máximo ni repite valores
✓ src/modules/solicitud/solicitud.service.test.ts > calcularImportes > servicio = precio × hectáreas; solo suman los insumos que aporta el contratista
✓ src/modules/solicitud/solicitud.service.test.ts > calcularImportes > redondea a dos decimales
✓ src/modules/solicitud/solicitud.service.test.ts > puedeTransicionar (ciclo de vida por rol) > el contratista acepta, rechaza y completa
✓ src/modules/solicitud/solicitud.service.test.ts > puedeTransicionar (ciclo de vida por rol) > el productor cancela pendientes y aceptadas, pero no acepta ni completa
✓ src/modules/solicitud/solicitud.service.test.ts > puedeTransicionar (ciclo de vida por rol) > los estados finales no cambian, ni para admin
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > toma el productor del token, el contratista del servicio y el precio del catálogo
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > no cobra los insumos que aporta el productor
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > rechaza si el campo no pertenece al productor
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > rechaza si las hectáreas superan las del campo
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > rechaza si el servicio no tiene precio vigente o está inactivo
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > rechaza si un insumo no existe en el catálogo
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.create > rechaza si quien solicita no es productor
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.updateEstado > al aceptar, el contratista fija la fecha de inicio (hoy si no había)
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.updateEstado > el productor cancela con motivo
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.updateEstado > el productor no puede aceptar ni completar
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.updateEstado > no permite salir de un estado final
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.updateEstado > al completar fija fecha_fin y valida coherencia de fechas
✓ src/modules/solicitud/solicitud.service.test.ts > solicitudService.updateEstado > un tercero no puede ver ni tocar la solicitud
✓ src/modules/solicitud/solicitud.service.test.ts > historial de eventos > el alta registra quién creó la solicitud y con qué nombre
✓ src/modules/solicitud/solicitud.service.test.ts > historial de eventos > la transición guarda estado de origen, destino y motivo
✓ src/modules/solicitud/solicitud.service.test.ts > historial de eventos > sin motivo, el detalle queda nulo
✓ src/modules/solicitud/solicitud.service.test.ts > historial de eventos > un admin que interviene queda registrado como ADMIN
✓ src/modules/solicitud/solicitud.service.test.ts > historial de eventos > cada cambio de estado escribe su evento junto al cambio
✓ src/modules/solicitud/solicitud.service.test.ts > avisos en la aplicación > el alta le avisa al contratista, no al productor
✓ src/modules/solicitud/solicitud.service.test.ts > avisos en la aplicación > cuando el contratista acepta, el aviso va al productor
✓ src/modules/solicitud/solicitud.service.test.ts > avisos en la aplicación > cuando el productor cancela, el aviso va al contratista e incluye el motivo
✓ src/modules/solicitud/solicitud.service.test.ts > avisos en la aplicación > si interviene un administrador se avisa a las dos partes
✓ src/modules/solicitud/solicitud.service.test.ts > avisos en la aplicación > nunca se avisa a quien hizo el cambio
✓ src/modules/solicitud/solicitud.service.test.ts > avisos en la aplicación > el cuerpo nunca supera lo que entra en la columna
✓ src/core/auth/auth.test.ts > jwt > firma y verifica un token con el id del usuario
✓ src/core/auth/auth.test.ts > jwt > rechaza un token manipulado
✓ src/core/auth/auth.test.ts > requireAuth > responde 401 sin header Authorization
✓ src/core/auth/auth.test.ts > requireAuth > carga req.user con los roles actuales de la DB
✓ src/core/auth/auth.test.ts > requireAuth > responde 401 si el usuario del token ya no existe
✓ src/core/auth/auth.test.ts > requireAuth > responde 401 con un token inválido
✓ src/core/auth/auth.test.ts > requireRole > deja pasar si el usuario tiene alguno de los roles
✓ src/core/auth/auth.test.ts > requireRole > responde 403 si no tiene el rol
✓ src/core/auth/auth.test.ts > assertOwnerOrAdmin > permite al dueño y al admin
✓ src/core/auth/auth.test.ts > assertOwnerOrAdmin > lanza 403 a un tercero
✓ src/modules/usuario/usuario.service.test.ts > assertRolesValidos > permite ADMIN con un rol de negocio
✓ src/modules/usuario/usuario.service.test.ts > assertRolesValidos > rechaza productor + contratista
✓ src/modules/usuario/usuario.service.test.ts > usuarioService guards > no deja quitar el rol ADMIN al único admin
✓ src/modules/usuario/usuario.service.test.ts > usuarioService guards > no deja eliminar al único admin
✓ src/modules/usuario/usuario.service.test.ts > usuarioService guards > no deja quitar PRODUCTOR si tiene campos
✓ src/modules/usuario/usuario.service.test.ts > usuarioService guards > el usuario público nunca incluye password_hash y aplana los roles
✓ src/core/util/geo.test.ts > haversineKm > el mismo punto está a cero
✓ src/core/util/geo.test.ts > haversineKm > Rosario a Córdoba son unos 375 km en línea recta
✓ src/core/util/geo.test.ts > haversineKm > Rosario a Buenos Aires son unos 278 km
✓ src/core/util/geo.test.ts > haversineKm > es simétrica
✓ src/core/util/geo.test.ts > haversineKm > un grado de latitud son unos 111 km, en cualquier longitud
✓ src/core/util/geo.test.ts > haversineKm > mide bien cruzando el ecuador y el meridiano
✓ src/core/util/geo.test.ts > puntoDe > convierte los Decimal de Prisma en números
✓ src/core/util/geo.test.ts > puntoDe > sin alguna de las dos coordenadas no hay punto
✓ src/core/util/geo.test.ts > puntoDe > un valor no numérico devuelve null, nunca NaN
✓ src/core/util/geo.test.ts > puntoDe > el cero es una coordenada válida
✓ src/core/util/geo.test.ts > redondearKm > deja un decimal
✓ src/modules/auth/resumen.test.ts > serieMensual > devuelve siempre los seis meses, incluidos los vacíos
✓ src/modules/auth/resumen.test.ts > serieMensual > acumula cantidad e importe en el mes que corresponde
✓ src/modules/auth/resumen.test.ts > serieMensual > ignora lo que cae fuera de la ventana y lo que no tiene fecha
✓ src/modules/auth/resumen.test.ts > serieMensual > cruza bien el cambio de año
✓ src/modules/servicio/servicio.service.test.ts > estadisticasPrecio > calcula promedio, mínimo y máximo
✓ src/modules/servicio/servicio.service.test.ts > estadisticasPrecio > redondea el promedio a dos decimales
✓ src/modules/servicio/servicio.service.test.ts > estadisticasPrecio > sin comparables devuelve null, que es distinto de un promedio cero
✓ src/modules/servicio/servicio.service.test.ts > desvioPorcentual > un precio por encima del promedio da positivo
✓ src/modules/servicio/servicio.service.test.ts > desvioPorcentual > un precio por debajo da negativo
✓ src/modules/servicio/servicio.service.test.ts > desvioPorcentual > redondea a un decimal
✓ src/modules/servicio/servicio.service.test.ts > desvioPorcentual > con promedio cero no divide por cero

Test Files  8 passed (8)
Tests  114 passed (114)
Duration  14.92s
```

## Frontend componentes: `pnpm --filter web test`

```
✓ src/components/ui/Charts.test.tsx > BarChart > dibuja una columna por período con su etiqueta
✓ src/components/ui/Charts.test.tsx > BarChart > expone los valores en una tabla para lectores de pantalla
✓ src/components/ui/Charts.test.tsx > BarChart > sin datos muestra el mensaje de vacío en vez de un gráfico en blanco
✓ src/components/ui/Charts.test.tsx > BarChart > con todos los valores en cero también muestra el vacío
✓ src/components/ui/Stars.test.tsx > Stars > muestra el valor y la cantidad
✓ src/auth/ProtectedRoute.test.tsx > ProtectedRoute > redirige a /ingresar cuando no hay sesión
✓ src/auth/ProtectedRoute.test.tsx > ProtectedRoute > muestra 403 cuando el usuario no tiene el rol requerido
✓ src/auth/ProtectedRoute.test.tsx > ProtectedRoute > renderiza el contenido cuando el usuario tiene el rol
✓ src/auth/ProtectedRoute.test.tsx > ProtectedRoute > muestra el spinner mientras valida la sesión
✓ src/components/SolicitudTimeline.test.tsx > SolicitudTimeline > lista cada evento con su autor y su motivo
✓ src/components/SolicitudTimeline.test.tsx > SolicitudTimeline > marca como aproximados los eventos reconstruidos por el backfill
✓ src/components/SolicitudTimeline.test.tsx > SolicitudTimeline > sin eventos muestra solo el resumen de pasos
✓ src/components/NotificacionesMenu.test.tsx > NotificacionesMenu > sin sesión no se muestra ni consulta la API
✓ src/components/ui/Stars.test.tsx > Stars > indica cuando no hay valoraciones
✓ src/components/ui/Stars.test.tsx > Stars > en modo editable emite la puntuación al hacer click
✓ src/components/NotificacionesMenu.test.tsx > NotificacionesMenu > muestra el contador de avisos sin leer
✓ src/components/NotificacionesMenu.test.tsx > NotificacionesMenu > lista el aviso al abrir el menú
✓ src/components/NotificacionesMenu.test.tsx > NotificacionesMenu > al abrir un aviso lo marca leído y navega a la solicitud
✓ src/components/NotificacionesMenu.test.tsx > NotificacionesMenu > un aviso ya leído no se vuelve a marcar
✓ src/components/NotificacionesMenu.test.tsx > NotificacionesMenu > si la API falla no rompe el encabezado
✓ src/pages/AuthPage.test.tsx > AuthPage > envía email y contraseña al iniciar sesión y notifica al padre
✓ src/pages/AuthPage.test.tsx > AuthPage > muestra el mensaje de error devuelto por la API
✓ src/pages/AuthPage.test.tsx > AuthPage > en modo registro permite elegir el rol y envía el rol elegido
✓ src/pages/AuthPage.test.tsx > AuthPage > en modo registro no envía si el email de confirmación no coincide

Test Files  6 passed (6)
Tests  24 passed (24)
Duration  5.54s
```

## Frontend end-to-end: `pnpm --filter web test:e2e`

```
Running 4 tests using 1 worker
  ok 1 [chromium] › e2e\flujo.spec.ts › Publicar → solicitar → aceptar → completar → valorar › el contratista publica un servicio con precio (7.5s)
  ok 2 [chromium] › e2e\flujo.spec.ts › Publicar → solicitar → aceptar → completar → valorar › el productor registra un campo y solicita el servicio con un insumo (6.2s)
  ok 3 [chromium] › e2e\flujo.spec.ts › Publicar → solicitar → aceptar → completar → valorar › el contratista acepta y completa el trabajo (3.8s)
  ok 4 [chromium] › e2e\flujo.spec.ts › Publicar → solicitar → aceptar → completar → valorar › el productor valora y el promedio se refleja en el perfil del contratista (4.1s)
  4 passed (36.5s)
```

## Cómo reproducir

```bash
pnpm db:migrate && pnpm db:seed
pnpm test                          # backend + componentes
pnpm --filter web test:e2e         # e2e (levanta server y web solo)
pnpm --filter web test:e2e:report  # reporte HTML de Playwright
```
