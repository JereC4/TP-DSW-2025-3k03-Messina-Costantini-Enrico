import { prisma } from "../../../../../packages/database/src/client.js";

export const campoRepo = {
  list: (q?: string, id_cliente?: bigint, page?: number, pageSize?: number) => {
    const where = {
      ...(q ? {
        OR: [
          { coordenadas: { contains: q } },
        ]
      } : {}),
      ...(id_cliente ? { id_cliente } : {})
    };

    const p = Number(page), ps = Number(pageSize);
    const hasPaging = Number.isFinite(p) && Number.isFinite(ps) && p > 0 && ps > 0;

    return prisma.campo.findMany({
      where,
      ...(hasPaging ? { skip: (p - 1) * ps, take: ps } : {}),
      orderBy: { id_campo: "desc" },
      include: {
        cliente_profile: {
          include: { users: true }
        }
      }
    });
  },

  getById: (id: bigint) =>
    prisma.campo.findUnique({
      where: { id_campo: id },
      include: { cliente_profile: { include: { users: true } } }
    }),

  create: (data: { id_cliente: bigint; coordenadas: string; hectareas: number }) =>
    prisma.campo.create({
      data: {
        id_cliente: data.id_cliente,
        coordenadas: data.coordenadas,
        hectareas: data.hectareas
      },
      include: { cliente_profile: { include: { users: true } } }
    }),

    update: (
    id: bigint,
    data: { id_cliente?: bigint; coordenadas?: string; hectareas?: number }
  ) => {
    return prisma.campo.update({
      where: { id_campo: id },
      data: {
        ...(data.coordenadas !== undefined ? { coordenadas: data.coordenadas } : {}),
        ...(data.hectareas !== undefined ? { hectareas: data.hectareas } : {}),
        ...(data.id_cliente !== undefined
          ? { cliente_profile: { connect: { id_user: data.id_cliente } } }
          : {}),
      },
      include: { cliente_profile: { include: { users: true } } },
    });
  },

  remove: (id: bigint) =>
    prisma.campo.delete({ where: { id_campo: id } }),
};
