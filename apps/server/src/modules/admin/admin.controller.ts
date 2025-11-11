import { Request, Response, NextFunction } from "express";
import { AdminCreateSchema, AdminParamsSchema, AdminUpdateSchema } from "./admin.schema.js";
import { adminService } from "./admin.service.js";

export const list = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await adminService.list());
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = AdminParamsSchema.parse(req.params);
    res.json(await adminService.get(id));
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = AdminCreateSchema.parse(req.body);
    const created = await adminService.create(dto);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = AdminParamsSchema.parse(req.params);
    const dto = AdminUpdateSchema.parse(req.body);
    res.json(await adminService.update(id, dto));
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = AdminParamsSchema.parse(req.params);
    await adminService.remove(id);
    res.status(204).send();
  } catch (e) { next(e); }
};
