import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message = err.message ?? 'Error interno';
  res.status(status).json({ code, message, details: err.details });
}