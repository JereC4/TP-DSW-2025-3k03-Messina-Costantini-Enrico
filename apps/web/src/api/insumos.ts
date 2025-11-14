import { api } from "./base";

export type Insumo = {
  id_insumo: number;
  nombre: string;
  descripcion?: string | null;
};

export const getInsumos = async (q?: string) =>
  (await api.get<Insumo[]>("/insumos", { params: { q } })).data;

export const getInsumoById = async (id: number) =>
  (await api.get<Insumo>(`/insumos/${id}`)).data;

export const createInsumo = async (nombre: string, descripcion?: string | null) =>
  (await api.post<Insumo>("/insumos", { nombre, descripcion })).data;

export const updateInsumo = async (
  id: number,
  data: Partial<{ nombre: string; descripcion?: string | null }>
) => (await api.put<Insumo>(`/insumos/${id}`, data)).data;

export const deleteInsumo = async (id: number) =>
  (await api.delete(`/insumos/${id}`)).data as { ok?: boolean };
