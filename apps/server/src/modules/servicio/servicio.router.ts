import { Router } from "express";
import { ServicioController } from "./servicio.controller.js";

export const servicioRouter = Router();

servicioRouter.get("/", ServicioController.list);
servicioRouter.get("/:id", ServicioController.get);
servicioRouter.post("/", ServicioController.create);
servicioRouter.put("/:id", ServicioController.update);
servicioRouter.delete("/:id", ServicioController.remove);
