// apps/server/src/modules/solicitud/solicitud.schema.ts
import { z } from "zod";

export const SolicitudEstadoEnum = z.enum([
  "pendiente",
  "aceptada",
  "rechazada",
  "completada",
]);

export const SolicitudInsumoProveedorEnum = z.enum([
  "CLIENTE",
  "PRESTAMISTA",
]);

export const SolicitudInsumoInputSchema = z.object({
  id_insumo: z.union([z.number().int().positive(), z.string().min(1)]),
  cantidad: z.number().positive(),
  precio_unit: z.number().nonnegative(),
  proveedor: SolicitudInsumoProveedorEnum,
});

export const CreateSolicitudInputSchema = z.object({
  id_servicio: z.union([z.number().int().positive(), z.string().min(1)]),
  id_cliente: z.union([z.number().int().positive(), z.string().min(1)]),
  id_prestamista: z.union([z.number().int().positive(), z.string().min(1)]),
  id_campo: z.union([z.number().int().positive(), z.string().min(1)]),
  hectareas_trabajadas: z.number().positive(),
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
  insumos: z.array(SolicitudInsumoInputSchema).default([]),
});

export const UpdateSolicitudEstadoSchema = z.object({
  estado: SolicitudEstadoEnum,
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
});

export type CreateSolicitudInput = z.infer<typeof CreateSolicitudInputSchema>;
export type UpdateSolicitudEstadoInput = z.infer<
  typeof UpdateSolicitudEstadoSchema
>;
