import { Router } from "express";
import { InsumoController } from "./insumo.controller.js";

export const insumoRouter = Router();

insumoRouter.get("/",     InsumoController.list);
insumoRouter.get("/:id",  InsumoController.get);
insumoRouter.post("/",    InsumoController.create);
insumoRouter.put("/:id",  InsumoController.update);
insumoRouter.delete("/:id", InsumoController.remove);
