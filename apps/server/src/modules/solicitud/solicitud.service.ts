import {
  CreateSolicitudInput,
  CreateSolicitudInputSchema,
  UpdateSolicitudEstadoInput,
  UpdateSolicitudEstadoSchema,
} from "./solicitud.schema.js";
import { SolicitudRepository } from "./solicitud.repository.js";

const repo = new SolicitudRepository();

export class SolicitudService {
  async getById(id: string) {
    const idBig = BigInt(id);
    const sol = await repo.findById(idBig);
    if (!sol) throw new Error("Solicitud no encontrada");
    return sol;
  }

  async listAll() {
    return repo.listAll();
  }

  async listByCliente(id_cliente: string) {
    return repo.listByCliente(BigInt(id_cliente));
  }

  async listByPrestamista(id_prestamista: string) {
    return repo.listByPrestamista(BigInt(id_prestamista));
  }

  async createSolicitud(input: unknown) {
    const data = CreateSolicitudInputSchema.parse(input);

    // Reglas de negocio adicionales
    if (data.fecha_inicio && data.fecha_fin) {
      const ini = new Date(data.fecha_inicio);
      const fin = new Date(data.fecha_fin);
      if (fin < ini) {
        throw new Error("La fecha_fin no puede ser anterior a fecha_inicio");
      }
    }

    return repo.createWithInsumos(data as CreateSolicitudInput);
  }

  async actualizarEstado(id_solicitud: string, input: unknown) {
    const data = UpdateSolicitudEstadoSchema.parse(input);
    return repo.updateEstado(BigInt(id_solicitud), data);
  }
}
