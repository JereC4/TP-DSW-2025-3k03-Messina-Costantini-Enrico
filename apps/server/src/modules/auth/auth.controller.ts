import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../../../../../packages/database/src/client.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const user = await prisma.users.findUnique({
      where: { email },
      include: { user_roles: { include: { roles: true } } },
    });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Credenciales inválidas" });

    res.json({
      id_user: user.id_user,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      roles: user.user_roles.map((r) => r.roles.name),
    });
  } catch (e) {
    next(e);
  }
};
