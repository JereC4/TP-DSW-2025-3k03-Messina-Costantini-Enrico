import { Router } from "express";
import { solicitudController } from "./solicitud.controller.js";

const solicitudRouter = Router();

// router.use(requireAuth);

// GET /solicitudes
solicitudRouter.get("/", solicitudController.list);

// GET /solicitudes/:id
solicitudRouter.get("/:id", solicitudController.getById);

// POST /solicitudes
solicitudRouter.post("/", solicitudController.create);

// PATCH /solicitudes/:id/estado
solicitudRouter.patch("/:id/estado", solicitudController.updateEstado);

// DELETE /solicitudes/:id
solicitudRouter.delete("/:id", solicitudController.delete);

export default solicitudRouter;

