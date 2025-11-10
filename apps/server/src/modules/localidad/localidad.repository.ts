import { prisma } from '../../../../../packages/database/src/client.js';

export const localidadRepo = {
  list: (q?: string, id_provincia?: bigint) =>
    prisma.localidad.findMany({
      where: {
        ...(q ? { nombre: { contains: q } } : {}),
        ...(id_provincia ? { id_provincia } : {}),
      },
      orderBy: [{ id_provincia: 'asc' }, { nombre: 'asc' }],
      include: { provincia: true }, // opcional: devuelve nombre de provincia
    }),

  getById: (id: bigint) =>
    prisma.localidad.findUnique({
      where: { id_localidad: id },
      include: { provincia: true },
    }),

  // FK: debe existir provincia.id_provincia (RESTRICT). :contentReference[oaicite:4]{index=4}
  create: (data: { id_provincia: bigint; nombre: string; codigo_postal?: string }) =>
    prisma.localidad.create({ data }),

  update: (id: bigint, data: { id_provincia: bigint; nombre: string; codigo_postal?: string }) =>
    prisma.localidad.update({ where: { id_localidad: id }, data }),

  remove: (id: bigint) =>
    prisma.localidad.delete({ where: { id_localidad: id } }),
};
