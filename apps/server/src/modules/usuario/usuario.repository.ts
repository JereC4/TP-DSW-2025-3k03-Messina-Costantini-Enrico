import { prisma } from '@repo/db';

export const usuarioRepo = {
  list: (q?: string, id_localidad?: bigint, roleName?: string) =>
    prisma.users.findMany({
      where: {
        ...(q ? { OR: [
          { email: { contains: q } },
          { nombre: { contains: q } },
          { apellido: { contains: q } },
        ] } : {}),
        ...(id_localidad ? { id_localidad } : {}),
        ...(roleName ? {
          user_roles: {
            some: { roles: { name: roleName } }
          }
        } : {}),
      },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
      include: {
        localidad: true,
        user_roles: { include: { roles: true } },
      },
    }),

  getById: (id: bigint) =>
    prisma.users.findUnique({
      where: { id_user: id },
      include: {
        localidad: true,
        user_roles: { include: { roles: true } },
      },
    }),

  create: (data: {
    email: string;
    password_hash: string;
    nombre: string;
    apellido: string;
    cuil_cuit?: string | null;
    fecha_nac?: Date | null;
    domicilio?: string | null;
    id_localidad?: bigint | null;
    roleIds?: number[]; // ids en tabla roles
  }) =>
    prisma.$transaction(async (tx: any) => {
      const user = await tx.users.create({
        data: {
          email: data.email,
          password_hash: data.password_hash,
          nombre: data.nombre,
          apellido: data.apellido,
          cuil_cuit: data.cuil_cuit ?? null,
          fecha_nac: data.fecha_nac ?? null,
          domicilio: data.domicilio ?? null,
          id_localidad: data.id_localidad ?? null,
        },
      });

      if (data.roleIds?.length) {
        await tx.user_roles.createMany({
          data: data.roleIds.map((rid) => ({ id_user: user.id_user, id_role: rid })),
          skipDuplicates: true,
        });
      }

      return tx.users.findUnique({
        where: { id_user: user.id_user },
        include: { localidad: true, user_roles: { include: { roles: true } } },
      });
    }),

  update: (id: bigint, data: {
    email?: string;
    password_hash?: string;
    nombre?: string;
    apellido?: string;
    cuil_cuit?: string | null;
    fecha_nac?: Date | null;
    domicilio?: string | null;
    id_localidad?: bigint | null;
    replaceRoleIds?: number[] | null;
  }) =>
    prisma.$transaction(async (tx: any) => {
      const user = await tx.users.update({
        where: { id_user: id },
        data: {
          ...(data.email !== undefined ? { email: data.email } : {}),
          ...(data.password_hash !== undefined ? { password_hash: data.password_hash } : {}),
          ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
          ...(data.apellido !== undefined ? { apellido: data.apellido } : {}),
          ...(data.cuil_cuit !== undefined ? { cuil_cuit: data.cuil_cuit } : {}),
          ...(data.fecha_nac !== undefined ? { fecha_nac: data.fecha_nac } : {}),
          ...(data.domicilio !== undefined ? { domicilio: data.domicilio } : {}),
          ...(data.id_localidad !== undefined ? { id_localidad: data.id_localidad } : {}),
        },
      });

      if (data.replaceRoleIds) {
        await tx.user_roles.deleteMany({ where: { id_user: id } });
        if (data.replaceRoleIds.length) {
          await tx.user_roles.createMany({
            data: data.replaceRoleIds.map((rid) => ({ id_user: id, id_role: rid })),
            skipDuplicates: true,
          });
        }
      }

      return tx.users.findUnique({
        where: { id_user: user.id_user },
        include: { localidad: true, user_roles: { include: { roles: true } } },
      });
    }),

  remove: (id: bigint) =>
    prisma.users.delete({ where: { id_user: id } }),
};
