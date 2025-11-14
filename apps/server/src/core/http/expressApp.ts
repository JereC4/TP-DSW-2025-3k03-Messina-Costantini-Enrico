import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Routers
import provinciaRouter from '../../modules/provincia/provincia.router.js';
import localidadRouter from '../../modules/localidad/localidad.router.js';
import usuarioRouter from '../../modules/usuario/usuario.router.js';
import authRouter from "../../modules/auth/auth.router.js";
import clienteRouter from "../../modules/cliente/cliente.router.js";
import prestamistaRouter from "../../modules/prestamista/prestamista.router.js";
import adminRouter from "../../modules/admin/admin.router.js";
import { categoriaServicioRouter } from "../../modules/categoria-servicio/categoria-servicio.router.js";
import { insumoRouter } from "../../modules/insumo/insumo.router.js";
import { servicioRouter } from "../../modules/servicio/servicio.router.js";
import { precioRouter } from "../../modules/precio/precio.router.js";
import campoRouter from "../../modules/campo/campo.router.js";
import { solicitudRouter } from "../../modules/solicitud/solicitud.router.js";

// Middlewares
import { errorMiddleware } from '../errors/errorMiddleware.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use('/provincias', provinciaRouter);
  app.use('/localidades', localidadRouter);
  app.use('/usuarios', usuarioRouter);
  app.use("/auth", authRouter);
  app.use("/clientes", clienteRouter);
  app.use("/prestamistas", prestamistaRouter);
  app.use("/admins", adminRouter);
  app.use("/categorias-servicio", categoriaServicioRouter);
  app.use("/insumos", insumoRouter);
  app.use("/servicios", servicioRouter);
  app.use("/precios", precioRouter);
  app.use("/campos", campoRouter);
  app.use("/solicitudes", solicitudRouter);
  app.use(errorMiddleware);
  return app;
}