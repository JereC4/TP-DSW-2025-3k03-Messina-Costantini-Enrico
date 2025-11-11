import { z } from "zod";

export const AdminCreateSchema = z.object({
  id_user: z.coerce.bigint().positive(),
  area_responsable: z.string().max(100).optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export const AdminUpdateSchema = AdminCreateSchema.partial();

export const AdminParamsSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export type AdminCreateDto = z.infer<typeof AdminCreateSchema>;
export type AdminUpdateDto = z.infer<typeof AdminUpdateSchema>;
