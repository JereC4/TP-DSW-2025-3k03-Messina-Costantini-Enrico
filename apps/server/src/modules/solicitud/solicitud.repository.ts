import { prisma } from '@repo/db';
import {
  CreateSolicitudInput,
  UpdateSolicitudEstadoInput,
  SolicitudEstado,
} from "./solicitud.schema.js";

export const solicitudRepo = {
  // Listar solicitudes
  async list(estado?: SolicitudEstado) {
    return prisma.solicitud.findMany({
      where: estado ? { estado } : {},
      orderBy: { fecha_solicitud: "desc" },
    });
  },

  // Obtener una solicitud por ID
  async getById(id: number) {
    return prisma.solicitud.findUnique({
      where: { id_solicitud: BigInt(id) },
    });
  },

  // Crear solicitud + insumos
  async create(data: CreateSolicitudInput) {
    const id_servicio = Number(data.id_servicio);
    const id_cliente = Number(data.id_cliente);
    const id_prestamista = Number(data.id_prestamista);
    const id_campo = Number(data.id_campo);

    return prisma.$transaction(async (tx) => {
      const solicitud = await tx.solicitud.create({
        data: {
          id_servicio: BigInt(id_servicio),
          id_cliente: BigInt(id_cliente),
          id_prestamista: BigInt(id_prestamista),
          id_campo: BigInt(id_campo),

          hectareas_trabajadas: data.hectareas_trabajadas,

          precio_servicio: 0,
          costo_insumos: 0,
          precio_total: 0,

          estado: "pendiente",

          fecha_inicio: data.fecha_inicio
            ? new Date(data.fecha_inicio)
            : null,
          fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : null,
        },
      });

      if (data.insumos.length > 0) {
        const rows = data.insumos.map((i) => ({
          id_solicitud: solicitud.id_solicitud,
          id_insumo: BigInt(Number(i.id_insumo)),
          cantidad: i.cantidad,
          precio_unit: i.precio_unit,
          proveedor: i.proveedor,
        }));

        await tx.solicitud_insumo.createMany({ data: rows });

        const costo_insumos = data.insumos.reduce(
          (acc, item) => acc + item.cantidad * item.precio_unit,
          0
        );

        await tx.solicitud.update({
          where: { id_solicitud: solicitud.id_solicitud },
          data: {
            costo_insumos,
            precio_total: solicitud.precio_servicio.add(costo_insumos),
          },
        });
      }

      return solicitud;
    });
  },

  // Cambiar estado (y fechas opcionales)
  async updateEstado(id: number, data: UpdateSolicitudEstadoInput) {
    return prisma.solicitud.update({
      where: { id_solicitud: BigInt(id) },
      data: {
        estado: data.estado,
        fecha_inicio: data.fecha_inicio
          ? new Date(data.fecha_inicio)
          : undefined,
        fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
      },
    });
  },

  // Eliminar una solicitud
  async delete(id: number) {
    return prisma.solicitud.delete({
      where: { id_solicitud: BigInt(id) },
    });
  },
};

