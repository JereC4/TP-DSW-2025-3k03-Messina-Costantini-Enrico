import { clienteRepo } from "./cliente.repository.js";
import { type ClienteCreateDto, type ClienteUpdateDto } from "./cliente.schema.js";

export const clienteService = {
  list: () => clienteRepo.list(),

  get: async (id: bigint) => {
    const c = await clienteRepo.getById(id);
    if (!c) throw { status: 404, code: "NOT_FOUND", message: "Cliente no encontrado" };
    return c;
  },

  create: async (dto: ClienteCreateDto) => {
    try {
      return await clienteRepo.create(dto);
    } catch (e: any) {
      if (e.code === "P2003")
        throw { status: 400, code: "FK_INVALID", message: "Usuario inexistente" };
      throw e;
    }
  },

  update: async (id: bigint, dto: ClienteUpdateDto) => {
    await clienteService.get(id);
    return clienteRepo.update(id, dto);
  },

  remove: async (id: bigint) => {
    await clienteService.get(id);
    return clienteRepo.remove(id);
  },
};
