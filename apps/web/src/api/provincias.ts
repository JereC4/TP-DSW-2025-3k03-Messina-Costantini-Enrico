import { api } from "./base";

export type Provincia = { id_provincia: number; nombre: string };

export const getProvincias = async (q?: string) =>
  (await api.get<Provincia[]>("/provincias", { params: { q } })).data;

export const getProvinciaById = async (id: number) =>
  (await api.get<Provincia>(`/provincias/${id}`)).data;

export const createProvincia = async (nombre: string) =>
  (await api.post<Provincia>('/provincias', { nombre })).data;

export const updateProvincia = async (id: number, nombre: string) =>
  (await api.put<Provincia>(`/provincias/${id}`, { nombre })).data;

export const deleteProvincia = async (id: number) =>
  await api.delete(`/provincias/${id}`);
