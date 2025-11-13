import { prisma } from '../../../../../packages/database/src/client.js';
import {
  CreateSolicitudInput,
  UpdateSolicitudEstadoInput,
} from "./solicitud.schema.js";

export class SolicitudRepository {
  async findById(id_solicitud: bigint) {
    return prisma.solicitud.findUnique({
      where: { id_solicitud },
      include: {
        campo: true,
        cliente_profile: { include: { users: true } },
        prestamista_profile: { include: { users: true } },
        servicio: {
          include: { categoria: true, prestamista_profile: true },
        },
        solicitud_insumo: { include: { insumo: true } },
      },
    });
  }

  async listAll() {
    return prisma.solicitud.findMany({
      orderBy: { fecha_solicitud: "desc" },
    });
  }

  async listByCliente(id_cliente: bigint) {
    return prisma.solicitud.findMany({
      where: { id_cliente },
      orderBy: { fecha_solicitud: "desc" },
    });
  }

  async listByPrestamista(id_prestamista: bigint) {
    return prisma.solicitud.findMany({
      where: { id_prestamista },
      orderBy: { fecha_solicitud: "desc" },
    });
  }

  async createWithInsumos(data: CreateSolicitudInput) {
    // conversión a BigInt porque el schema usa BigInt en todas las FK
    const id_servicio = BigInt(data.id_servicio as any);
    const id_cliente = BigInt(data.id_cliente as any);
    const id_prestamista = BigInt(data.id_prestamista as any);
    const id_campo = BigInt(data.id_campo as any);

    return prisma.$transaction(async (tx) => {
      // 1) Creamos la solicitud con lo mínimo
      const baseSolicitud = await tx.solicitud.create({
        data: {
          id_servicio,
          id_cliente,
          id_prestamista,
          id_campo,
          hectareas_trabajadas: data.hectareas_trabajadas,
          fecha_inicio: data.fecha_inicio
            ? new Date(data.fecha_inicio)
            : undefined,
          fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
          // precios se recalculan más abajo
        },
      });

      // 2) Crear insumos (si hay)
      let costo_insumos = 0;

      if (data.insumos && data.insumos.length > 0) {
        const rows = data.insumos.map((ins) => {
          const cantidad = ins.cantidad;
          const precio_unit = ins.precio_unit;
          costo_insumos += cantidad * precio_unit;

          return {
            id_solicitud: baseSolicitud.id_solicitud,
            id_insumo: BigInt(ins.id_insumo as any),
            cantidad,
            precio_unit,
            proveedor: ins.proveedor,
          };
        });

        await tx.solicitud_insumo.createMany({ data: rows });
      }

      // 3) Buscar precio vigente del servicio a la fecha de la solicitud
      const precioVigente = await tx.precio.findFirst({
        where: {
          id_servicio,
          fecha_desde: { lte: baseSolicitud.fecha_solicitud },
        },
        orderBy: { fecha_desde: "desc" },
      });

      const precio_servicio =
        Number(precioVigente?.valor ?? 0) * Number(data.hectareas_trabajadas);

      const precio_total = precio_servicio + costo_insumos;

      // 4) Actualizar solicitud con valores calculados
      const updated = await tx.solicitud.update({
        where: { id_solicitud: baseSolicitud.id_solicitud },
        data: {
          precio_servicio,
          costo_insumos,
          precio_total,
        },
        include: {
          campo: true,
          cliente_profile: { include: { users: true } },
          prestamista_profile: { include: { users: true } },
          servicio: true,
          solicitud_insumo: true,
        },
      });

      return updated;
    });
  }

  async updateEstado(
    id_solicitud: bigint,
    data: UpdateSolicitudEstadoInput
  ) {
    return prisma.solicitud.update({
      where: { id_solicitud },
      data: {
        estado: data.estado,
        fecha_inicio: data.fecha_inicio
          ? new Date(data.fecha_inicio)
          : undefined,
        fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
      },
    });
  }
}
