import { api } from "./base";

export interface Usuario {
  id_user: number;
  email: string;
  nombre: string;
  apellido: string;
  cuil_cuit?: string | null;
  fecha_nac?: string | null; // ISO date (YYYY-MM-DD o full ISO)
  domicilio?: string | null;
  id_localidad?: number | null;
}

export type UsuarioUpdateInput = {
  email?: string;
  nombre?: string;
  apellido?: string;
  cuil_cuit?: string | null;
  fecha_nac?: string | null;
  domicilio?: string | null;
  id_localidad?: number | null;
};

export async function getUsuario(id: number): Promise<Usuario> {
  const res = await api.get<Usuario>(`/usuarios/${id}`);
  return res.data;
}

export async function updateUsuario(
  id: number,
  data: UsuarioUpdateInput
): Promise<Usuario> {
  const res = await api.put<Usuario>(`/usuarios/${id}`, data);
  return res.data;
}
