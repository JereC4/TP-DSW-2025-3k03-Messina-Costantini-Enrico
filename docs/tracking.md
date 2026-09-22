# Seguimiento del proyecto

Cómo se organizó el trabajo, quién hizo qué y en qué estado quedó cada cosa.

La tabla de abajo es el seguimiento real del trabajo y se puede verificar contra el repositorio: cada
fila indica la rama y el pull request en los que quedó hecha la tarea.

## Metodología, tal como fue

No usamos Scrum ni ninguna metodología con ceremonias. Fue un equipo de dos personas con materias
encima, que se organizó así:

- **Coordinación asincrónica** por Discord y WhatsApp: cada uno avisaba qué estaba tocando, qué
  pensaba tomar después y cuándo había subido cambios. No hubo reuniones con horario.
- **Reparto por clase del modelo**, para no editar los mismos archivos. En noviembre de 2025 Jeremías
  tomó categoría, insumo, servicio, precio y solicitud; Tiziano tomó ubicación, usuarios, acceso,
  campo y la interfaz general.
- **Una rama por tarea**, con prefijo que dice de qué se trata: `feat/`, `fix/`, `refactor/`, `docs/`,
  `test/`, `chore/`. Se incorporó a partir de septiembre de 2026; antes se trabajaba con commits
  directos sobre `main`, que es lo que generaba los conflictos que aparecen en las minutas.
- **Un pull request por rama**, revisado antes de mergear. Las ramas van apiladas cuando una depende
  de otra, y en ese caso el orden de merge importa.
- **Definición de terminado**: compila sin errores de tipos, pasa los tests automatizados y el
  análisis estático, y la documentación afectada quedó actualizada en el mismo pull request.

## Estado del trabajo

Leyenda: ✅ hecho · ⏳ pendiente

### Propuesta y modelo

| # | Tarea | Rama | PR | Responsable | Estado |
|:-|:-|:-|:-|:-|:-|
| 1 | Elección del tema y armado del repositorio | `main` | — | Jeremías | ✅ |
| 2 | Propuesta con modelo de datos y casos de uso | `patch-1`, `patch-2` | #1, #2 | Tiziano | ✅ |
| 3 | Modelo de dominio coherente y renombre a productor/contratista | `refactor/dominio` | #11 | Tiziano | ✅ |
| 4 | Diagrama entidad-relación, glosario y limitaciones | `docs/coherencia` | #13 | Tiziano | ✅ |

### Backend

| # | Tarea | Rama | PR | Responsable | Estado |
|:-|:-|:-|:-|:-|:-|
| 5 | Provincia y localidad | `main` | — | Tiziano | ✅ |
| 6 | Usuario, roles y registro | `main` | — | Tiziano | ✅ |
| 7 | Categoría de servicio e insumo | `main` | — | Jeremías | ✅ |
| 8 | Servicio y precio | `main` | — | Jeremías | ✅ |
| 9 | Campo | `main` | — | Tiziano | ✅ |
| 10 | Solicitud de servicio | `main` | — | Jeremías | ✅ |
| 11 | Acceso con JWT y permisos por rol | `feat/auth-jwt-back` | #4 | Tiziano | ✅ |
| 12 | Reglas de negocio de la solicitud y cálculo de importes | `refactor/dominio` | #11 | Tiziano | ✅ |
| 13 | Valoraciones | `refactor/dominio` | #11 | Tiziano | ✅ |
| 14 | Historial de eventos de la solicitud | `feat/historial-eventos` | #17 | Tiziano | ✅ |
| 15 | Avisos dentro de la aplicación | `feat/notificaciones` | #19 | Tiziano | ✅ |
| 16 | Cercanía por distancia real | `feat/cercania-distancia` | #21 | Tiziano | ✅ |

### Frontend

| # | Tarea | Rama | PR | Responsable | Estado |
|:-|:-|:-|:-|:-|:-|
| 17 | Pantallas de catálogos de servicio e insumo | `main` | — | Jeremías | ✅ |
| 18 | Pantallas de servicio y precio | `main` | — | Jeremías | ✅ |
| 19 | Pantallas de campo, perfil e interfaz general | `main` | — | Tiziano | ✅ |
| 20 | Sesión, rutas protegidas y vistas de detalle | `feat/auth-front` | #5 | Tiziano | ✅ |
| 21 | Interfaz nueva completa, con tema claro y oscuro | `feat/ui-v2` | #12 | Tiziano | ✅ |
| 22 | Arreglo del desborde en teléfonos | `fix/responsive-movil` | #16 | Tiziano | ✅ |
| 23 | Mejoras del panel: verificado, ficha del campo, precio de mercado y gráfico | `feat/mejoras-demo` | #20 | Tiziano | ✅ |
| 24 | Confirmación del email en el registro | `claude/laughing-johnson-r080oy` | #23 | Jeremías | ✅ |
| 25 | Íconos propios por categoría en los servicios destacados | `claude/laughing-johnson-r080oy` | #23 | Jeremías | ✅ |
| 26 | Foto de fondo por categoría en las tarjetas del catálogo | `claude/laughing-johnson-r080oy` | #24 | Jeremías | ✅ |

### Calidad, documentación y despliegue

| # | Tarea | Rama | PR | Responsable | Estado |
|:-|:-|:-|:-|:-|:-|
| 27 | Primeros tests automatizados | `main` | — | Tiziano | ✅ |
| 28 | Documentación de la API con Swagger | `feat/api-docs` | #6 | Tiziano | ✅ |
| 29 | Prueba de extremo a extremo | `test/e2e` | #7 | Tiziano | ✅ |
| 30 | Documentación de entrega e integración continua | `docs/entrega` | #8 | Tiziano | ✅ |
| 31 | Despliegue del backend, el frontend y la base | `chore/deploy`, `fix/render-build` | #9 | Tiziano | ✅ |
| 32 | Endurecimiento de seguridad | `fix/hardening` | #10 | Tiziano | ✅ |
| 33 | Auditoría de coherencia del negocio: 53 hallazgos | `chore/lint-auditoria` | #15 | Tiziano | ✅ |
| 34 | Análisis estático del backend y modo estricto completo | `chore/lint-auditoria` | #15 | Tiziano | ✅ |
| 35 | Todo el sistema con un comando, con Docker Compose | `chore/docker-compose` | #18 | Tiziano | ✅ |
| 36 | Minutas y seguimiento del proyecto | `docs/gestion` | #22 | Tiziano | ✅ |
| 37 | Video de demostración | — | — | Ambos | ⏳ |
| 38 | Envío del formulario de la cátedra | — | — | Tiziano | ⏳ |

El detalle de cada pull request está en [pull-requests.md](pull-requests.md), y el recorrido cronológico en [minutas/](minutas/).

Lo que queda para después de la defensa está en [pendientes.md](pendientes.md).
