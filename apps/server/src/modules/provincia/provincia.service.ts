import type { ProvinciaCreateDto, ProvinciaUpdateDto } from './provincia.schema.js';
import { provinciaRepo } from './provincia.repository.js';

export const provinciaService = {
  list: (q?: string) => provinciaRepo.list(q),

  get: async (id: bigint) => {
    const found = await provinciaRepo.getById(id);
    if (!found) throw { status: 404, code: 'NOT_FOUND', message: 'Provincia no encontrada' };
    return found;
  },

  create: async (dto: ProvinciaCreateDto) => {
    try {
      return await provinciaRepo.create({ nombre: dto.nombre.trim() });
    } catch (e: any) {
      if (e.code === 'P2002') throw { status: 409, code: 'DUPLICATE', message: 'Provincia ya existe' };
      throw e;
    }
  },

  update: async (id: bigint, dto: ProvinciaUpdateDto) => {
    await provinciaService.get(id);
    try {
      return await provinciaRepo.update(id, { nombre: dto.nombre.trim() });
    } catch (e: any) {
      if (e.code === 'P2002') throw { status: 409, code: 'DUPLICATE', message: 'Provincia ya existe' };
      throw e;
    }
  },

  remove: async (id: bigint) => {
    await provinciaService.get(id);
    if (await provinciaRepo.hasLocalidades(id))
      throw { status: 409, code: 'FK_RESTRICT', message: 'No se puede borrar: tiene localidades asociadas' };
    return provinciaRepo.remove(id);
  },
};
