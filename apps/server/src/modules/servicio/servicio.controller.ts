import { Request, Response } from "express";
import {
  ServicioCreateSchema,
  ServicioIdSchema,
  ServicioUpdateSchema,
} from "./servicio.schema.js";
import { servicioService } from "./servicio.service.js";

export const ServicioController = {
  list: async (req: Request, res: Response) => {
    const { q, id_categoria, id_prestamista } = req.query as any;
    const data = await servicioService.list(
      q,
      id_categoria ? BigInt(id_categoria) : undefined,
      id_prestamista ? BigInt(id_prestamista) : undefined
    );
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const { id } = ServicioIdSchema.parse(req.params);
    const data = await servicioService.getById(BigInt(id));
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const dto = ServicioCreateSchema.parse(req.body);
    const data = await servicioService.create(dto);
    res.status(201).json(data);
  },

  update: async (req: Request, res: Response) => {
    const { id } = ServicioIdSchema.parse(req.params);
    const dto = ServicioUpdateSchema.parse(req.body);
    const data = await servicioService.update(BigInt(id), dto);
    res.json(data);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = ServicioIdSchema.parse(req.params);
    const data = await servicioService.remove(BigInt(id));
    res.json(data);
  },
};
