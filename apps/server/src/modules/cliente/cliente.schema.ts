import { z } from "zod";

export const ClienteCreateSchema = z.object({
  id_user: z.coerce.bigint().positive(),
  actividad: z.string().max(255).optional().nullable(),
  ingresos_mensuales: z.number().positive().optional().nullable(),
});

export const ClienteUpdateSchema = ClienteCreateSchema.partial();
export const ClienteParamsSchema = z.object({ id: z.coerce.bigint().positive() });

export type ClienteCreateDto = z.infer<typeof ClienteCreateSchema>;
export type ClienteUpdateDto = z.infer<typeof ClienteUpdateSchema>;
