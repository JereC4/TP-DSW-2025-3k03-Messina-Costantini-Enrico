import { Request, Response, NextFunction } from "express";
import { solicitudService } from "./solicitud.service.js";
import {
  CreateSolicitudInputSchema,
  UpdateSolicitudEstadoSchema,
  SolicitudEstadoEnum,
  SolicitudEstado,
} from "./solicitud.schema.js";

export const solicitudController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      let estado: SolicitudEstado | undefined;

      if (req.query.estado) {
        const value = String(req.query.estado);
        if (SolicitudEstadoEnum.options.includes(value as SolicitudEstado)) {
          estado = value as SolicitudEstado;
        }
      }

      const items = await solicitudService.list(estado);
      res.json(items);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await solicitudService.getById(id);
      if (!item) {
        return res.status(404).json({ message: "Solicitud no encontrada" });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateSolicitudInputSchema.parse(req.body);
      const created = await solicitudService.create(parsed);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async updateEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const parsed = UpdateSolicitudEstadoSchema.parse(req.body);
      const updated = await solicitudService.updateEstado(id, parsed);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await solicitudService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

