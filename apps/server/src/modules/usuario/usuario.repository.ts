import { prisma, type Prisma } from '@repo/db';
import type { RoleName } from '../../core/auth/types.js';
import type { UsuarioQuery } from './usuario.schema.js';

export const userInclude = {
  localidad: { include: { provincia: true } },
  user_roles: { include: { roles: true } },
  productor_profile: true,
  contratista_profile: true,
} satisfies Prisma.usersInclude;

export type UserRow = Prisma.usersGetPayload<{ include: typeof userInclude }>;

export type PersonaData = {
  nombre?: string;
  apellido?: string;
  cuil_cuit?: string | null;
  telefono?: string | null;
  fecha_nac?: Date | null;
  domicilio?: string | null;
  id_localidad?: bigint | null;
};

const strip = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;

export const usuarioRepo = {
  list: async (q: UsuarioQuery) => {
    const where: Prisma.usersWhereInput = {
      ...(q.q ? { OR: [{ email: { contains: q.q } }, { nombre: { contains: q.q } }, { apellido: { contains: q.q } }] } : {}),
      ...(q.id_localidad ? { id_localidad: q.id_localidad } : {}),
      ...(q.role ? { user_roles: { some: { roles: { name: q.role } } } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.users.findMany({
        where,
        orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
        include: userInclude,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.users.count({ where }),
    ]);
    return { items, total };
  },

  getById: (id: bigint) => prisma.users.findUnique({ where: { id_user: id }, include: userInclude }),

  getByEmail: (email: string) => prisma.users.findUnique({ where: { email }, include: userInclude }),

  countAdmins: () => prisma.user_roles.count({ where: { roles: { name: 'ADMIN' } } }),

  roleIdsByNames: async (names: RoleName[]) => {
    const rows = await prisma.roles.findMany({ where: { name: { in: names } } });
    return new Map(rows.map((r) => [r.name as RoleName, r.id_role]));
  },

  /** Dependencias que impiden quitar un rol o borrar el usuario. */
  countDependencies: async (id: bigint) => {
    const [campos, servicios, solAsProductor, solAsContratista] = await Promise.all([
      prisma.campo.count({ where: { id_productor: id } }),
      prisma.servicio.count({ where: { id_contratista: id } }),
      prisma.solicitud.count({ where: { id_productor: id } }),
      prisma.solicitud.count({ where: { id_contratista: id } }),
    ]);
    return { campos, servicios, solicitudes: solAsProductor + solAsContratista };
  },

  /**
   * Crea o actualiza usuario + roles + perfiles en una sola transacción.
   * `roles` reemplaza el conjunto completo; los perfiles se sincronizan con los roles.
   */
  save: (
    id: bigint | null,
    data: PersonaData & { email?: string; password_hash?: string },
    roles: { names: RoleName[]; ids: number[] } | undefined,
    profiles: { razon_social?: string | null; descripcion?: string | null; anios_experiencia?: number | null; latitud?: number | null; longitud?: number | null },
  ) =>
    prisma.$transaction(async (tx) => {
      const base = strip(data);
      const user = id
        ? await tx.users.update({ where: { id_user: id }, data: base })
        : await tx.users.create({ data: base as Prisma.usersUncheckedCreateInput });
      const uid = user.id_user;

      let roleNames = roles?.names;
      if (roles) {
        await tx.user_roles.deleteMany({ where: { id_user: uid } });
        await tx.user_roles.createMany({ data: roles.ids.map((id_role) => ({ id_user: uid, id_role })) });
      } else {
        const current = await tx.user_roles.findMany({ where: { id_user: uid }, include: { roles: true } });
        roleNames = current.map((r) => r.roles.name as RoleName);
      }

      const productorData = strip({ razon_social: profiles.razon_social });
      const contratistaData = strip({
        descripcion: profiles.descripcion,
        anios_experiencia: profiles.anios_experiencia,
        latitud: profiles.latitud,
        longitud: profiles.longitud,
      });

      if (roleNames!.includes('PRODUCTOR')) {
        await tx.productor_profile.upsert({ where: { id_user: uid }, update: productorData, create: { id_user: uid, ...productorData } });
      } else {
        await tx.productor_profile.deleteMany({ where: { id_user: uid } });
      }
      if (roleNames!.includes('CONTRATISTA')) {
        await tx.contratista_profile.upsert({ where: { id_user: uid }, update: contratistaData, create: { id_user: uid, ...contratistaData } });
      } else {
        await tx.contratista_profile.deleteMany({ where: { id_user: uid } });
      }

      return tx.users.findUniqueOrThrow({ where: { id_user: uid }, include: userInclude });
    }),

  remove: (id: bigint) => prisma.users.delete({ where: { id_user: id } }),

  /** Setter dedicado de la foto de perfil: no pasa por `save()` a propósito, así no se puede
   * pisar `foto_url` con una URL arbitraria desde el PUT general de perfil/admin. */
  setFoto: (id: bigint, foto_url: string | null) => prisma.users.update({ where: { id_user: id }, data: { foto_url }, include: userInclude }),
};
