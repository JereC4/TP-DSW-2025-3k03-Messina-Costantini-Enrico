import { Request, Response, NextFunction } from 'express';
import { UsuarioCreateSchema, UsuarioParamsSchema, UsuarioUpdateSchema } from './usuario.schema.js';
import { usuarioService } from './usuario.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const id_localidad = typeof req.query.id_localidad === 'string'
      ? BigInt(req.query.id_localidad)
      : undefined;
    const role = typeof req.query.role === 'string' ? req.query.role : undefined;

    const data = await usuarioService.list(q, id_localidad, role);
    res.json(data);
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = UsuarioParamsSchema.parse(req.params);
    res.json(await usuarioService.get(id));
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = UsuarioCreateSchema.parse(req.body);
    const created = await usuarioService.create(dto);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = UsuarioParamsSchema.parse(req.params);
    const dto = UsuarioUpdateSchema.parse(req.body);
    res.json(await usuarioService.update(id, dto));
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = UsuarioParamsSchema.parse(req.params);
    await usuarioService.remove(id);
    res.status(204).send();
  } catch (e) { next(e); }
};
