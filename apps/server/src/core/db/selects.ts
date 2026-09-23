/**
 * Selects reutilizables para incluir usuarios dentro de otras entidades.
 * - `publicUserSelect`: lo que ve cualquiera (listados y perfiles públicos): sin contacto.
 * - `contactUserSelect`: lo que ven las dos partes de una solicitud: con email, teléfono y domicilio.
 * Nunca incluyen `password_hash`.
 */
export const publicUserSelect = {
  id_user: true,
  nombre: true,
  apellido: true,
  id_localidad: true,
  localidad: { include: { provincia: true } },
  foto_url: true,
} as const;

export const contactUserSelect = {
  ...publicUserSelect,
  email: true,
  telefono: true,
  domicilio: true,
} as const;
