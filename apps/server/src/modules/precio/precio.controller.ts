import { Request, Response } from "express";
import {
  PrecioCreateSchema,
  PrecioIdSchema,
  PrecioUpdateSchema,
} from "./precio.schema.js";
import { precioService } from "./precio.service.js";

export const PrecioController = {
  // ✅ NUEVO: lista precios por id_servicio usando query param
  // GET /precios?id_servicio=123
  list: async (req: Request, res: Response) => {
    const { id_servicio } = req.query;

    // si no viene id_servicio → devolvemos lista vacía (el front lo maneja)
    if (!id_servicio) {
      return res.json([]);
    }

    let servicioId: bigint;
    try {
      servicioId = BigInt(id_servicio as string);
    } catch {
      return res.status(400).json({ message: "id_servicio inválido" });
    }

    const data = await precioService.listByServicio(servicioId);
    return res.json(data);
  },

  listByServicio: async (req: Request, res: Response) => {
    const id_servicio = BigInt(req.params.id_servicio);
    const data = await precioService.listByServicio(id_servicio);
    return res.json(data);
  },

  // GET /precios/:id
  get: async (req: Request, res: Response) => {
    const { id } = PrecioIdSchema.parse(req.params); // id ya es bigint por z.coerce.bigint
    const data = await precioService.getById(id);
    return res.json(data);
  },

  // POST /precios
  create: async (req: Request, res: Response) => {
    const dto = PrecioCreateSchema.parse(req.body);
    const data = await precioService.create(dto);
    return res.status(201).json(data);
  },

  // PUT /precios/:id
  update: async (req: Request, res: Response) => {
    const { id } = PrecioIdSchema.parse(req.params);
    const dto = PrecioUpdateSchema.parse(req.body);
    const data = await precioService.update(id, dto);
    return res.json(data);
  },

  // DELETE /precios/:id
  remove: async (req: Request, res: Response) => {
    const { id } = PrecioIdSchema.parse(req.params);
    const data = await precioService.remove(id);
    return res.json(data);
  },
};
