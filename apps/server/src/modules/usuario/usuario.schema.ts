import { z } from 'zod';

export const UsuarioCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1).max(100),
  apellido: z.string().min(1).max(100),
  cuil_cuit: z.string().max(20).optional().nullable(),
  fecha_nac: z.coerce.date().optional().nullable(),  // 'YYYY-MM-DD'
  domicilio: z.string().max(255).optional().nullable(),
  id_localidad: z.coerce.bigint().positive().optional().nullable(), // FK opcional
  roles: z.array(z.enum(['ADMIN', 'CLIENTE', 'PRESTAMISTA'])).optional().default([]),
});

export const UsuarioUpdateSchema = UsuarioCreateSchema.partial().extend({
  password: z.string().min(6).optional(), // si viene, se re-hashea
});

export const UsuarioParamsSchema = z.object({
  id: z.coerce.bigint().positive(),
});

export type UsuarioCreateDto = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdateDto = z.infer<typeof UsuarioUpdateSchema>;
