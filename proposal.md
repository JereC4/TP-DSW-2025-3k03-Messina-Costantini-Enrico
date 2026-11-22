# Propuesta TP DSW — AgroApp

## Grupo
### Integrantes
* 53112 - Costantini, Jeremías
* 52911 - Messina, Tiziano Leonel

### Repositorios
* [fullstack app (monorepo)](https://github.com/JereC4/TP-DSW-2025-3k03-Messina-Costantini-Enrico)
* Pull requests: [docs/pull-requests.md](docs/pull-requests.md)
* Documentación: [docs/README.md](docs/README.md)
* Deploy: https://tp-dsw-2025-3k03-messina-costantini.vercel.app · API: https://tp-dsw-2025-3k03-messina-costantini.onrender.com · Swagger: https://tp-dsw-2025-3k03-messina-costantini.onrender.com/docs

## Tema
### Descripción
El sistema conecta a productores agropecuarios (**productores**) con **contratistas** rurales que ofrecen siembra, cosecha, pulverización, fertilización y otras labores. El contratista publica sus servicios dentro de una categoría y les fija un precio por hectárea con historial. El productor registra sus campos con ubicación, busca contratistas cercanos, compara precios y solicita un servicio indicando campo, hectáreas, fechas e insumos; el sistema calcula los importes. El contratista acepta, rechaza o completa cada solicitud, cualquiera de las partes puede cancelar con motivo, y al terminar el productor valora el trabajo.

### Modelo
Modelo de dominio, DER en Mermaid, glosario y reglas de negocio: [docs/modelo.md](docs/modelo.md). DER original de abril de 2025: [docs/img/MODELODEDATOS.png](docs/img/MODELODEDATOS.png).

Stack (informado en la propuesta original y aprobado): monorepo pnpm + Turborepo; backend Node + Express + TypeScript + Prisma + MySQL; frontend React + Vite + TypeScript + Tailwind; autenticación JWT propia con roles ADMIN / PRODUCTOR / CONTRATISTA.

> Nota de vocabulario: la propuesta original hablaba de "cliente" y "prestamista". En la versión final se usan **productor** y **contratista**, que es el vocabulario real del sector. Los roles, tablas, rutas y pantallas se renombraron en consecuencia.

## Alcance Funcional

### Alcance Mínimo

Regularidad (aprobada):
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoría de servicio<br>2. CRUD Localidad<br>3. CRUD Usuario|
|CRUD dependiente|1. CRUD Servicio {depende de} Categoría y Contratista<br>2. CRUD Solicitud {depende de} Servicio, Campo, Productor y Contratista<br>3. CRUD Campo {depende de} Productor y Localidad|
|Listado<br>+<br>detalle|1. Listado de servicios filtrado por categoría, provincia y texto → detalle con categoría, contratista, historial de precios y valoraciones<br>2. Listado de contratistas filtrado por cercanía al campo (localidad, con ampliación a provincia) y por categoría → perfil con datos, servicios con precio y opiniones<br>3. Listado de campos del productor → detalle con mapa y sus solicitudes<br>4. Listado de solicitudes (historial) filtrado por estado → detalle completo: servicio, categoría, campo, productor, contratista, insumos e importes|
|CUU/Epic|1. Publicar un servicio<br>2. Solicitar un servicio publicado|

Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD|1. Categoría de servicio<br>2. Servicio<br>3. Localidad<br>4. Provincia<br>5. Solicitud<br>6. Campo<br>7. Insumo (con precio de referencia)<br>8. Precio<br>9. Usuario (con roles y perfiles de productor / contratista)|
|CUU/Epic|1. Publicar un servicio (contratista, con precio inicial e historial de precios)<br>2. Solicitar un servicio (productor: campo propio, hectáreas, fechas, insumos indicando quién los aporta; precio = precio vigente × hectáreas + insumos del contratista al precio de referencia)<br>3. Gestionar la solicitud: aceptar con fecha de inicio, rechazar o cancelar con motivo, completar (contratista); cancelar (productor). Transiciones validadas por rol.<br>4. Valorar el trabajo (productor, una vez por solicitud completada; promedio visible en catálogo y perfil)<br>Los CUU están encadenados: cada uno usa los datos registrados por el anterior.|
|Login y niveles de acceso|Autenticación propia con JWT. Tres niveles: ADMIN (catálogos y usuarios), PRODUCTOR (campos y solicitudes propias), CONTRATISTA (servicios, precios y solicitudes recibidas). Rutas protegidas en backend (roles revalidados en cada request) y frontend. Los datos de contacto solo se muestran entre las partes de una solicitud.|
|Tests|Backend: unitarios (auth, solicitud, usuario) + integración end-to-end sobre la API. Frontend: tests de componente + e2e con Playwright del flujo completo.|

Nota sobre el listado "por aproximación geográfica" de la propuesta original: se implementó en dos niveles. Sin radio, cercanía por localidad del campo elegido, con ampliación automática a la provincia cuando no hay contratistas en la localidad. Con un radio en kilómetros, filtro por distancia real entre el campo y el contratista, con orden de más cerca a más lejos y ampliación del radio cuando no hay resultados.

### Alcance Adicional Voluntario

|Req|Detalle|Estado|
|:-|:-|:-|
|CUU/Epic|1. Valoración del servicio|Implementado|
|CUU/Epic|2. Cancelación de solicitud (productor o contratista, con motivo)|Implementado|
|Listados|Dashboard por rol con contadores por estado, próximos trabajos y reputación|Implementado|
|Otros|1. Documentación OpenAPI/Swagger generada desde los schemas de validación<br>2. CI en GitHub Actions con tests en cada PR<br>3. Mapa de campos (OpenStreetMap) y modo oscuro<br>4. Envío de email al cambiar el estado de la solicitud|1, 2 y 3 implementados; 4 no se realizará|
