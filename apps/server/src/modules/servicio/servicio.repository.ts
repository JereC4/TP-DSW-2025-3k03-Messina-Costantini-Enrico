import { prisma } from '../../../../../packages/database/src/client.js';

export const servicioRepo = {
  // Listado con filtros opcionales
  list: (q?: string, id_categoria?: bigint, id_prestamista?: bigint) =>
    prisma.servicio.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { nombre: { contains: q } },
                { descripcion: { contains: q } },
              ],
            }
          : {}),
        ...(id_categoria ? { id_categoria } : {}),
        ...(id_prestamista ? { id_prestamista } : {}),
      },
      orderBy: [{ nombre: 'asc' }],
      // Si ya tenés relaciones mapeadas, podés incluirlas:
      // include: { categoria: true, prestamista: true },
    }),

  getById: (id: bigint) =>
    prisma.servicio.findUnique({
      where: { id_servicio: id },
      // include: { categoria: true, prestamista: true },
    }),

  create: (data: {
    nombre: string;
    descripcion?: string | null;
    id_categoria: bigint;
    id_prestamista: bigint;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const row = await tx.servicio.create({
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion ?? null,
          id_categoria: data.id_categoria,
          id_prestamista: data.id_prestamista,
        },
      });

      return tx.servicio.findUnique({
        where: { id_servicio: row.id_servicio },
        // include: { categoria: true, prestamista: true },
      });
    }),

  update: (id: bigint, data: {
    nombre?: string;
    descripcion?: string | null;
    id_categoria?: bigint;
    id_prestamista?: bigint;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const row = await tx.servicio.update({
        where: { id_servicio: id },
        data: {
          ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
          ...(data.descripcion !== undefined ? { descripcion: data.descripcion } : {}),
          ...(data.id_categoria !== undefined ? { id_categoria: data.id_categoria } : {}),
          ...(data.id_prestamista !== undefined ? { id_prestamista: data.id_prestamista } : {}),
        },
      });

      return tx.servicio.findUnique({
        where: { id_servicio: row.id_servicio },
        // include: { categoria: true, prestamista: true },
      });
    }),

  remove: (id: bigint) =>
    prisma.servicio.delete({
      where: { id_servicio: id },
    }),
};
