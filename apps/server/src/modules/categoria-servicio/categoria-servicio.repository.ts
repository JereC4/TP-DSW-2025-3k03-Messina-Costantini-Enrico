import { prisma } from '../../../../../packages/database/src/client.js';

export const categoriaServicioRepo = {
  list: (q?: string, page?: number, pageSize?: number) => {
    const where = q
      ? { OR: [{ nombre: { contains: q } }, { descripcion: { contains: q } }] }
      : undefined;

    const p = Number(page);
    const ps = Number(pageSize);
    const hasPaging = Number.isFinite(p) && Number.isFinite(ps) && p > 0 && ps > 0;

    return prisma.categoria.findMany({
      where,
      ...(hasPaging ? { skip: (p - 1) * ps, take: ps } : {}),
      orderBy: { nombre: 'asc' },
    });
  },

  getById: (id: bigint) =>
    prisma.categoria.findUnique({ where: { id_categoria: id } }),

  create: (data: { nombre: string; descripcion?: string | null }) =>
    prisma.categoria.create({ data }),

  update: (id: bigint, data: Partial<{ nombre: string; descripcion?: string | null }>) =>
    prisma.categoria.update({ where: { id_categoria: id }, data }),

  remove: (id: bigint) =>
    prisma.categoria.delete({ where: { id_categoria: id } }),
};
