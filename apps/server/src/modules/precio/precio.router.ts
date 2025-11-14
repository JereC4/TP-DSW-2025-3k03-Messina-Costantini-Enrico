import { Router } from "express";
import { PrecioController } from "./precio.controller.js";

export const precioRouter = Router();

precioRouter.get("/", PrecioController.list);

precioRouter.get("/servicio/:id_servicio", PrecioController.listByServicio);

// CRUD por ID
precioRouter.get("/:id", PrecioController.get);
precioRouter.post("/", PrecioController.create);
precioRouter.put("/:id", PrecioController.update);
precioRouter.delete("/:id", PrecioController.remove);
