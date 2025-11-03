import { Request, Response, NextFunction } from 'express';
import { ProvinciaCreateSchema, ProvinciaParamsSchema, ProvinciaUpdateSchema } from './provincia.schema.js';
import { provinciaService } from './provincia.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    res.json(await provinciaService.list(q));
  } catch (e) {
    next(e);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ProvinciaParamsSchema.parse(req.params);
    res.json(await provinciaService.get(id));
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = ProvinciaCreateSchema.parse(req.body);
    res.status(201).json(await provinciaService.create(dto));
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ProvinciaParamsSchema.parse(req.params);
    const dto = ProvinciaUpdateSchema.parse(req.body);
    res.json(await provinciaService.update(id, dto));
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ProvinciaParamsSchema.parse(req.params);
    await provinciaService.remove(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
