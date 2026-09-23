/**
 * Documento OpenAPI 3 generado desde los schemas Zod de cada módulo.
 * Se sirve en GET /docs (Swagger UI) y GET /docs/openapi.json, y se exporta a docs/api/openapi.json.
 */
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi, type RouteConfig } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Habilita .openapi() en los schemas Zod (necesario para registry.register)
extendZodWithOpenApi(z);

import { ChangePasswordSchema, LoginSchema, RegisterSchema, UpdateMeSchema } from "../../modules/auth/auth.schema.js";
import { UsuarioCreateSchema, UsuarioQuerySchema, UsuarioUpdateSchema } from "../../modules/usuario/usuario.schema.js";
import { ProvinciaCreateSchema, ProvinciaQuerySchema, ProvinciaUpdateSchema } from "../../modules/provincia/provincia.schema.js";
import { LocalidadCreateSchema, LocalidadQuerySchema, LocalidadUpdateSchema } from "../../modules/localidad/localidad.schema.js";
import { CategoriaServicioCreateSchema, CategoriaServicioQuerySchema, CategoriaServicioUpdateSchema } from "../../modules/categoria-servicio/categoria-servicio.schema.js";
import { InsumoCreateSchema, InsumoQuerySchema, InsumoUpdateSchema } from "../../modules/insumo/insumo.schema.js";
import { ContratistaQuerySchema, VerificarSchema } from "../../modules/contratista/contratista.schema.js";
import { ServicioCreateSchema, ServicioQuerySchema, ServicioUpdateSchema } from "../../modules/servicio/servicio.schema.js";
import { PrecioCreateSchema, PrecioUpdateSchema } from "../../modules/precio/precio.schema.js";
import { CampoCreateSchema, CampoQuerySchema, CampoUpdateSchema } from "../../modules/campo/campo.schema.js";
import { CreateSolicitudInputSchema, SolicitudQuerySchema, UpdateSolicitudEstadoSchema } from "../../modules/solicitud/solicitud.schema.js";
import { ValoracionCreateSchema, ValoracionQuerySchema } from "../../modules/valoracion/valoracion.schema.js";
import { NotificacionQuerySchema } from "../../modules/notificacion/notificacion.schema.js";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Token devuelto por POST /auth/login. Enviar como `Authorization: Bearer <token>`.",
});

/* ---------- Schemas comunes ---------- */

const ErrorSchema = registry.register(
  "Error",
  z.object({
    code: z.string().describe("Código estable: VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, DUPLICATE, IN_USE, INVALID_TRANSITION…"),
    message: z.string(),
    details: z.any().optional().describe("En errores de validación, lista de { path, message }"),
  }),
);

const IdParam = z.object({ id: z.coerce.number().int().positive().describe("Identificador numérico") });
const anyObj = z.object({}).passthrough();
const PageOf = (name: string) =>
  registry.register(name, z.object({ items: z.array(anyObj), total: z.number(), page: z.number(), pageSize: z.number(), totalPages: z.number() }));

const PublicUserSchema = registry.register(
  "Usuario",
  z.object({
    id_user: z.number(),
    email: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    cuil_cuit: z.string().nullable(),
    telefono: z.string().nullable(),
    fecha_nac: z.string().nullable(),
    domicilio: z.string().nullable(),
    id_localidad: z.number().nullable(),
    foto_url: z.string().nullable().describe("URL pública en Supabase Storage; null = sin foto"),
    roles: z.array(z.enum(["ADMIN", "PRODUCTOR", "CONTRATISTA"])),
    productor: z.object({ razon_social: z.string().nullable() }).nullable(),
    contratista: z.object({ descripcion: z.string().nullable(), anios_experiencia: z.number().nullable() }).nullable(),
  }),
);

const AuthResponseSchema = registry.register("AuthResponse", z.object({ token: z.string(), user: PublicUserSchema }));

/* ---------- Helpers ---------- */

type Role = "ADMIN" | "PRODUCTOR" | "CONTRATISTA";

const json = (schema: z.ZodTypeAny, description: string) => ({ description, content: { "application/json": { schema } } });
const multipart = (fieldName: string, description: string) => ({ description, content: { "multipart/form-data": { schema: z.object({ [fieldName]: z.string().openapi({ format: "binary" }) }) } } });
const errors = (...codes: number[]) =>
  Object.fromEntries(
    codes.map((c) => [
      c,
      json(ErrorSchema, { 400: "Datos inválidos", 401: "Sin token o token inválido", 403: "Sin permisos", 404: "No encontrado", 409: "Conflicto de negocio" }[c] ?? "Error"),
    ]),
  );

function route(cfg: Omit<RouteConfig, "responses"> & { roles?: Role[]; responses: RouteConfig["responses"] }) {
  const { roles, ...rest } = cfg;
  const desc = roles ? `${rest.description ?? ""}\n\nRequiere rol: ${roles.join(" o ")}.`.trim() : rest.description;
  registry.registerPath({
    ...rest,
    description: desc,
    ...(roles ? { security: [{ bearerAuth: [] }] } : {}),
    responses: { ...rest.responses, ...(roles ? errors(401, 403) : {}) },
  });
}

/** CRUD estándar de catálogo: GET /, GET /:id, POST /, PUT /:id, DELETE /:id. */
function crud(opts: { tag: string; base: string; entity: string; create: z.ZodTypeAny; update: z.ZodTypeAny; query: z.ZodObject<any>; readRoles?: Role[]; writeRoles: Role[]; paged?: boolean; deleteReturns?: "204" | "json" }) {
  const { tag, base, entity, create, update, query, readRoles, writeRoles, paged, deleteReturns = "204" } = opts;
  route({ tags: [tag], method: "get", path: base, summary: `Listar ${entity}`, roles: readRoles, request: { query }, responses: { 200: json(paged ? PageOf(`Page_${tag}`) : z.array(anyObj), "Listado") } });
  route({ tags: [tag], method: "get", path: `${base}/{id}`, summary: `Detalle de ${entity}`, roles: readRoles, request: { params: IdParam }, responses: { 200: json(anyObj, "Encontrado"), ...errors(404) } });
  route({ tags: [tag], method: "post", path: base, summary: `Crear ${entity}`, roles: writeRoles, request: { body: json(create, "Datos") }, responses: { 201: json(anyObj, "Creado"), ...errors(400, 409) } });
  route({ tags: [tag], method: "put", path: `${base}/{id}`, summary: `Actualizar ${entity}`, roles: writeRoles, request: { params: IdParam, body: json(update, "Datos") }, responses: { 200: json(anyObj, "Actualizado"), ...errors(400, 404, 409) } });
  route({ tags: [tag], method: "delete", path: `${base}/{id}`, summary: `Eliminar ${entity}`, roles: writeRoles, request: { params: IdParam }, responses: { ...(deleteReturns === "204" ? { 204: { description: "Eliminado" } } : { 200: json(z.object({ ok: z.boolean() }), "Eliminado") }), ...errors(404, 409) } });
}

/* ---------- Rutas ---------- */

const all: Role[] = ["ADMIN", "PRODUCTOR", "CONTRATISTA"];

route({ tags: ["Sistema"], method: "get", path: "/health", summary: "Health check", responses: { 200: json(z.object({ ok: z.boolean() }), "OK") } });

route({ tags: ["Auth"], method: "post", path: "/auth/login", summary: "Iniciar sesión", request: { body: json(LoginSchema, "Credenciales") }, responses: { 200: json(AuthResponseSchema, "Token JWT y usuario"), ...errors(400, 401) } });
route({ tags: ["Auth"], method: "post", path: "/auth/register", summary: "Registro público como PRODUCTOR o CONTRATISTA", request: { body: json(RegisterSchema, "Datos") }, responses: { 201: json(AuthResponseSchema, "Usuario creado y logueado"), ...errors(400, 409) } });
route({ tags: ["Auth"], method: "get", path: "/auth/me", summary: "Usuario autenticado", roles: all, responses: { 200: json(PublicUserSchema, "Perfil") } });
route({ tags: ["Auth"], method: "put", path: "/auth/me", summary: "Editar el propio perfil (datos personales y del subtipo; sin roles ni email)", roles: all, request: { body: json(UpdateMeSchema, "Datos") }, responses: { 200: json(PublicUserSchema, "Perfil actualizado"), ...errors(400, 409) } });
route({ tags: ["Auth"], method: "put", path: "/auth/me/password", summary: "Cambiar contraseña (requiere la actual)", roles: all, request: { body: json(ChangePasswordSchema, "Contraseñas") }, responses: { 200: json(z.object({ ok: z.boolean() }), "OK"), ...errors(400) } });
route({ tags: ["Auth"], method: "post", path: "/auth/me/foto", summary: "Subir o reemplazar la foto de perfil", description: "Multipart con el campo `foto` (JPG, PNG o WebP, máx. 5 MB). Se redimensiona a 256x256 y se convierte a WebP antes de guardarla en Supabase Storage; reemplaza y borra la anterior si había.", roles: all, request: { body: multipart("foto", "Archivo de imagen") }, responses: { 200: json(PublicUserSchema, "Perfil actualizado"), ...errors(400) } });
route({ tags: ["Auth"], method: "delete", path: "/auth/me/foto", summary: "Quitar la foto de perfil", description: "Vuelve al avatar por iniciales.", roles: all, responses: { 200: json(PublicUserSchema, "Perfil actualizado") } });
route({ tags: ["Auth"], method: "get", path: "/auth/me/resumen", summary: "Resumen para el dashboard (solicitudes por estado, próximos trabajos, contadores)", roles: all, responses: { 200: json(anyObj, "Resumen") } });

crud({ tag: "Usuarios", base: "/usuarios", entity: "usuario", create: UsuarioCreateSchema, update: UsuarioUpdateSchema, query: UsuarioQuerySchema, readRoles: ["ADMIN"], writeRoles: ["ADMIN"], paged: true });
crud({ tag: "Provincias", base: "/provincias", entity: "provincia", create: ProvinciaCreateSchema, update: ProvinciaUpdateSchema, query: ProvinciaQuerySchema, writeRoles: ["ADMIN"] });
crud({ tag: "Localidades", base: "/localidades", entity: "localidad", create: LocalidadCreateSchema, update: LocalidadUpdateSchema, query: LocalidadQuerySchema, writeRoles: ["ADMIN"] });
crud({ tag: "Categorías", base: "/categorias-servicio", entity: "categoría de servicio", create: CategoriaServicioCreateSchema, update: CategoriaServicioUpdateSchema, query: CategoriaServicioQuerySchema, writeRoles: ["ADMIN"], deleteReturns: "json" });
crud({ tag: "Insumos", base: "/insumos", entity: "insumo (con precio de referencia y unidad)", create: InsumoCreateSchema, update: InsumoUpdateSchema, query: InsumoQuerySchema, writeRoles: ["ADMIN"], deleteReturns: "json" });

route({
  tags: ["Contratistas"],
  method: "get",
  path: "/contratistas",
  summary: "Listado público de contratistas",
  description: [
    "Con `id_campo` y sin `radio_km`, filtra por la localidad del campo y, si no hay resultados, por su provincia; `alcance` indica cuál aplicó. Además informa `distancia_km` cuando se puede medir.",
    "Con `radio_km`, el filtro geográfico pasa a ser la distancia real (Haversine): se ordena de más cerca a más lejos y se excluye a quien no tiene ubicación conocida. Si nadie entra en el radio se prueba el doble y el cuádruple, informándolo en `cercania.ampliado`.",
    "El origen es el punto del campo y, si no lo tiene, el centro de su localidad. El punto de cada contratista es el que declaró él mismo o, si no, el centro de su localidad: eso se informa en `punto_fuente`. La ubicación declarada por el contratista nunca se publica, solo la distancia derivada.",
  ].join("\n\n"),
  request: { query: ContratistaQuerySchema },
  responses: {
    200: json(
      PageOf("Page_Contratistas").extend({
        alcance: z.enum(["localidad", "provincia", "todos", "radio"]),
        cercania: z
          .object({
            origen: z.object({ lat: z.number(), lng: z.number(), fuente: z.enum(["campo", "localidad_campo"]).nullable() }).nullable(),
            radio_km: z.number().nullable(),
            radio_aplicado_km: z.number().nullable(),
            ampliado: z.boolean(),
            sin_ubicacion: z.number().describe("Contratistas excluidos por no tener ubicación conocida"),
            truncado: z.boolean().describe("El universo de candidatos superó el tope y se procesó solo una parte"),
            motivo: z.literal("campo_sin_coordenadas").nullable(),
          })
          .optional()
          .describe("Presente cuando se indicó un campo"),
      }),
      "Listado",
    ),
  },
});
route({ tags: ["Contratistas"], method: "get", path: "/contratistas/{id}", summary: "Perfil público de un contratista con servicios y valoraciones", request: { params: IdParam }, responses: { 200: json(anyObj, "Contratista"), ...errors(404) } });
route({ tags: ["Contratistas"], method: "put", path: "/contratistas/{id}/verificado", summary: "Otorgar o quitar la insignia de verificado", description: "Solo ADMIN. La insignia indica que se revisaron identidad y datos fiscales; queda registrada la fecha.", roles: ["ADMIN"], request: { params: IdParam, body: json(VerificarSchema, "Estado de la insignia") }, responses: { 200: json(anyObj, "Contratista"), ...errors(404) } });

route({ tags: ["Servicios"], method: "get", path: "/servicios", summary: "Catálogo de servicios activos (paginado, con precio vigente)", request: { query: ServicioQuerySchema }, responses: { 200: json(PageOf("Page_Servicios"), "Listado") } });
route({ tags: ["Servicios"], method: "get", path: "/servicios/{id}", summary: "Detalle con historial de precios", request: { params: IdParam }, responses: { 200: json(anyObj, "Servicio"), ...errors(404) } });
route({ tags: ["Servicios"], method: "get", path: "/servicios/{id}/referencia-precio", summary: "Precio de mercado de la categoría", description: "Promedio, mínimo y máximo de los precios vigentes de servicios comparables ya publicados en AgroApp. Empieza por la provincia del contratista y amplía al país si no hay con qué comparar.", responses: { 200: json(anyObj, "Referencia de precio"), ...errors(404) } });
route({ tags: ["Servicios"], method: "post", path: "/servicios", summary: "Publicar un servicio (CUU)", description: "El servicio pertenece al contratista autenticado. `precio_inicial` crea el precio vigente desde hoy.", roles: ["CONTRATISTA"], request: { body: json(ServicioCreateSchema, "Datos") }, responses: { 201: json(anyObj, "Creado"), ...errors(400) } });
route({ tags: ["Servicios"], method: "put", path: "/servicios/{id}", summary: "Actualizar servicio (nombre, descripción, categoría, activo)", roles: ["CONTRATISTA", "ADMIN"], request: { params: IdParam, body: json(ServicioUpdateSchema, "Datos") }, responses: { 200: json(anyObj, "Actualizado"), ...errors(400, 404) } });
route({ tags: ["Servicios"], method: "delete", path: "/servicios/{id}", summary: "Desactivar servicio (baja lógica)", roles: ["CONTRATISTA", "ADMIN"], request: { params: IdParam }, responses: { 200: json(anyObj, "Servicio desactivado"), ...errors(404) } });

const idServicioParam = z.object({ id_servicio: z.coerce.number().int().positive() });
route({ tags: ["Precios"], method: "get", path: "/precios/servicio/{id_servicio}", summary: "Historial de precios del servicio", request: { params: idServicioParam }, responses: { 200: json(z.array(anyObj), "Historial desc") } });
route({ tags: ["Precios"], method: "get", path: "/precios/servicio/{id_servicio}/vigente", summary: "Precio vigente (mayor fecha_desde ≤ hoy)", request: { params: idServicioParam }, responses: { 200: json(anyObj, "Precio"), ...errors(404) } });
route({ tags: ["Precios"], method: "get", path: "/precios/{id}", summary: "Detalle de precio", request: { params: IdParam }, responses: { 200: json(anyObj, "Precio"), ...errors(404) } });
route({ tags: ["Precios"], method: "post", path: "/precios", summary: "Cargar precio (dueño del servicio)", roles: ["CONTRATISTA", "ADMIN"], request: { body: json(PrecioCreateSchema, "Datos") }, responses: { 201: json(anyObj, "Creado"), ...errors(400, 404, 409) } });
route({ tags: ["Precios"], method: "put", path: "/precios/{id}", summary: "Actualizar precio", roles: ["CONTRATISTA", "ADMIN"], request: { params: IdParam, body: json(PrecioUpdateSchema, "Datos") }, responses: { 200: json(anyObj, "Actualizado"), ...errors(400, 404, 409) } });
route({ tags: ["Precios"], method: "delete", path: "/precios/{id}", summary: "Eliminar precio (no el único vigente de un servicio activo)", roles: ["CONTRATISTA", "ADMIN"], request: { params: IdParam }, responses: { 200: json(z.object({ ok: z.boolean() }), "Eliminado"), ...errors(404, 409) } });

route({ tags: ["Campos"], method: "get", path: "/campos", summary: "Campos del productor (ADMIN: todos)", roles: ["PRODUCTOR", "ADMIN"], request: { query: CampoQuerySchema }, responses: { 200: json(z.array(anyObj), "Listado") } });
route({ tags: ["Campos"], method: "get", path: "/campos/{id}", summary: "Detalle con solicitudes (dueño, ADMIN o contratista con solicitud sobre el campo)", roles: all, request: { params: IdParam }, responses: { 200: json(anyObj, "Campo"), ...errors(404) } });
route({ tags: ["Campos"], method: "post", path: "/campos", summary: "Registrar campo", roles: ["PRODUCTOR", "ADMIN"], request: { body: json(CampoCreateSchema, "Datos") }, responses: { 201: json(anyObj, "Creado"), ...errors(400) } });
route({ tags: ["Campos"], method: "put", path: "/campos/{id}", summary: "Actualizar campo (no se pueden reducir las hectáreas por debajo de las comprometidas)", roles: ["PRODUCTOR", "ADMIN"], request: { params: IdParam, body: json(CampoUpdateSchema, "Datos") }, responses: { 200: json(anyObj, "Actualizado"), ...errors(400, 404, 409) } });
route({ tags: ["Campos"], method: "delete", path: "/campos/{id}", summary: "Eliminar campo sin solicitudes", roles: ["PRODUCTOR", "ADMIN"], request: { params: IdParam }, responses: { 204: { description: "Eliminado" }, ...errors(404, 409) } });

route({ tags: ["Solicitudes"], method: "get", path: "/solicitudes", summary: "Listar solicitudes (productor: las suyas; contratista: las recibidas; admin: todas)", roles: all, request: { query: SolicitudQuerySchema }, responses: { 200: json(PageOf("Page_Solicitudes"), "Listado") } });
route({ tags: ["Solicitudes"], method: "get", path: "/solicitudes/{id}", summary: "Detalle completo (contacto de la contraparte, insumos, importes e historial)", description: "Incluye `solicitud_evento[]`: el historial en orden cronológico con quién hizo cada cambio de estado, cuándo y con qué motivo.", roles: all, request: { params: IdParam }, responses: { 200: json(anyObj, "Solicitud"), ...errors(404) } });
route({ tags: ["Solicitudes"], method: "post", path: "/solicitudes", summary: "Solicitar un servicio (CUU)", description: "Productor autenticado; contratista = dueño del servicio. precio_servicio = precio vigente × hectáreas; los insumos toman el precio de referencia del catálogo y solo suman si los aporta el contratista.", roles: ["PRODUCTOR"], request: { body: json(CreateSolicitudInputSchema, "Datos") }, responses: { 201: json(anyObj, "Solicitud pendiente"), ...errors(400, 404, 409) } });
route({ tags: ["Solicitudes"], method: "patch", path: "/solicitudes/{id}/estado", summary: "Cambiar estado (CUU)", description: "pendiente → aceptada | rechazada (contratista) | cancelada (productor); aceptada → completada (contratista) | cancelada (ambos, con motivo). Al aceptar se fija fecha_inicio; al completar, fecha_fin. Cada transición escribe una entrada en `solicitud_evento` dentro de la misma transacción.", roles: all, request: { params: IdParam, body: json(UpdateSolicitudEstadoSchema, "Nuevo estado") }, responses: { 200: json(anyObj, "Actualizada"), ...errors(400, 404, 409) } });
route({ tags: ["Solicitudes"], method: "delete", path: "/solicitudes/{id}", summary: "Eliminar solicitud (solo ADMIN)", roles: ["ADMIN"], request: { params: IdParam }, responses: { 204: { description: "Eliminada" }, ...errors(404) } });

route({ tags: ["Notificaciones"], method: "get", path: "/notificaciones", summary: "Avisos del usuario autenticado", description: "Devuelve la página de avisos más `no_leidas`, el contador para la campana. Con `no_leidas=true` trae solo los pendientes.", roles: all, request: { query: NotificacionQuerySchema }, responses: { 200: json(anyObj, "Listado") } });
route({ tags: ["Notificaciones"], method: "get", path: "/notificaciones/no-leidas", summary: "Cantidad de avisos sin leer", roles: all, responses: { 200: json(anyObj, "Contador") } });
route({ tags: ["Notificaciones"], method: "post", path: "/notificaciones/{id}/leer", summary: "Marcar un aviso como leído", description: "Idempotente y acotado al dueño: un aviso ajeno o ya leído responde igual, para no revelar su existencia.", roles: all, request: { params: IdParam }, responses: { 200: json(anyObj, "Contador actualizado") } });
route({ tags: ["Notificaciones"], method: "post", path: "/notificaciones/leer-todas", summary: "Marcar todos los avisos como leídos", roles: all, responses: { 200: json(anyObj, "Contador actualizado") } });

route({ tags: ["Valoraciones"], method: "get", path: "/valoraciones", summary: "Valoraciones por contratista o por servicio, con promedio", request: { query: ValoracionQuerySchema }, responses: { 200: json(z.object({ items: z.array(anyObj), promedio: z.number().nullable(), cantidad: z.number() }), "Listado") } });
route({ tags: ["Valoraciones"], method: "post", path: "/valoraciones", summary: "Valorar una solicitud completada (CUU adicional)", roles: ["PRODUCTOR"], request: { body: json(ValoracionCreateSchema, "Datos") }, responses: { 201: json(anyObj, "Creada"), ...errors(400, 404, 409) } });

/* ---------- Documento ---------- */

export function generateOpenApiDocument(serverUrl = "http://localhost:3000") {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "AgroApp API",
      version: "2.0.0",
      description:
        "API REST de AgroApp (TP Desarrollo de Software 2025, UTN FRRo). Conecta productores agropecuarios con contratistas rurales.\n\n" +
        "Autenticación con JWT: obtener el token en `POST /auth/login` y usar el botón **Authorize**. Roles: ADMIN, PRODUCTOR, CONTRATISTA.",
    },
    servers: [
      { url: serverUrl, description: "Servidor actual" },
      { url: "https://api.agroapp.dev", description: "Producción" },
    ],
    tags: [
      { name: "Auth" }, { name: "Usuarios" }, { name: "Provincias" }, { name: "Localidades" }, { name: "Categorías" }, { name: "Insumos" },
      { name: "Contratistas" }, { name: "Servicios" }, { name: "Precios" }, { name: "Campos" }, { name: "Solicitudes" }, { name: "Valoraciones" }, { name: "Sistema" },
    ],
  });
}
