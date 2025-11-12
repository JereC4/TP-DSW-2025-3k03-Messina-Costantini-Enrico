import { campoRepo } from "./campo.repository.js";
import type { CampoCreateDTO, CampoUpdateDTO } from "./campo.schema.js";

export const campoService = {
  list: (q?: string, id_cliente?: bigint, page?: number, pageSize?: number) =>
    campoRepo.list(q, id_cliente, page, pageSize),

  get: async (id: bigint) => {
    const row = await campoRepo.getById(id);
    if (!row) throw { status: 404, code: "NOT_FOUND", message: "Campo no encontrado" };
    return row;
  },

  create: async (dto: CampoCreateDTO) => {
    try {
      return await campoRepo.create({
        id_cliente: dto.id_cliente,
        coordenadas: dto.coordenadas.trim(),
        hectareas: dto.hectareas,
      });
    } catch (e: any) {
      if (e?.code === "P2003") {
        // FK inválida
        throw { status: 400, code: "FK_INVALID", message: "Cliente inexistente" };
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: CampoUpdateDTO) => {
    await campoService.get(id);
    try {
      return await campoRepo.update(id, {
        id_cliente: dto.id_cliente,
        coordenadas:
          dto.coordenadas !== undefined ? dto.coordenadas?.trim() ?? null : undefined,
        hectareas: dto.hectareas !== undefined ? dto.hectareas ?? null : undefined,
      });
    } catch (e: any) {
      if (e?.code === "P2003") {
        throw { status: 400, code: "FK_INVALID", message: "Cliente inexistente" };
      }
      if (e?.code === "P2025") {
        throw { status: 404, code: "NOT_FOUND", message: "Campo no encontrado" };
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    await campoService.get(id);
    try {
      return await campoRepo.remove(id);
    } catch (e: any) {
      throw e;
    }
  },
};
