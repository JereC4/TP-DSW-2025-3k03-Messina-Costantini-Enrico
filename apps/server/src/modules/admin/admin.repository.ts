import { prisma } from '../../../../../packages/database/src/client.js';

export const adminRepo = {
  list: () =>
    prisma.admin_profile.findMany({
      orderBy: { id_user: "asc" },
      include: { users: true },
    }),

  getById: (id: bigint) =>
    prisma.admin_profile.findUnique({
      where: { id_user: id },
      include: { users: true },
    }),

  create: (data: {
    id_user: bigint;
    area_responsable?: string | null;
    observaciones?: string | null;
  }) =>
    prisma.admin_profile.create({
      data: {
        id_user: data.id_user,
        ...(data.area_responsable !== undefined
          ? { area_responsable: data.area_responsable }
          : {}),
        observaciones: data.observaciones ?? null,
      },
      include: { users: true },
    }),

  update: (
    id: bigint,
    data: {
      area_responsable?: string | null;
      observaciones?: string | null;
    },
  ) =>
    prisma.admin_profile.update({
      where: { id_user: id },
      data: {
        ...(data.area_responsable !== undefined
          ? { area_responsable: data.area_responsable }
          : {}),
        ...(data.observaciones !== undefined
          ? { observaciones: data.observaciones }
          : {}),
      },
      include: { users: true },
    }),

  remove: (id: bigint) =>
    prisma.admin_profile.delete({
      where: { id_user: id },
    }),
};
