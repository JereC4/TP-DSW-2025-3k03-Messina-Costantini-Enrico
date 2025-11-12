import { z } from "zod";

export const CampoIdSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export const CampoQuerySchema = z.object({
  q: z.string().trim().optional(),
  id_cliente: z.coerce.bigint().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export const CampoCreateSchema = z.object({
  id_cliente: z.coerce.bigint().positive(),
  coordenadas: z.string().min(1).max(100),
  hectareas: z.coerce.number().positive(),
});

export const CampoUpdateSchema = CampoCreateSchema.partial();

export type CampoCreateDTO = z.infer<typeof CampoCreateSchema>;
export type CampoUpdateDTO = z.infer<typeof CampoUpdateSchema>;
