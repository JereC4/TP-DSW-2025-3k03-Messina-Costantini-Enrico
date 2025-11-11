import { adminRepo } from "./admin.repository.js";
import type { AdminCreateDto, AdminUpdateDto } from "./admin.schema.js";

export const adminService = {
  list: () => adminRepo.list(),

  get: async (id: bigint) => {
    const a = await adminRepo.getById(id);
    if (!a) throw { status: 404, code: "NOT_FOUND", message: "Admin no encontrado" };
    return a;
  },

  create: async (dto: AdminCreateDto) => {
    try {
      return await adminRepo.create({
        id_user: dto.id_user,
        area_responsable: dto.area_responsable ?? undefined, // undefined respeta default DB
        observaciones: dto.observaciones ?? null,
      });
    } catch (e: any) {
      if (e.code === "P2003") {
        // FK inválida
        throw { status: 400, code: "FK_INVALID", message: "Usuario inexistente" };
      }
      if (e.code === "P2002") {
        // PK duplicada (ya tiene perfil)
        throw { status: 409, code: "DUPLICATE", message: "El usuario ya tiene perfil de admin" };
      }
      throw e;
    }
  },

  update: async (id: bigint, dto: AdminUpdateDto) => {
    await adminService.get(id);
    return adminRepo.update(id, {
      area_responsable:
        dto.area_responsable ?? (dto.area_responsable === null ? null : undefined),
      observaciones:
        dto.observaciones ?? (dto.observaciones === null ? null : undefined),
    });
  },

  remove: async (id: bigint) => {
    await adminService.get(id);
    return adminRepo.remove(id);
  },
};
