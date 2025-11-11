import { prisma } from '../../../../../packages/database/src/client.js';

export const insumoRepo = {
  // Listar con búsqueda por nombre/descripcion
  list: (q?: string) =>
    prisma.insumo.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { nombre: { contains: q } },
                { descripcion: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: [{ nombre: 'asc' }],
    }),

  // Obtener uno
  getById: (id: bigint) =>
    prisma.insumo.findUnique({
      where: { id_insumo: id },
    }),

  // Crear
  create: (data: { nombre: string; descripcion?: string | null }) =>
    prisma.$transaction(async (tx: any) => {
      const row = await tx.insumo.create({
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion ?? null,
        },
      });

      return tx.insumo.findUnique({ where: { id_insumo: row.id_insumo } });
    }),

  // Actualizar
  update: (id: bigint, data: { nombre?: string; descripcion?: string | null }) =>
    prisma.$transaction(async (tx: any) => {
      const row = await tx.insumo.update({
        where: { id_insumo: id },
        data: {
          ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
          ...(data.descripcion !== undefined ? { descripcion: data.descripcion } : {}),
        },
      });

      return tx.insumo.findUnique({ where: { id_insumo: row.id_insumo } });
    }),

  // Borrar
  remove: (id: bigint) =>
    prisma.insumo.delete({
      where: { id_insumo: id },
    }),
};
