import { z } from "zod";

export const InsumoIdSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export const InsumoCreateSchema = z.object({
  nombre: z.string().min(2).max(120),
  descripcion: z.string().max(255).optional().nullable(),
});

export const InsumoUpdateSchema = InsumoCreateSchema.partial();

export type InsumoCreateDTO = z.infer<typeof InsumoCreateSchema>;
export type InsumoUpdateDTO = z.infer<typeof InsumoUpdateSchema>;
