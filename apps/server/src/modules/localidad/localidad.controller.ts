import { Request, Response, NextFunction } from 'express';
import { LocalidadCreateSchema, LocalidadParamsSchema, LocalidadUpdateSchema } from './localidad.schema.js';
import { localidadService } from './localidad.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const id_provincia = typeof req.query.id_provincia === 'string'
      ? BigInt(req.query.id_provincia)
      : undefined;
    const data = await localidadService.list(q, id_provincia);
    res.json(data);
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = LocalidadParamsSchema.parse(req.params);
    const data = await localidadService.get(id);
    res.json(data);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = LocalidadCreateSchema.parse(req.body);
    const created = await localidadService.create(dto);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = LocalidadParamsSchema.parse(req.params);
    const dto = LocalidadUpdateSchema.parse(req.body);
    const updated = await localidadService.update(id, dto);
    res.json(updated);
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = LocalidadParamsSchema.parse(req.params);
    await localidadService.remove(id);
    res.status(204).send();
  } catch (e) { next(e); }
};
