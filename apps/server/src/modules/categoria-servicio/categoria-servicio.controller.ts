import { Request, Response } from "express";
import {
  CategoriaServicioCreateSchema,
  CategoriaServicioIdSchema,
  CategoriaServicioUpdateSchema,
} from "./categoria-servicio.schema.js";
import { categoriaServicioService } from "./categoria-servicio.service.js";

export const CategoriaServicioController = {
  list: async (req: Request, res: Response) => {
    const { q } = req.query as any;
    const data = await categoriaServicioService.list(q);
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const { id } = CategoriaServicioIdSchema.parse(req.params);
    const data = await categoriaServicioService.getById(BigInt(id));
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const dto = CategoriaServicioCreateSchema.parse(req.body);
    const data = await categoriaServicioService.create(dto);
    res.status(201).json(data);
  },

  update: async (req: Request, res: Response) => {
    const { id } = CategoriaServicioIdSchema.parse(req.params);
    const dto = CategoriaServicioUpdateSchema.parse(req.body);
    const data = await categoriaServicioService.update(BigInt(id), dto);
    res.json(data);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = CategoriaServicioIdSchema.parse(req.params);
    const data = await categoriaServicioService.remove(BigInt(id));
    res.json(data);
  },
};
