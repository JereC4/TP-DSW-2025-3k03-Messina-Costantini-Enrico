import { z } from "zod";

export const ServicioIdSchema = z.object({
  id: z.coerce.bigint(),
});

export const ServicioCreateSchema = z.object({
  nombre: z.string().min(2).max(120),
  descripcion: z.string().max(255).optional().nullable(),
  id_categoria: z.coerce.bigint(),   // FK -> categoria.id_categoria
  id_prestamista: z.coerce.bigint(), // FK -> (usuario) prestamista
});

export const ServicioUpdateSchema = z.object({
  nombre: z.string().min(2).max(120).optional(),
  descripcion: z.string().max(255).optional().nullable(),
  id_categoria: z.coerce.bigint().optional(),
  id_prestamista: z.coerce.bigint().optional(),
});

export type ServicioCreateDTO = z.infer<typeof ServicioCreateSchema>;
export type ServicioUpdateDTO = z.infer<typeof ServicioUpdateSchema>;
