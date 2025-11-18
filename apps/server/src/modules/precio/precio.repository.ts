import { prisma } from "@repo/db";

export const precioRepo = {
  // Listar precios del servicio (histórico)
  listByServicio: (id_servicio: bigint) =>
    prisma.precio.findMany({
      where: { id_servicio },
      orderBy: [{ fecha_desde: 'desc' }],
    }),

  // Obtener uno por id
  getById: (id: bigint) =>
    prisma.precio.findUnique({
      where: { id_precio: id },
    }),

  // Crear
  create: (data: {
    id_servicio: bigint;
    fecha_desde: Date;
    valor: number;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const row = await tx.precio.create({
        data: {
          id_servicio: data.id_servicio,
          fecha_desde: data.fecha_desde,
          valor: data.valor,
        },
      });

      return tx.precio.findUnique({
        where: { id_precio: row.id_precio },
      });
    }),

  // Actualizar
  update: (id: bigint, data: {
    fecha_desde?: Date;
    valor?: number;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const row = await tx.precio.update({
        where: { id_precio: id },
        data: {
          ...(data.fecha_desde !== undefined ? { fecha_desde: data.fecha_desde } : {}),
          ...(data.valor !== undefined ? { valor: data.valor } : {}),
        },
      });

      return tx.precio.findUnique({
        where: { id_precio: row.id_precio },
      });
    }),

  // Eliminar
  remove: (id: bigint) =>
    prisma.precio.delete({
      where: { id_precio: id },
    }),
};