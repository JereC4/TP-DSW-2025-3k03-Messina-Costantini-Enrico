import { api } from "./base";

export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string | null;
  id_categoria: number;
  id_prestamista: number; // SI CAMBIAMOS EL SCHEMA PARA QUE SERVICIO NO DEPENDA DE PRESTAMISTA ESTO LO VOLAMOS
  categoria?: {
    id_categoria: number;
    nombre: string;
  } | null;
}

// Listar (opcionalmente filtrando por nombre o categoría)
export const getServicios = async (q?: string, id_categoria?: number) =>
  (
    await api.get<Servicio[]>("/servicios", {
      params: { q, id_categoria },
    })
  ).data;

// Crear
export const createServicio = async (data: {
  nombre: string;
  descripcion?: string | null;
  id_categoria: number;
  id_prestamista: number; // SI CAMBIAMOS EL SCHEMA ESTO LO VOLAMOS
}) => (await api.post<Servicio>("/servicios", data)).data;

// Actualizar
export const updateServicio = async (
  id: number,
  data: Partial<{
    nombre: string;
    descripcion?: string | null;
    id_categoria: number;
    id_prestamista: number; // SI CAMBIAMOS EL SCHEMA ESTO LO VOLAMOS
  }>
) => (await api.put<Servicio>(`/servicios/${id}`, data)).data;

// Borrar
export const deleteServicio = async (id: number) =>
  (await api.delete(`/servicios/${id}`)).data;
