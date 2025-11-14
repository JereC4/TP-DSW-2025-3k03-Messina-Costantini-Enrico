import { api } from "./base";

export type SolicitudEstado =
  | "pendiente"
  | "aceptada"
  | "rechazada"
  | "completada";

export type SolicitudInsumoProveedor = "CLIENTE" | "PRESTAMISTA";

export type SolicitudInsumo = {
  id_solicitud_insumo?: number;
  id_insumo: number;
  cantidad: number;
  precio_unit: number;
  proveedor: SolicitudInsumoProveedor;
};

export type Solicitud = {
  id_solicitud: number;

  id_servicio: number;
  id_cliente: number;
  id_prestamista: number;
  id_campo: number;

  estado: SolicitudEstado;
  fecha_solicitud: string;      // ISO
  fecha_inicio: string | null;  // ISO o null
  fecha_fin: string | null;     // ISO o null

  hectareas_trabajadas: number;
  precio_servicio: number;
  costo_insumos: number;
  precio_total: number;

  servicio?: { nombre: string };
  cliente_profile?: { nombre: string; apellido: string };
  prestamista_profile?: { nombre: string; apellido: string };
  campo?: { nombre: string };

  solicitud_insumo?: SolicitudInsumo[];
};

export type CreateSolicitudInput = {
  id_servicio: number | string;
  id_cliente: number | string;
  id_prestamista: number | string;
  id_campo: number | string;
  hectareas_trabajadas: number;
  fecha_inicio?: string; // ISO
  fecha_fin?: string;    // ISO
  insumos: SolicitudInsumo[];
};

export type UpdateSolicitudEstadoInput = {
  estado: SolicitudEstado;
  fecha_inicio?: string; // ISO
  fecha_fin?: string;    // ISO
};

export const getSolicitudes = async (estado?: SolicitudEstado) =>
  (
    await api.get<Solicitud[]>("/solicitudes", {
      params: { estado },
    })
  ).data;

export const getSolicitudById = async (id: number) =>
  (await api.get<Solicitud>(`/solicitudes/${id}`)).data;

export const createSolicitud = async (data: CreateSolicitudInput) =>
  (await api.post<Solicitud>("/solicitudes", data)).data;

export const updateSolicitudEstado = async (
  id: number,
  data: UpdateSolicitudEstadoInput
) =>
  (await api.patch<Solicitud>(`/solicitudes/${id}/estado`, data)).data;

export const deleteSolicitud = async (id: number) =>
  (await api.delete<{ ok: boolean }>(`/solicitudes/${id}`)).data;
