import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Routers
import provinciaRouter from '../../modules/provincia/provincia.router.js';
import localidadRouter from '../../modules/localidad/localidad.router.js';
import usuarioRouter from '../../modules/usuario/usuario.router.js';
import authRouter from "../../modules/auth/auth.router.js";

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
  app.use(errorMiddleware);
  return app;
}