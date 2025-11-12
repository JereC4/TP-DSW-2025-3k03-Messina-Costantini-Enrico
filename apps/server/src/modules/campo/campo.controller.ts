import { Request, Response, NextFunction } from "express";
import {
  CampoIdSchema,
  CampoQuerySchema,
  CampoCreateSchema,
  CampoUpdateSchema,
} from "./campo.schema.js";
import { campoService } from "./campo.service.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, id_cliente, page, pageSize } = CampoQuerySchema.parse(req.query);
    res.json(await campoService.list(q, id_cliente, page, pageSize));
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = CampoIdSchema.parse(req.params);
    res.json(await campoService.get(id));
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = CampoCreateSchema.parse(req.body);
    const created = await campoService.create(dto);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = CampoIdSchema.parse(req.params);
    const dto = CampoUpdateSchema.parse(req.body);
    res.json(await campoService.update(id, dto));
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = CampoIdSchema.parse(req.params);
    await campoService.remove(id);
    res.status(204).send();
  } catch (e) { next(e); }
};
