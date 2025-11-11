import { Request, Response, NextFunction } from "express";
import {
  PrestamistaCreateSchema,
  PrestamistaParamsSchema,
  PrestamistaUpdateSchema,
} from "./prestamista.schema.js";
import { prestamistaService } from "./prestamista.service.js";

export const list = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await prestamistaService.list());
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = PrestamistaParamsSchema.parse(req.params);
    res.json(await prestamistaService.get(id));
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = PrestamistaCreateSchema.parse(req.body);
    const created = await prestamistaService.create(dto);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = PrestamistaParamsSchema.parse(req.params);
    const dto = PrestamistaUpdateSchema.parse(req.body);
    res.json(await prestamistaService.update(id, dto));
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = PrestamistaParamsSchema.parse(req.params);
    await prestamistaService.remove(id);
    res.status(204).send();
  } catch (e) { next(e); }
};
