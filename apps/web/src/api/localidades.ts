import axios from 'axios';

export type Localidad = {
  id_localidad: number;
  id_provincia: number;
  nombre: string;
  codigo_postal?: string | null;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const getLocalidades = async (q?: string, id_provincia?: number) =>
  (await api.get<Localidad[]>('/localidades', { params: { q, id_provincia } })).data;

export const getLocalidad = async (id: number) =>
  (await api.get<Localidad>(`/localidades/${id}`)).data;

export const createLocalidad = async (payload: Omit<Localidad, 'id_localidad'>) =>
  (await api.post<Localidad>('/localidades', payload)).data;

export const updateLocalidad = async (id: number, payload: Omit<Localidad, 'id_localidad'>) =>
  (await api.put<Localidad>(`/localidades/${id}`, payload)).data;

export const deleteLocalidad = async (id: number) =>
  api.delete(`/localidades/${id}`);
