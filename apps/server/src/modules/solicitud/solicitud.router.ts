// apps/server/src/modules/solicitud/solicitud.router.ts
import { Router } from "express";
import { SolicitudController } from "./solicitud.controller.js";
// import { authMiddleware, requireRole } from "../auth/middlewares"; // si ya los tenés

const router = Router();
const controller = new SolicitudController();

// Todas protegidas por auth (ajustar a tu implementación)
// router.use(authMiddleware);

// Listado general (ADMIN)
router.get("/", /* requireRole("ADMIN"), */ controller.listAll);

// Por cliente (para dashboard cliente)
router.get("/cliente/:idCliente", controller.listByCliente);

// Por prestamista (para dashboard prestamista)
router.get("/prestamista/:idPrestamista", controller.listByPrestamista);

// Detalle
router.get("/:id", controller.getById);

// Crear nueva solicitud (rol CLIENTE)
router.post("/", /* requireRole("CLIENTE"), */ controller.create);

// Cambiar estado (aceptar/rechazar/completar) – usualmente PRESTAMISTA
router.patch("/:id/estado", /* requireRole("PRESTAMISTA"), */ controller.updateEstado);

export { router as solicitudRouter };
