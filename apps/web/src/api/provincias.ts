import axios from 'axios';

export type Provincia = { id_provincia: number; nombre: string };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const getProvincias = async (q?: string) =>
  (await api.get<Provincia[]>('/provincias', { params: { q } })).data;

export const createProvincia = async (nombre: string) =>
  (await api.post<Provincia>('/provincias', { nombre })).data;

export const updateProvincia = async (id: number, nombre: string) =>
  (await api.put<Provincia>(`/provincias/${id}`, { nombre })).data;

export const deleteProvincia = async (id: number) =>
  await api.delete(`/provincias/${id}`);
