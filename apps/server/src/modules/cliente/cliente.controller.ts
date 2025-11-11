import { Request, Response, NextFunction } from "express";
import {
  ClienteCreateSchema,
  ClienteParamsSchema,
  ClienteUpdateSchema,
} from "./cliente.schema.js";
import { clienteService } from "./cliente.service.js";

export const list = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await clienteService.list());
  } catch (e) {
    next(e);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ClienteParamsSchema.parse(req.params);
    res.json(await clienteService.get(id));
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = ClienteCreateSchema.parse(req.body);
    const created = await clienteService.create(dto);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ClienteParamsSchema.parse(req.params);
    const dto = ClienteUpdateSchema.parse(req.body);
    res.json(await clienteService.update(id, dto));
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ClienteParamsSchema.parse(req.params);
    await clienteService.remove(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
