import type { LocalidadCreateDto, LocalidadUpdateDto } from './localidad.schema.js';
import { localidadRepo } from './localidad.repository.js';

export const localidadService = {
  list: (q?: string, id_provincia?: bigint) => localidadRepo.list(q, id_provincia),

  get: async (id: bigint) => {
    const found = await localidadRepo.getById(id);
    if (!found) throw { status: 404, code: 'NOT_FOUND', message: 'Localidad no encontrada' };
    return found;
  },

  create: async (dto: LocalidadCreateDto) => {
    try {
      return await localidadRepo.create({
        id_provincia: dto.id_provincia,
        nombre: dto.nombre.trim(),
        codigo_postal: dto.codigo_postal?.trim(),
      });
    } catch (e: any) {
      if (e.code === 'P2003') { // FK violation → provincia inexistente
        throw { status: 400, code: 'FK_INVALID', message: 'Provincia no existe' };
      }
      if (e.code === 'P2002') { // UNIQUE(id_provincia,nombre)
        throw { status: 409, code: 'DUPLICATE', message: 'Ya existe localidad con ese nombre en esa provincia' };
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: LocalidadUpdateDto) => {
    await localidadService.get(id);
    try {
      return await localidadRepo.update(id, {
        id_provincia: dto.id_provincia,
        nombre: dto.nombre.trim(),
        codigo_postal: dto.codigo_postal?.trim(),
      });
    } catch (e: any) {
      if (e.code === 'P2003') {
        throw { status: 400, code: 'FK_INVALID', message: 'Provincia no existe' };
      }
      if (e.code === 'P2002') {
        throw { status: 409, code: 'DUPLICATE', message: 'Ya existe localidad con ese nombre en esa provincia' };
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    await localidadService.get(id);
    return localidadRepo.remove(id);
  },
};
