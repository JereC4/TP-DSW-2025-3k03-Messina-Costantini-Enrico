import { z } from "zod";

export const PrecioIdSchema = z.object({
  id: z.coerce.bigint(),
});

export const PrecioCreateSchema = z.object({
  id_servicio: z.coerce.bigint(),
  fecha_desde: z.coerce.date(),
  valor: z.coerce.number().positive(),
});

export const PrecioUpdateSchema = z.object({
  fecha_desde: z.coerce.date().optional(),
  valor: z.coerce.number().positive().optional(),
});

export type PrecioCreateDTO = z.infer<typeof PrecioCreateSchema>;
export type PrecioUpdateDTO = z.infer<typeof PrecioUpdateSchema>;