// apps/web/src/api/campos.ts
import { api } from "./base.js";

export type Campo = {
  id_campo: number;
  id_cliente: number;
  coordenadas: string;
  hectareas: number;
  cliente_profile?: {
    id_user: number;
    users: {
      nombre: string;
      apellido: string;
      email: string;
    };
  } | null;
};

export type CampoCreateInput = {
  id_cliente: number;
  coordenadas: string;
  hectareas: number;
};

export type CampoUpdateInput = Partial<CampoCreateInput>;

export async function listCampos(params?: { q?: string; id_cliente?: number }) {
  const res = await api.get<Campo[]>("/campos", { params });
  return res.data;
}

export async function getCampo(id: number) {
  const res = await api.get<Campo>(`/campos/${id}`);
  return res.data;
}

export async function createCampo(data: CampoCreateInput) {
  const res = await api.post<Campo>("/campos", data);
  return res.data;
}

export async function updateCampo(id: number, data: CampoUpdateInput) {
  const res = await api.put<Campo>(`/campos/${id}`, data);
  return res.data;
}

export async function deleteCampo(id: number) {
  await api.delete(`/campos/${id}`);
}
