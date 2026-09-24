/**
 * Modelos del dominio tal como los devuelve la API.
 * Los DECIMAL de Prisma llegan como string: usar `Number()` o los helpers de `lib/format`.
 */

export type RoleName = "ADMIN" | "PRODUCTOR" | "CONTRATISTA";
export type Decimal = string | number;

export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: "Administrador",
  PRODUCTOR: "Productor",
  CONTRATISTA: "Contratista",
};

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Provincia {
  id_provincia: number;
  nombre: string;
  _count?: { localidad: number };
}

export interface Localidad {
  id_localidad: number;
  id_provincia: number;
  nombre: string;
  codigo_postal?: string | null;
  /** Centro de la localidad: respaldo para calcular distancias. */
  latitud?: Decimal | null;
  longitud?: Decimal | null;
  provincia?: Provincia;
}

/** Usuario en listados públicos (sin contacto). */
export interface UsuarioPublico {
  id_user: number;
  nombre: string;
  apellido: string;
  id_localidad?: number | null;
  localidad?: Localidad | null;
  /** URL pública en Supabase Storage; null/undefined = sin foto (avatar por iniciales). */
  foto_url?: string | null;
}

/** Usuario con contacto: solo entre las partes de una solicitud, o uno mismo. */
export interface UsuarioContacto extends UsuarioPublico {
  email: string;
  telefono?: string | null;
  domicilio?: string | null;
}

/** Usuario completo (el propio, o desde el CRUD de admin). */
export interface Usuario extends UsuarioContacto {
  cuil_cuit?: string | null;
  fecha_nac?: string | null;
  roles: RoleName[];
  productor: { razon_social: string | null } | null;
  contratista: { descripcion: string | null; anios_experiencia: number | null; latitud?: Decimal | null; longitud?: Decimal | null } | null;
  created_at?: string;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
  _count?: { servicio: number };
}

export interface Insumo {
  id_insumo: number;
  nombre: string;
  descripcion?: string | null;
  unidad: string;
  precio_referencia: Decimal;
}

export interface Precio {
  id_precio: number;
  id_servicio: number;
  fecha_desde: string;
  valor: Decimal;
}

export interface ContratistaResumen {
  id_user: number;
  descripcion?: string | null;
  anios_experiencia?: number | null;
  /** Insignia otorgada por la administración tras revisar identidad y datos fiscales. */
  verificado?: boolean;
  verificado_at?: string | null;
  /** Distancia al campo elegido. Null si no se pidió cercanía o no se conoce su ubicación. */
  distancia_km?: number | null;
  /** De dónde salió el punto usado para medir. */
  punto_fuente?: "propio" | "localidad" | null;
  users: UsuarioPublico;
}

/** Contexto de la búsqueda por cercanía, presente cuando se indicó un campo. */
export interface Cercania {
  origen: { lat: number; lng: number; fuente: "campo" | "localidad_campo" | null } | null;
  radio_km: number | null;
  radio_aplicado_km: number | null;
  ampliado: boolean;
  sin_ubicacion: number;
  truncado: boolean;
  motivo: "campo_sin_coordenadas" | null;
}

/** Precio de mercado de la categoría, calculado con los precios vigentes del sistema. */
export interface ReferenciaPrecio {
  id_servicio: number;
  categoria: string;
  alcance: "provincia" | "pais";
  propio: number | null;
  mercado: { promedio: number; minimo: number; maximo: number; cantidad: number } | null;
  desvio_pct: number | null;
}

export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string | null;
  id_categoria: number;
  id_contratista: number;
  activo: boolean;
  created_at?: string;
  categoria?: Categoria;
  contratista_profile?: ContratistaResumen;
  precio_vigente: Precio | null;
  /** Solo en el detalle: historial completo (desc). */
  precios?: Precio[];
  trabajos_completados?: number;
}

export interface Contratista extends ContratistaResumen {
  servicio: (Servicio & { precio?: Precio[] })[];
  trabajos_completados: number;
  valoracion: { promedio: number | null; cantidad: number };
  /** Solo en el detalle */
  valoraciones?: { items: Valoracion[]; promedio: number | null; cantidad: number };
}

export interface Campo {
  id_campo: number;
  id_productor: number;
  id_localidad: number;
  nombre: string;
  hectareas: Decimal;
  latitud?: Decimal | null;
  longitud?: Decimal | null;
  localidad?: Localidad;
  productor_profile?: { id_user: number; razon_social?: string | null; users: UsuarioPublico };
  _count?: { solicitud: number };
  /** Solo en el detalle */
  solicitud?: SolicitudResumen[];
  /** Ficha histórica: solo para el dueño del campo y la administración. */
  resumen?: {
    trabajos_completados: number;
    hectareas_trabajadas: number;
    total_invertido: number;
    por_estado: Partial<Record<SolicitudEstado, number>>;
    ultimo_trabajo: { id_solicitud: number; fecha_fin: string | null; servicio: { nombre: string } } | null;
  } | null;
}

export type SolicitudEstado = "pendiente" | "aceptada" | "rechazada" | "cancelada" | "completada";
export const ESTADOS: SolicitudEstado[] = ["pendiente", "aceptada", "completada", "rechazada", "cancelada"];
export const ESTADO_LABELS: Record<SolicitudEstado, string> = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export type InsumoProveedor = "PRODUCTOR" | "CONTRATISTA";

export interface SolicitudInsumo {
  id_solicitud_insumo?: number;
  id_insumo: number;
  cantidad: Decimal;
  precio_unit: Decimal;
  proveedor: InsumoProveedor;
  insumo?: Insumo;
}

export interface SolicitudResumen {
  id_solicitud: number;
  id_servicio: number;
  id_productor: number;
  id_contratista: number;
  id_campo: number;
  estado: SolicitudEstado;
  fecha_solicitud: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  hectareas_trabajadas: Decimal;
  precio_hectarea: Decimal;
  precio_servicio: Decimal;
  costo_insumos: Decimal;
  precio_total: Decimal;
  motivo?: string | null;
  observaciones?: string | null;
  servicio?: { id_servicio: number; nombre: string; categoria?: Categoria };
  campo?: { id_campo: number; nombre: string; hectareas: Decimal; localidad?: Localidad };
  productor_profile?: { id_user: number; users: UsuarioPublico };
  contratista_profile?: { id_user: number; users: UsuarioPublico };
  valoracion?: { puntaje: number } | null;
}

export type EventoTipo = "creada" | "transicion" | "valoracion";
export type EventoActor = "PRODUCTOR" | "CONTRATISTA" | "ADMIN" | "SISTEMA";

/** Entrada del historial de una solicitud. Solo lectura: el backend nunca las modifica. */
export interface SolicitudEvento {
  id_evento: number;
  id_solicitud: number;
  tipo: EventoTipo;
  estado_desde: SolicitudEstado | null;
  estado_hasta: SolicitudEstado | null;
  id_actor: number | null;
  actor_rol: EventoActor;
  actor_nombre: string | null;
  detalle: string | null;
  created_at: string;
}

export interface Solicitud extends Omit<SolicitudResumen, "productor_profile" | "contratista_profile" | "valoracion"> {
  servicio?: Servicio & { categoria?: Categoria };
  campo?: Campo;
  productor_profile?: { id_user: number; razon_social?: string | null; users: UsuarioContacto };
  contratista_profile?: { id_user: number; descripcion?: string | null; users: UsuarioContacto };
  solicitud_insumo?: SolicitudInsumo[];
  solicitud_evento?: SolicitudEvento[];
  valoracion?: Valoracion | null;
}

/** Aviso dentro de la aplicación. `leida_at` en null = pendiente de leer. */
export interface Notificacion {
  id_notificacion: number;
  id_solicitud: number | null;
  titulo: string;
  cuerpo: string;
  leida_at: string | null;
  created_at: string;
}

export interface Valoracion {
  id_valoracion: number;
  id_solicitud: number;
  puntaje: number;
  comentario?: string | null;
  fecha: string;
  solicitud?: {
    id_solicitud: number;
    id_contratista: number;
    fecha_fin: string | null;
    servicio: { id_servicio: number; nombre: string };
    productor_profile: { users: UsuarioPublico };
  };
}

export interface Resumen {
  solicitudes: Partial<Record<SolicitudEstado, { cantidad: number; total: Decimal }>>;
  /** Últimos seis meses de trabajos completados, para el gráfico del panel. */
  serie: { periodo: string; cantidad: number; total: number }[];
  proximas: { id_solicitud: number; fecha_inicio: string | null; hectareas_trabajadas: Decimal; servicio: { id_servicio: number; nombre: string }; campo: { id_campo: number; nombre: string } }[];
  campos: number | null;
  servicios: number | null;
  valoracion: { promedio: number | null; cantidad: number } | null;
  usuarios: number | null;
}
