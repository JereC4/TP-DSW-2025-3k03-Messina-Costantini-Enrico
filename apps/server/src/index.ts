import express, { Request, Response, NextFunction } from 'express'
import { User } from './user/user.entity.js';

const app = express()
app.use(express.json());

//Luego de los middlewares base

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//Antes de las rutas y middlewares de negocio


//app.use('/users', userRouter());

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})