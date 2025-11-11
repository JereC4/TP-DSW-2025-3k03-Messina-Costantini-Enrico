import { categoriaServicioRepo } from "./categoria-servicio.repository.js";
import type {
  CategoriaServicioCreateDTO,
  CategoriaServicioUpdateDTO,
} from "./categoria-servicio.schema.ts";

export const categoriaServicioService = {
  list: (q?: string) => categoriaServicioRepo.list(q),

  getById: async (id: bigint) => {
    const cat = await categoriaServicioRepo.getById(id);
    if (!cat) throw new Error("Categoría no encontrada");
    return cat;
  },

  create: async (dto: CategoriaServicioCreateDTO) => {
    try {
      return await categoriaServicioRepo.create(dto);
    } catch (e: any) {
      if (e?.code === "P2002") {
        const err = new Error("Ya existe una categoría con ese nombre");
        (err as any).status = 409;
        throw err;
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: CategoriaServicioUpdateDTO) => {
    try {
      return await categoriaServicioRepo.update(id, dto);
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err = new Error("Categoría no encontrada");
        (err as any).status = 404;
        throw err;
      }
      if (e?.code === "P2002") {
        const err = new Error("Ya existe una categoría con ese nombre");
        (err as any).status = 409;
        throw err;
      }
      throw e;
    }
  },

  remove: async (id: bigint) => {
    try {
      await categoriaServicioRepo.remove(id);
      return { ok: true };
    } catch (e: any) {
      if (e?.code === "P2025") {
        const err = new Error("Categoría no encontrada");
        (err as any).status = 404;
        throw err;
      }
      if (e?.code === "P2003") {
        const err = new Error(
          "No se puede eliminar: existen servicios asociados a esta categoría"
        );
        (err as any).status = 409;
        throw err;
      }
      throw e;
    }
  },
};
