import { createApp } from './core/http/expressApp.js';
const PORT = Number(process.env.PORT ?? 3000);

// Esto lo usamos para evitar el error de BigInt cant be serialized
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

createApp().listen(PORT, () => console.log(`API is listening on: http://localhost:${PORT}`));