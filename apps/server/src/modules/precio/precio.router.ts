import { Router } from "express";
import { PrecioController } from "./precio.controller.js";

export const precioRouter = Router();

// precio histórico de un servicio:
precioRouter.get("/servicio/:id_servicio", PrecioController.listByServicio);

// CRUD:
precioRouter.get("/:id", PrecioController.get);
precioRouter.post("/", PrecioController.create);
precioRouter.put("/:id", PrecioController.update);
precioRouter.delete("/:id", PrecioController.remove);
