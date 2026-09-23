import bcrypt from "bcrypt";
import sharp from "sharp";
import { prisma } from "@repo/db";
import { signToken } from "../../core/auth/jwt.js";
import type { AuthUser } from "../../core/auth/types.js";
import { badRequest } from "../../core/errors/errors.js";
import { deleteAvatarByUrl, uploadAvatar } from "../../core/storage/supabaseStorage.js";
import { usuarioRepo } from "../usuario/usuario.repository.js";
import { toPublicUser, usuarioService, type PublicUser } from "../usuario/usuario.service.js";
import type { ChangePasswordDto, LoginDto, RegisterDto, UpdateMeDto } from "./auth.schema.js";

/** Tamaño del avatar cuadrado que se guarda en Storage. */
const AVATAR_SIZE = 256;

export type AuthResponse = { token: string; user: PublicUser };

const INVALID = { status: 401, code: "INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" };


/**
 * Agrupa solicitudes completadas por mes para el gráfico del panel. Devuelve los
 * últimos `meses` en orden cronológico, incluidos los que no tuvieron trabajos,
 * para que el gráfico no mienta sobre la continuidad del tiempo.
 */
export function serieMensual(
  filas: { fecha: Date | null; total: number }[],
  hasta: Date,
  meses = 6,
): { periodo: string; cantidad: number; total: number }[] {
  const buckets = new Map<string, { periodo: string; cantidad: number; total: number }>();
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(hasta.getUTCFullYear(), hasta.getUTCMonth() - i, 1));
    const periodo = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    buckets.set(periodo, { periodo, cantidad: 0, total: 0 });
  }
  for (const f of filas) {
    if (!f.fecha) continue;
    const periodo = `${f.fecha.getUTCFullYear()}-${String(f.fecha.getUTCMonth() + 1).padStart(2, "0")}`;
    const b = buckets.get(periodo);
    if (!b) continue; // fuera de la ventana
    b.cantidad += 1;
    b.total = Math.round((b.total + f.total) * 100) / 100;
  }
  return [...buckets.values()];
}

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await usuarioRepo.getByEmail(dto.email);
    if (!user) throw INVALID;
    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw INVALID;
    return { token: signToken(user.id_user), user: toPublicUser(user) };
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { rol, ...rest } = dto;
    const user = await usuarioService.create({ ...rest, roles: [rol] });
    return { token: signToken(user.id_user), user };
  },

  me: (user: AuthUser) => usuarioService.get(user.id_user),

  updateMe: (user: AuthUser, dto: UpdateMeDto) => usuarioService.update(user.id_user, dto),

  /** Redimensiona a un cuadrado y convierte a WebP antes de subir, para que el avatar pese poco. */
  async updateFoto(user: AuthUser, file: { buffer: Buffer; mimetype: string }): Promise<PublicUser> {
    const webp = await sharp(file.buffer)
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
      .webp({ quality: 82 })
      .toBuffer()
      .catch(() => {
        throw badRequest("FOTO_INVALIDA", "No se pudo procesar la imagen; probá con otro archivo");
      });

    const previo = await usuarioRepo.getById(user.id_user);
    const foto_url = await uploadAvatar(user.id_user, webp, "image/webp", "webp");
    const row = await usuarioRepo.setFoto(user.id_user, foto_url);
    if (previo?.foto_url) void deleteAvatarByUrl(previo.foto_url);
    return toPublicUser(row);
  },

  async removeFoto(user: AuthUser): Promise<PublicUser> {
    const previo = await usuarioRepo.getById(user.id_user);
    const row = await usuarioRepo.setFoto(user.id_user, null);
    if (previo?.foto_url) void deleteAvatarByUrl(previo.foto_url);
    return toPublicUser(row);
  },

  async changePassword(user: AuthUser, dto: ChangePasswordDto) {
    const row = await usuarioRepo.getById(user.id_user);
    if (!row) throw INVALID;
    const ok = await bcrypt.compare(dto.password_actual, row.password_hash);
    if (!ok) throw badRequest("PASSWORD_INCORRECTA", "La contraseña actual no es correcta");
    if (dto.password_actual === dto.password_nueva) throw badRequest("PASSWORD_IGUAL", "La contraseña nueva debe ser distinta");
    await usuarioService.update(user.id_user, { password: dto.password_nueva });
    return { ok: true };
  },

  /** Resumen para el dashboard según el rol. */
  async resumen(user: AuthUser) {
    const esProductor = user.roles.includes("PRODUCTOR");
    const esContratista = user.roles.includes("CONTRATISTA");
    const esAdmin = user.roles.includes("ADMIN");

    const whereSol = esAdmin ? {} : esProductor ? { id_productor: user.id_user } : { id_contratista: user.id_user };
    const porEstado = await prisma.solicitud.groupBy({ by: ["estado"], where: whereSol, _count: { _all: true }, _sum: { precio_total: true } });
    const solicitudes = Object.fromEntries(porEstado.map((r) => [r.estado, { cantidad: r._count._all, total: r._sum.precio_total ?? 0 }]));

    const proximas = await prisma.solicitud.findMany({
      where: { ...whereSol, estado: "aceptada" },
      orderBy: [{ fecha_inicio: "asc" }, { fecha_solicitud: "asc" }],
      take: 5,
      include: { servicio: { select: { id_servicio: true, nombre: true } }, campo: { select: { id_campo: true, nombre: true } } },
    });

    const [campos, servicios, valoracion, usuarios] = await Promise.all([
      esProductor ? prisma.campo.count({ where: { id_productor: user.id_user } }) : Promise.resolve(null),
      esContratista ? prisma.servicio.count({ where: { id_contratista: user.id_user, activo: true } }) : Promise.resolve(null),
      esContratista
        ? prisma.valoracion.aggregate({ where: { solicitud: { id_contratista: user.id_user } }, _avg: { puntaje: true }, _count: { _all: true } })
        : Promise.resolve(null),
      esAdmin ? prisma.users.count() : Promise.resolve(null),
    ]);

    // Serie de los últimos seis meses para el gráfico del panel.
    const desde = new Date();
    desde.setUTCMonth(desde.getUTCMonth() - 5, 1);
    desde.setUTCHours(0, 0, 0, 0);
    const completadas = await prisma.solicitud.findMany({
      where: { ...whereSol, estado: "completada", fecha_fin: { gte: desde } },
      select: { fecha_fin: true, precio_total: true },
    });
    const serie = serieMensual(
      completadas.map((c) => ({ fecha: c.fecha_fin, total: Number(c.precio_total) })),
      new Date(),
    );

    return {
      solicitudes,
      proximas,
      serie,
      campos,
      servicios,
      valoracion: valoracion ? { promedio: valoracion._avg.puntaje, cantidad: valoracion._count._all } : null,
      usuarios,
    };
  },
};
