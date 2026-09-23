import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../core/auth/middleware.js";
import { badRequest } from "../../core/errors/errors.js";
import * as c from "./auth.controller.js";

const r = Router();

const FOTO_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const fotoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!FOTO_MIME_TYPES.includes(file.mimetype)) return cb(badRequest("FOTO_FORMATO_INVALIDO", "Formatos permitidos: JPG, PNG o WebP") as unknown as Error);
    cb(null, true);
  },
});

r.post("/login", c.login);
r.post("/register", c.register);
r.get("/me", requireAuth, c.me);
r.put("/me", requireAuth, c.updateMe);
r.put("/me/password", requireAuth, c.changePassword);
r.get("/me/resumen", requireAuth, c.resumen);
r.post("/me/foto", requireAuth, fotoUpload.single("foto"), c.uploadFoto);
r.delete("/me/foto", requireAuth, c.deleteFoto);

export default r;
