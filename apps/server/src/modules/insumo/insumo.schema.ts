import { z } from "zod";

export const InsumoIdSchema = z.object({
  id: z.coerce.bigint(),
});

export const InsumoCreateSchema = z.object({
  nombre: z.string().min(2).max(120),
  descripcion: z.string().max(255).optional().nullable(),
});

export const InsumoUpdateSchema = z.object({
  nombre: z.string().min(2).max(120).optional(),
  descripcion: z.string().max(255).optional().nullable(),
});

export type InsumoCreateDTO = z.infer<typeof InsumoCreateSchema>;
export type InsumoUpdateDTO = z.infer<typeof InsumoUpdateSchema>;
