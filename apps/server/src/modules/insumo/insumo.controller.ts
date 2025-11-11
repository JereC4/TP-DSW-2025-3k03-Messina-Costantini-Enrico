import { Request, Response } from "express";
import { InsumoCreateSchema, InsumoIdSchema, InsumoUpdateSchema } from "./insumo.schema.js";
import { insumoService } from "./insumo.service.js";

export const InsumoController = {
  list: async (req: Request, res: Response) => {
    const { q } = req.query as any;
    const data = await insumoService.list(q);
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const { id } = InsumoIdSchema.parse(req.params);
    const data = await insumoService.getById(BigInt(id));
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const dto = InsumoCreateSchema.parse(req.body);
    const data = await insumoService.create(dto);
    res.status(201).json(data);
  },

  update: async (req: Request, res: Response) => {
    const { id } = InsumoIdSchema.parse(req.params);
    const dto = InsumoUpdateSchema.parse(req.body);
    const data = await insumoService.update(BigInt(id), dto);
    res.json(data);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = InsumoIdSchema.parse(req.params);
    const data = await insumoService.remove(BigInt(id));
    res.json(data);
  },
};
