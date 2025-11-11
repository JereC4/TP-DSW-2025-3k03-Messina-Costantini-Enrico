import { z } from "zod";

export const CategoriaServicioIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const CategoriaServicioCreateSchema = z.object({
  nombre: z.string().min(2).max(120),
  descripcion: z.string().max(255).optional().nullable(),
});

export const CategoriaServicioUpdateSchema = z.object({
  nombre: z.string().min(2).max(120).optional(),
  descripcion: z.string().max(255).optional().nullable(),
});

export type CategoriaServicioCreateDTO = z.infer<typeof CategoriaServicioCreateSchema>;
export type CategoriaServicioUpdateDTO = z.infer<typeof CategoriaServicioUpdateSchema>;
