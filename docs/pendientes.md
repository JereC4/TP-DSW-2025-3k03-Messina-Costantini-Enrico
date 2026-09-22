# Pendientes y próximos pasos

Estado al 2026-09-22. Lo que falta para cerrar la entrega, en orden.

## Para la defensa (obligatorio)

- [x] **Registro de coordinación** en [`minutas/`](minutas/), una entrada por hito reconstruida del historial del repositorio, y **[`tracking.md`](tracking.md)** con la metodología y el estado de cada tarea.
- [ ] Crear el tablero en GitHub Projects siguiendo los pasos de [`tracking.md`](tracking.md) y pegar ahí el enlace. Las tarjetas están listas para copiar.
- [ ] **Video** siguiendo [video-guion.md](video-guion.md); link en [video.md](video.md).
- [x] Números de PR completos en [pull-requests.md](pull-requests.md) y [tracking.md](tracking.md), incluidos los aportes de Jeremías (#23 y #24).
- [ ] Enviar el formulario de la cátedra con: repo, `docs/README.md`, video, links de deploy, credenciales y contacto.

## Después de la defensa

- [ ] Cambiar la contraseña del usuario admin de producción (las credenciales demo son públicas en el repo).
- [ ] Cargar coordenadas al resto de las localidades: el seed cubre las 13 de demostración, las que se den de alta después las carga el administrador.
- [ ] Mover el cálculo de distancia a la base (`ST_Distance_Sphere` con índice espacial) si el volumen de contratistas lo justifica.
- [ ] Decidir si los perfiles públicos de contratistas deben requerir sesión.

## Ideas fuera de alcance (documentadas en [modelo.md](modelo.md))

- Notificaciones por email al cambiar el estado de una solicitud.
- Calendario de disponibilidad del contratista y control de superposición.
- Servicios cotizados por hora o por viaje.
