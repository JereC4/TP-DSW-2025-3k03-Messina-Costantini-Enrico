import { servicioRepo } from "./servicio.repository.js";
import type { ServicioCreateDTO, ServicioUpdateDTO } from "./servicio.schema.ts";

export const servicioService = {
  list: (q?: string, id_categoria?: bigint, id_prestamista?: bigint) =>
    servicioRepo.list(q, id_categoria, id_prestamista),

  getById: async (id: bigint) => {
    const s = await servicioRepo.getById(id);
    if (!s) {
      const err: any = new Error("Servicio no encontrado");
      err.status = 404;
      throw err;
    }
    return s;
  },

  create: async (dto: ServicioCreateDTO) => {
    try {
      return await servicioRepo.create(dto);
    } catch (e: any) {
      if (e?.code === "P2003") {
        const err: any = new Error(
          "Datos inválidos: verifique la categoría y el prestamista"
        );
        err.status = 409;
        throw err;
      }
      if (e?.code === "P2002") {
        const err: any = new Error("Ya existe un servicio con esos datos");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: ServicioUpdateDTO) => {
    try {
      return await servicioRepo.update(id, dto);
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err: any = new Error("Servicio no encontrado");
        err.status = 404;
        throw err;
      }
      if (e?.code === "P2003") {
        const err: any = new Error(
          "Datos inválidos: verifique la categoría y el prestamista"
        );
        err.status = 409;
        throw err;
      }
      if (e?.code === "P2002") {
        const err: any = new Error("Conflicto de datos (restricción única)");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    try {
      await servicioRepo.remove(id);
      return { ok: true };
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err: any = new Error("Servicio no encontrado");
        err.status = 404;
        throw err;
      }
      if (e?.code === "P2003") {
        const err: any = new Error(
          "No se puede eliminar: existen registros asociados a este servicio"
        );
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },
};
