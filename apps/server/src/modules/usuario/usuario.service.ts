import bcrypt from 'bcrypt';
import type { UsuarioCreateDto, UsuarioUpdateDto } from './usuario.schema.js';
import { usuarioRepo } from './usuario.repository.js';
import { prisma } from '../../../../../packages/database/src/client.js';

async function rolesByNames(names: string[]): Promise<number[]> {
  if (!names.length) return [];
  const rows = await prisma.roles.findMany({ where: { name: { in: names } } });
  // seguridad: si alguno no existe, lo ignoramos o lanzamos error:
  const missing = names.filter(n => !rows.some(r => r.name === n));
  if (missing.length) {
    throw { status: 400, code: 'ROLE_INVALID', message: `Roles inválidos: ${missing.join(', ')}` };
  }
  return rows.map(r => Number(r.id_role));
}

export const usuarioService = {
  list: (q?: string, id_localidad?: bigint, roleName?: string) =>
    usuarioRepo.list(q, id_localidad, roleName),

  get: async (id: bigint) => {
    const u = await usuarioRepo.getById(id);
    if (!u) throw { status: 404, code: 'NOT_FOUND', message: 'Usuario no encontrado' };
    return u;
  },

  create: async (dto: UsuarioCreateDto) => {
    try {
      const password_hash = await bcrypt.hash(dto.password, 10);
      const roleIds = await rolesByNames(dto.roles ?? []);
      return await usuarioRepo.create({
        email: dto.email.toLowerCase().trim(),
        password_hash,
        nombre: dto.nombre.trim(),
        apellido: dto.apellido.trim(),
        cuil_cuit: dto.cuil_cuit?.trim() ?? null,
        fecha_nac: dto.fecha_nac ? new Date(dto.fecha_nac) : null,
        domicilio: dto.domicilio?.trim() ?? null,
        id_localidad: dto.id_localidad ?? null,
        roleIds,
      });
    } catch (e: any) {
      // UNIQUE email
      if (e.code === 'P2002') {
        throw { status: 409, code: 'DUPLICATE', message: 'Email ya registrado' };
      }
      // FK localidad inválida
      if (e.code === 'P2003') {
        throw { status: 400, code: 'FK_INVALID', message: 'Localidad inexistente' };
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: UsuarioUpdateDto) => {
    await usuarioService.get(id); // asegura 404 si no existe

    try {
      const password_hash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
      const replaceRoleIds = dto.roles ? await rolesByNames(dto.roles) : undefined;

      return await usuarioRepo.update(id, {
        email: dto.email?.toLowerCase().trim(),
        password_hash,
        nombre: dto.nombre?.trim(),
        apellido: dto.apellido?.trim(),
        cuil_cuit: dto.cuil_cuit?.trim() ?? (dto.cuil_cuit === null ? null : undefined),
        fecha_nac: dto.fecha_nac ? new Date(dto.fecha_nac) : (dto.fecha_nac === null ? null : undefined),
        domicilio: dto.domicilio?.trim() ?? (dto.domicilio === null ? null : undefined),
        id_localidad: dto.id_localidad ?? (dto.id_localidad === null ? null : undefined),
        replaceRoleIds,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw { status: 409, code: 'DUPLICATE', message: 'Email ya registrado' };
      }
      if (e.code === 'P2003') {
        throw { status: 400, code: 'FK_INVALID', message: 'Localidad inexistente' };
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    await usuarioService.get(id);
    return usuarioRepo.remove(id); // CASCADE limpia perfiles y user_roles según tu esquema.  
  },
};
