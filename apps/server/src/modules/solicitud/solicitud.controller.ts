import { Request, Response, NextFunction } from "express";
import { SolicitudService } from "./solicitud.service.js";

const service = new SolicitudService();

export class SolicitudController {
  listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await service.getById(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  listByCliente = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { idCliente } = req.params;
      const data = await service.listByCliente(idCliente);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  listByPrestamista = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { idPrestamista } = req.params;
      const data = await service.listByPrestamista(idPrestamista);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.createSolicitud(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };

  updateEstado = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await service.actualizarEstado(id, req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
}
