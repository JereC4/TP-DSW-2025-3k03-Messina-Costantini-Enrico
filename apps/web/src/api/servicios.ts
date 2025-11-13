import { api } from "./base";

export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string | null;
  id_categoria: number;
  categoria?: {
    id_categoria: number;
    nombre: string;
  };
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
}) => (await api.post<Servicio>("/servicios", data)).data;

// Actualizar
export const updateServicio = async (
  id: number,
  data: Partial<{
    nombre: string;
    descripcion?: string | null;
    id_categoria: number;
  }>
) => (await api.put<Servicio>(`/servicios/${id}`, data)).data;

// Borrar
export const deleteServicio = async (id: number) =>
  (await api.delete(`/servicios/${id}`)).data;
