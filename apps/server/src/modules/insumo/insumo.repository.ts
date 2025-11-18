import { prisma } from "@repo/db";

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
    const hasPaging =
      Number.isFinite(p) && Number.isFinite(ps) && p > 0 && ps > 0;

    return prisma.insumo.findMany({
      where,
      ...(hasPaging ? { skip: (p - 1) * ps, take: ps } : {}),
      orderBy: { nombre: 'asc' },
    });
  },

  getById: (id: bigint) =>
    prisma.insumo.findUnique({ where: { id_insumo: id } }),

  create: (data: { nombre: string; descripcion?: string | null }) =>
    prisma.insumo.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
      },
    }),

  update: (
    id: bigint,
    data: Partial<{ nombre: string; descripcion?: string | null }>
  ) =>
    prisma.insumo.update({
      where: { id_insumo: id },
      data: {
        ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
        ...(data.descripcion !== undefined
          ? { descripcion: data.descripcion }
          : {}),
      },
    }),

  remove: (id: bigint) =>
    prisma.insumo.delete({ where: { id_insumo: id } }),
};
