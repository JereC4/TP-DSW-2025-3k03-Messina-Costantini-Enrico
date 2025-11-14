import { Request, Response } from "express";
import {
  PrecioCreateSchema,
  PrecioIdSchema,
  PrecioUpdateSchema,
} from "./precio.schema.js";
import { precioService } from "./precio.service.js";

export const PrecioController = {
  listByServicio: async (req: Request, res: Response) => {
    const id_servicio = BigInt(req.params.id_servicio);
    const data = await precioService.listByServicio(id_servicio);
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const { id } = PrecioIdSchema.parse(req.params);
    const data = await precioService.getById(BigInt(id));
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const dto = PrecioCreateSchema.parse(req.body);
    const data = await precioService.create(dto);
    res.status(201).json(data);
  },

  update: async (req: Request, res: Response) => {
    const { id } = PrecioIdSchema.parse(req.params);
    const dto = PrecioUpdateSchema.parse(req.body);
    const data = await precioService.update(BigInt(id), dto);
    res.json(data);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = PrecioIdSchema.parse(req.params);
    const data = await precioService.remove(BigInt(id));
    res.json(data);
  },
};