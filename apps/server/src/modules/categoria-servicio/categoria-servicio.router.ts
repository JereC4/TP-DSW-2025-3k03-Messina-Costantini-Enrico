import { Router } from "express";
import { CategoriaServicioController } from "./categoria-servicio.controller.js";

export const categoriaServicioRouter = Router();

categoriaServicioRouter.get("/", CategoriaServicioController.list);
categoriaServicioRouter.get("/:id", CategoriaServicioController.get);
categoriaServicioRouter.post("/", CategoriaServicioController.create);
categoriaServicioRouter.put("/:id", CategoriaServicioController.update);
categoriaServicioRouter.delete("/:id", CategoriaServicioController.remove);
