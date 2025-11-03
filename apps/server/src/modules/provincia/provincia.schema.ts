import { z } from 'zod';

export const ProvinciaCreateSchema = z.object({
  nombre: z.string().min(1, 'nombre requerido').max(120),
});

export const ProvinciaUpdateSchema = z.object({
  nombre: z.string().min(1).max(120),
});

export const ProvinciaParamsSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export type ProvinciaCreateDto = z.infer<typeof ProvinciaCreateSchema>;
export type ProvinciaUpdateDto = z.infer<typeof ProvinciaUpdateSchema>;
