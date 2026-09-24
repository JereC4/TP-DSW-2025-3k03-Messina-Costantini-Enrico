/**
 * Capa de servicios del frontend: una función por endpoint, tipada con los modelos de `types.ts`.
 */
import { api } from "./base";
import type {
  Campo, Categoria, Cercania, Contratista, Insumo, Localidad, Notificacion, Page, Precio, Provincia, ReferenciaPrecio, Resumen, RoleName,
  Servicio, Solicitud, SolicitudEstado, SolicitudResumen, Usuario, Valoracion, InsumoProveedor,
} from "./types";

export * from "./types";
export { getApiErrorMessage } from "./base";

/* ---------- Auth ---------- */
export interface AuthResponse { token: string; user: Usuario }
export interface RegisterPayload { email: string; password: string; nombre: string; apellido: string; rol: "PRODUCTOR" | "CONTRATISTA"; id_localidad?: number | null; telefono?: string | null }
export interface UpdateMePayload {
  nombre?: string; apellido?: string; cuil_cuit?: string | null; telefono?: string | null; fecha_nac?: string | null; domicilio?: string | null;
  id_localidad?: number | null; razon_social?: string | null; descripcion?: string | null; anios_experiencia?: number | null;
  /** Base de operaciones del contratista, para calcular distancias. */
  latitud?: number | null; longitud?: number | null;
}
export const auth = {
  login: async (email: string, password: string) => (await api.post<AuthResponse>("/auth/login", { email, password })).data,
  register: async (data: RegisterPayload) => (await api.post<AuthResponse>("/auth/register", data)).data,
  me: async () => (await api.get<Usuario>("/auth/me")).data,
  updateMe: async (data: UpdateMePayload) => (await api.put<Usuario>("/auth/me", data)).data,
  changePassword: async (password_actual: string, password_nueva: string) => (await api.put<{ ok: boolean }>("/auth/me/password", { password_actual, password_nueva })).data,
  resumen: async () => (await api.get<Resumen>("/auth/me/resumen")).data,
  /** Sube (o reemplaza) la foto de perfil. Formatos: JPG, PNG o WebP, hasta 5 MB. */
  uploadFoto: async (file: File) => {
    const form = new FormData();
    form.append("foto", file);
    return (await api.post<Usuario>("/auth/me/foto", form)).data;
  },
  /** Quita la foto de perfil; vuelve al avatar por iniciales. */
  deleteFoto: async () => (await api.delete<Usuario>("/auth/me/foto")).data,
};

/* ---------- Catálogos ---------- */
export const provincias = {
  list: async (q?: string) => (await api.get<Provincia[]>("/provincias", { params: { q } })).data,
  create: async (nombre: string) => (await api.post<Provincia>("/provincias", { nombre })).data,
  update: async (id: number, nombre: string) => (await api.put<Provincia>(`/provincias/${id}`, { nombre })).data,
  remove: async (id: number) => { await api.delete(`/provincias/${id}`); },
};

export type LocalidadInput = { id_provincia: number; nombre: string; codigo_postal?: string | null; latitud?: number | null; longitud?: number | null };
export const localidades = {
  list: async (params?: { q?: string; id_provincia?: number }) => (await api.get<Localidad[]>("/localidades", { params })).data,
  create: async (data: LocalidadInput) => (await api.post<Localidad>("/localidades", data)).data,
  update: async (id: number, data: Partial<Omit<LocalidadInput, "id_provincia">>) => (await api.put<Localidad>(`/localidades/${id}`, data)).data,
  remove: async (id: number) => { await api.delete(`/localidades/${id}`); },
};

export const categorias = {
  list: async (q?: string) => (await api.get<Categoria[]>("/categorias-servicio", { params: { q } })).data,
  create: async (data: { nombre: string; descripcion?: string | null }) => (await api.post<Categoria>("/categorias-servicio", data)).data,
  update: async (id: number, data: { nombre?: string; descripcion?: string | null }) => (await api.put<Categoria>(`/categorias-servicio/${id}`, data)).data,
  remove: async (id: number) => { await api.delete(`/categorias-servicio/${id}`); },
};

export type InsumoInput = { nombre: string; descripcion?: string | null; unidad: string; precio_referencia: number };
export const insumos = {
  list: async (q?: string) => (await api.get<Insumo[]>("/insumos", { params: { q } })).data,
  create: async (data: InsumoInput) => (await api.post<Insumo>("/insumos", data)).data,
  update: async (id: number, data: Partial<InsumoInput>) => (await api.put<Insumo>(`/insumos/${id}`, data)).data,
  remove: async (id: number) => { await api.delete(`/insumos/${id}`); },
};

/* ---------- Usuarios (ADMIN) ---------- */
export type UsuarioInput = {
  email: string; password?: string; nombre: string; apellido: string; roles: RoleName[];
  cuil_cuit?: string | null; telefono?: string | null; domicilio?: string | null; id_localidad?: number | null;
  razon_social?: string | null; descripcion?: string | null; anios_experiencia?: number | null;
};
export const usuarios = {
  list: async (params?: { q?: string; role?: RoleName; page?: number; pageSize?: number }) => (await api.get<Page<Usuario>>("/usuarios", { params })).data,
  get: async (id: number) => (await api.get<Usuario>(`/usuarios/${id}`)).data,
  create: async (data: UsuarioInput) => (await api.post<Usuario>("/usuarios", data)).data,
  update: async (id: number, data: Partial<UsuarioInput>) => (await api.put<Usuario>(`/usuarios/${id}`, data)).data,
  remove: async (id: number) => { await api.delete(`/usuarios/${id}`); },
};

/* ---------- Contratistas (público) ---------- */
export type ContratistaQuery = { q?: string; id_localidad?: number; id_provincia?: number; id_campo?: number; id_categoria?: number; verificado?: boolean; radio_km?: number; orden?: "distancia" | "apellido"; page?: number; pageSize?: number };
export const contratistas = {
  list: async (params?: ContratistaQuery) =>
    (await api.get<Page<Contratista> & { alcance: "localidad" | "provincia" | "todos" | "radio"; cercania?: Cercania }>("/contratistas", { params })).data,
  get: async (id: number) => (await api.get<Contratista>(`/contratistas/${id}`)).data,
  /** Solo ADMIN: otorga o quita la insignia de verificado. */
  verificar: async (id: number, verificado: boolean) => (await api.put<Contratista>(`/contratistas/${id}/verificado`, { verificado })).data,
};

/* ---------- Servicios y precios ---------- */
export type ServicioQuery = { q?: string; id_categoria?: number; id_contratista?: number; id_provincia?: number; id_localidad?: number; incluir_inactivos?: boolean; page?: number; pageSize?: number };
export type ServicioInput = { nombre: string; descripcion?: string | null; id_categoria: number; precio_inicial?: number };
export const servicios = {
  list: async (params?: ServicioQuery) => (await api.get<Page<Servicio>>("/servicios", { params })).data,
  get: async (id: number) => (await api.get<Servicio>(`/servicios/${id}`)).data,
  create: async (data: ServicioInput) => (await api.post<Servicio>("/servicios", data)).data,
  update: async (id: number, data: Partial<Omit<ServicioInput, "precio_inicial">> & { activo?: boolean }) => (await api.put<Servicio>(`/servicios/${id}`, data)).data,
  desactivar: async (id: number) => (await api.delete<Servicio>(`/servicios/${id}`)).data,
  /** Precio de mercado de la categoría, calculado con los precios vigentes del sistema. */
  referenciaPrecio: async (id: number) => (await api.get<ReferenciaPrecio>(`/servicios/${id}/referencia-precio`)).data,
};

export const precios = {
  listByServicio: async (id_servicio: number) => (await api.get<Precio[]>(`/precios/servicio/${id_servicio}`)).data,
  create: async (id_servicio: number, valor: number, fecha_desde: string) => (await api.post<Precio>("/precios", { id_servicio, valor, fecha_desde })).data,
  update: async (id: number, data: Partial<{ valor: number; fecha_desde: string }>) => (await api.put<Precio>(`/precios/${id}`, data)).data,
  remove: async (id: number) => { await api.delete(`/precios/${id}`); },
};

/* ---------- Campos ---------- */
export type CampoInput = { nombre: string; id_localidad: number; hectareas: number; latitud?: number | null; longitud?: number | null; id_productor?: number };
export const campos = {
  list: async (params?: { q?: string; id_productor?: number }) => (await api.get<Campo[]>("/campos", { params })).data,
  get: async (id: number) => (await api.get<Campo>(`/campos/${id}`)).data,
  create: async (data: CampoInput) => (await api.post<Campo>("/campos", data)).data,
  update: async (id: number, data: Partial<Omit<CampoInput, "id_productor">>) => (await api.put<Campo>(`/campos/${id}`, data)).data,
  remove: async (id: number) => { await api.delete(`/campos/${id}`); },
};

/* ---------- Solicitudes ---------- */
export type SolicitudQuery = { estado?: SolicitudEstado; id_campo?: number; id_productor?: number; id_contratista?: number; page?: number; pageSize?: number };
export type SolicitudInput = {
  id_servicio: number; id_campo: number; hectareas_trabajadas: number;
  fecha_inicio?: string | null; fecha_fin?: string | null; observaciones?: string | null;
  insumos: { id_insumo: number; cantidad: number; proveedor: InsumoProveedor }[];
};
export type EstadoInput = { estado: Exclude<SolicitudEstado, "pendiente">; fecha_inicio?: string | null; fecha_fin?: string | null; motivo?: string | null };
export const solicitudes = {
  list: async (params?: SolicitudQuery) => (await api.get<Page<SolicitudResumen>>("/solicitudes", { params })).data,
  get: async (id: number) => (await api.get<Solicitud>(`/solicitudes/${id}`)).data,
  create: async (data: SolicitudInput) => (await api.post<Solicitud>("/solicitudes", data)).data,
  cambiarEstado: async (id: number, data: EstadoInput) => (await api.patch<Solicitud>(`/solicitudes/${id}/estado`, data)).data,
  remove: async (id: number) => { await api.delete(`/solicitudes/${id}`); },
};

/* ---------- Valoraciones ---------- */
export const notificaciones = {
  /** El listado ya trae `no_leidas`, así el badge se actualiza con la misma request. */
  list: async (params?: { page?: number; pageSize?: number; no_leidas?: boolean }) =>
    (await api.get<Page<Notificacion> & { no_leidas: number }>("/notificaciones", { params })).data,
  noLeidas: async () => (await api.get<{ no_leidas: number }>("/notificaciones/no-leidas")).data,
  leer: async (id: number) => (await api.post<{ ok: true; no_leidas: number }>(`/notificaciones/${id}/leer`)).data,
  leerTodas: async () => (await api.post<{ ok: true; marcadas: number; no_leidas: number }>("/notificaciones/leer-todas")).data,
};

export const valoraciones = {
  list: async (params: { id_contratista?: number; id_servicio?: number }) => (await api.get<{ items: Valoracion[]; promedio: number | null; cantidad: number }>("/valoraciones", { params })).data,
  create: async (data: { id_solicitud: number; puntaje: number; comentario?: string | null }) => (await api.post<Valoracion>("/valoraciones", data)).data,
};
