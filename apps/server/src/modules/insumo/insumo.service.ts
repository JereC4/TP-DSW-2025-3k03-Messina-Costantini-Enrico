import { insumoRepo } from "./insumo.repository.js";
import type { InsumoCreateDTO, InsumoUpdateDTO } from "./insumo.schema.ts";

export const insumoService = {
  list: (q?: string) => insumoRepo.list(q),

  getById: async (id: bigint) => {
    const row = await insumoRepo.getById(id);
    if (!row) {
      const err: any = new Error("Insumo no encontrado");
      err.status = 404;
      throw err;
    }
    return row;
  },

  create: async (dto: InsumoCreateDTO) => {
    try {
      return await insumoRepo.create(dto);
    } catch (e: any) {
      if (e?.code === "P2002") { 
        const err: any = new Error("Ya existe un insumo con ese nombre");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: InsumoUpdateDTO) => {
    try {
      return await insumoRepo.update(id, dto);
    } catch (e: any) {
      if (e?.code === "P2025") { 
        const err: any = new Error("Insumo no encontrado");
        err.status = 404;
        throw err;
      }
      if (e?.code === "P2002") {
        const err: any = new Error("Ya existe un insumo con ese nombre");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    try {
      await insumoRepo.remove(id);
      return { ok: true };
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err: any = new Error("Insumo no encontrado");
        err.status = 404;
        throw err;
      }
      if (e?.code === "P2003") {
        const err: any = new Error("No se puede eliminar: existen solicitudes que usan este insumo");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },
};
