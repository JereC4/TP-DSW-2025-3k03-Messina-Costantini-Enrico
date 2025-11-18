import { prisma } from "@repo/db";

export const prestamistaRepo = {
  list: () =>
    prisma.prestamista_profile.findMany({
      orderBy: { id_user: "asc" },
      include: {
        users: true,           // nombre correcto de la relación
      },
    }),

  getById: (id: bigint) =>
    prisma.prestamista_profile.findUnique({
      where: { id_user: id },  // PK/UK es id_user
      include: { users: true },
    }),

  create: (data: { id_user: bigint; cuit?: string | null }) =>
    prisma.prestamista_profile.create({
      data: {
        id_user: data.id_user,
        cuit: data.cuit ?? null,
      },
      include: { users: true },
    }),

  update: (id: bigint, data: { cuit?: string | null }) =>
    prisma.prestamista_profile.update({
      where: { id_user: id },
      data: {
        ...(data.cuit !== undefined ? { cuit: data.cuit } : {}),
      },
      include: { users: true },
    }),

  remove: (id: bigint) =>
    prisma.prestamista_profile.delete({
      where: { id_user: id },
    }),
};
