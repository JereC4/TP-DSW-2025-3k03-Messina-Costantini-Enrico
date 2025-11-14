import {
  CreateSolicitudInput,
  UpdateSolicitudEstadoInput,
  SolicitudEstado,
} from "./solicitud.schema.js";
import { solicitudRepo } from "./solicitud.repository.js";

export const solicitudService = {
  list(estado?: SolicitudEstado) {
    return solicitudRepo.list(estado);
  },

  getById(id: number) {
    return solicitudRepo.getById(id);
  },

  create(data: CreateSolicitudInput) {
    return solicitudRepo.create(data);
  },

  updateEstado(id: number, data: UpdateSolicitudEstadoInput) {
    return solicitudRepo.updateEstado(id, data);
  },

  delete(id: number) {
    return solicitudRepo.delete(id);
  },
};

