import { api } from "./base";

export type Precio = {
  id_precio: number;
  id_servicio: number;
  valor: number;
  fecha_desde: string; // ISO YYYY-MM-DD
};

export const getPrecios = async (id_servicio?: number) =>
  (await api.get<Precio[]>("/precios", { params: { id_servicio } })).data;

export const createPrecio = async (id_servicio: number, valor: number, fecha_desde: string) =>
  (await api.post<Precio>("/precios", { id_servicio, valor, fecha_desde })).data;

export const updatePrecio = async (id_precio: number, data: Partial<{ valor: number; fecha_desde: string }>) =>
  (await api.put<Precio>(`/precios/${id_precio}`, data)).data;

export const deletePrecio = async (id_precio: number) =>
  (await api.delete(`/precios/${id_precio}`)).data as { ok: boolean };
