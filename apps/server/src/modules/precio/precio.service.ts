import { precioRepo } from "./precio.repository.js";
import type { PrecioCreateDTO, PrecioUpdateDTO } from "./precio.schema.ts";

export const precioService = {
  listByServicio: (id_servicio: bigint) =>
    precioRepo.listByServicio(id_servicio),

  getById: async (id: bigint) => {
    const p = await precioRepo.getById(id);
    if (!p) {
      const err: any = new Error("Precio no encontrado");
      err.status = 404;
      throw err;
    }
    return p;
  },

  create: async (dto: PrecioCreateDTO) => {
    try {
      return await precioRepo.create(dto);
    } catch (e: any) {
      if (e?.code === "P2003") {
        const err: any = new Error("El servicio no existe");
        err.status = 409;
        throw err;
      }
      if (e?.code === "P2002") {
        const err: any = new Error("Ya existe un precio para ese servicio y fecha");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: PrecioUpdateDTO) => {
    try {
      return await precioRepo.update(id, dto);
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err: any = new Error("Precio no encontrado");
        err.status = 404;
        throw err;
      }
      if (e?.code === "P2002") {
        const err: any = new Error("Conflicto: ya existe un precio con esa fecha");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    try {
      await precioRepo.remove(id);
      return { ok: true };
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err: any = new Error("Precio no encontrado");
        err.status = 404;
        throw err;
      }
      throw e;
    }
  },
};
