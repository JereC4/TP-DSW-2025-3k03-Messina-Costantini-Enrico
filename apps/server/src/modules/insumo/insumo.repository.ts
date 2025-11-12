import { prisma } from '../../../../../packages/database/src/client.js';

export const insumoRepo = {
  list: (q?: string, page?: number, pageSize?: number) => {
    const where = q
      ? {
          OR: [
            { nombre: { contains: q } },
            { descripcion: { contains: q } },
          ],
        }
      : undefined;

    const p = Number(page);
    const ps = Number(pageSize);
    const hasPaging = Number.isFinite(p) && Number.isFinite(ps) && p > 0 && ps > 0;

    return prisma.insumo.findMany({
      where,
      ...(hasPaging ? { skip: (p - 1) * ps, take: ps } : {}),
      orderBy: { nombre: 'asc' },
    });
  },

  getById: (id: number) =>
    prisma.insumo.findUnique({ where: { id_insumo: id } }),

  create: (data: { nombre_insumo: string; descripcion_insumo?: string | null }) =>
    prisma.insumo.create({
      data: {
        nombre: data.nombre_insumo,
        descripcion: data.descripcion_insumo ?? null,
      },
    }),

  update: (
    id: number,
    data: Partial<{ nombre_insumo: string; descripcion_insumo?: string | null }>
  ) =>
    prisma.insumo.update({
      where: { id_insumo: id },
      data: {
        ...(data.nombre_insumo !== undefined ? { nombre: data.nombre_insumo } : {}),
        ...(data.descripcion_insumo !== undefined ? { descripcion: data.descripcion_insumo } : {}),
      },
    }),

  remove: (id: number) =>
    prisma.insumo.delete({ where: { id_insumo: id } }),
};
