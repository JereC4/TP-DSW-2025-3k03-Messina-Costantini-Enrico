import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import provinciaRouter from '../../modules/provincia/provincia.router';
import { errorMiddleware } from '../errors/errorMiddleware';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use('/provincias', provinciaRouter);
  app.use(errorMiddleware);
  return app;
}