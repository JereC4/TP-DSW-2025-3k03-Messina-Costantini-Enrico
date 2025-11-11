import { prisma } from '../../../../../packages/database/src/client.js';

export const clienteRepo = {
  list: () =>
    prisma.cliente_profile.findMany({
      include: { users: true },
      orderBy: { id_user: "asc" },
    }),

  getById: (id: bigint) =>
    prisma.cliente_profile.findUnique({
      where: { id_user: id },
      include: { users: true },
    }),

  create: (data: any) => prisma.cliente_profile.create({ data }),
  update: (id: bigint, data: any) =>
    prisma.cliente_profile.update({ where: { id_user: id }, data }),
  remove: (id: bigint) => prisma.cliente_profile.delete({ where: { id_user: id } }),
};