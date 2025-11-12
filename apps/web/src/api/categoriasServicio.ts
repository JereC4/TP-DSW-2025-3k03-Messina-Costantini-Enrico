import { api } from "./base";

export type CategoriaServicio = {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
};

export const getCategoriasServicio = async (q?: string) =>
  (await api.get<CategoriaServicio[]>("/categorias-servicio", { params: { q } })).data;

export const getCategoriaServicioById = async (id: number) => 
  (await api.get<CategoriaServicio>(`/categorias-servicio/${id}`)).data;

export const createCategoriaServicio = async (nombre: string, descripcion?: string | null) =>
  (await api.post<CategoriaServicio>("/categorias-servicio", { nombre, descripcion })).data;

export const updateCategoriaServicio = async (id: number, data: Partial<{ nombre: string; descripcion?: string | null }>) =>
  (await api.put<CategoriaServicio>(`/categorias-servicio/${id}`, data)).data;

export const deleteCategoriaServicio = async (id: number) =>
  (await api.delete(`/categorias-servicio/${id}`)).data as { ok?: boolean };
