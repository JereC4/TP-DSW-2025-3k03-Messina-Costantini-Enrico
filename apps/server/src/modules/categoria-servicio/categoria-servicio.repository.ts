import { prisma } from '../../../../../packages/database/src/client.js';

export const categoriaServicioRepo = {
  // Listado con búsqueda opcional por nombre/descripcion
  list: (q?: string) =>
    prisma.categoria.findMany({
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

  // Obtener por id
  getById: (id: bigint) =>
    prisma.categoria.findUnique({
      where: { id_categoria: id },
    }),

  // Crear
  create: (data: {
    nombre: string;
    descripcion?: string | null;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const cat = await tx.categoria.create({
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion ?? null,
        },
      });

      return tx.categoria.findUnique({
        where: { id_categoria: cat.id_categoria },
      });
    }),

  // Actualizar
  update: (id: bigint, data: {
    nombre?: string;
    descripcion?: string | null;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const cat = await tx.categoria.update({
        where: { id_categoria: id },
        data: {
          ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
          ...(data.descripcion !== undefined ? { descripcion: data.descripcion } : {}),
        },
      });

      return tx.categoria.findUnique({
        where: { id_categoria: cat.id_categoria },
      });
    }),

  // Eliminar
  remove: (id: bigint) =>
    prisma.categoria.delete({
      where: { id_categoria: id },
    }),
};
