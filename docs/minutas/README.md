# Minutas y registro de coordinación

Grupo: **Tiziano Messina** (52911) y **Jeremías Costantini** (53112).

## Cómo se coordinó este trabajo, y cómo se armaron estas minutas

El equipo no tuvo reuniones formales con horario y orden del día. La coordinación fue
**asincrónica, por Discord y WhatsApp**: cada uno contaba qué había avanzado, qué pensaba tomar
después y se recordaban hacer `git pull` antes de empezar para no pisarse.

Estas minutas se escribieron al cierre del trabajo y **reconstruyen esos hitos a partir del historial
del repositorio**, que es la evidencia que quedó: fechas, autor y alcance de cada commit y de cada
pull request. Se dice acá para que se lea como lo que es, un registro reconstruido y verificable, y
no como el acta de una reunión que no ocurrió.

Todo lo que figura en cada entrada se puede comprobar con:

```bash
git log --date=short --format='%ad %an %s' --no-merges
git log --merges --format='%s'
```

## Índice

| Fecha | Hito | Archivo |
|:-|:-|:-|
| 2025-04-14 | Arranque del repositorio y elección del tema | [2025-04-14.md](2025-04-14.md) |
| 2025-04-24 | Propuesta del trabajo práctico | [2025-04-24.md](2025-04-24.md) |
| 2025-10-17 | Reanudación del desarrollo | [2025-10-17.md](2025-10-17.md) |
| 2025-11-11 | Base del backend: ubicación, usuarios y acceso | [2025-11-11.md](2025-11-11.md) |
| 2025-11-14 | Reparto del desarrollo y cierre del alcance funcional | [2025-11-14.md](2025-11-14.md) |
| 2025-11-19 | Preparación del despliegue y primeros tests | [2025-11-19.md](2025-11-19.md) |
| 2026-09-10 | Reescritura para la instancia de aprobación | [2026-09-10.md](2026-09-10.md) |
| 2026-09-11 | Auditoría, reproducibilidad y mejoras de producto | [2026-09-11.md](2026-09-11.md) |
| 2026-09-12 | Cercanía por distancia y cierre de la gestión | [2026-09-12.md](2026-09-12.md) |
| 2026-09-17 | Ajustes de interfaz en el registro y el catálogo | [2026-09-17.md](2026-09-17.md) |

El seguimiento de tareas está en [../tracking.md](../tracking.md).

## Lo que no quedó registrado

Buena parte de la coordinación fue conversación suelta en Discord y WhatsApp que no dejó rastro en
el repositorio: quién tomaba qué la semana siguiente, dudas puntuales de Prisma o de React, y avisos
de "subí cambios, actualizá". Esas conversaciones no se reconstruyen acá porque no hay forma de
verificarlas, y preferimos que las minutas digan solo lo que se puede comprobar.
