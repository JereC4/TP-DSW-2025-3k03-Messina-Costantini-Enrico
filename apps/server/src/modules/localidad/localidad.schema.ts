import { z } from 'zod';

export const LocalidadCreateSchema = z.object({
  id_provincia: z.coerce.bigint().positive(),         // FK → provincia.id_provincia
  nombre: z.string().min(1).max(120),
  codigo_postal: z.string().max(16).optional(),
});

export const LocalidadUpdateSchema = LocalidadCreateSchema;

export const LocalidadParamsSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export type LocalidadCreateDto = z.infer<typeof LocalidadCreateSchema>;
export type LocalidadUpdateDto = z.infer<typeof LocalidadUpdateSchema>;
