import { useEffect, useState } from "react";
import { api } from "../api/base";
import { getApiErrorMessage } from "../api/auth";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitudEstado,
  deleteSolicitud,
  type Solicitud,
  type SolicitudEstado,
  type CreateSolicitudInput,
} from "../api/solicitudes";

// Tipos mínimos para los combos
type ServicioOption = {
  id_servicio: number;
  nombre: string;
};

type CampoOption = {
  id_campo: number;
  id_cliente: number;
  coordenadas: string;
  hectareas: string;
  cliente_profile: unknown;
};

type UsuarioOption = {
  id_user: number;
  cuit: string | null;
  users: {
    nombre: string;
    apellido: string;
    email: string;
  };
};

export default function SolicitudesPage() {
  // listado
  const [items, setItems] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState<SolicitudEstado | "">("");

  // combos
  const [servicios, setServicios] = useState<ServicioOption[]>([]);
  const [clientes, setClientes] = useState<UsuarioOption[]>([]);
  const [prestamistas, setPrestamistas] = useState<UsuarioOption[]>([]);
  const [campos, setCampos] = useState<CampoOption[]>([]);

  // form crear
  const [idServicio, setIdServicio] = useState<number | "">("");
  const [idCliente, setIdCliente] = useState<number | "">("");
  const [idPrestamista, setIdPrestamista] = useState<number | "">("");
  const [idCampo, setIdCampo] = useState<number | "">("");
  const [hectareas, setHectareas] = useState<number>(1);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const resetForm = () => {
    setIdServicio("");
    setIdCliente("");
    setIdPrestamista("");
    setIdCampo("");
    setHectareas(1);
    setFechaInicio("");
    setFechaFin("");
  };

  const loadCombos = async () => {
    try {
      const [servRes, cliRes, presRes, campRes] = await Promise.all([
        api.get<ServicioOption[]>("/servicios"),
        api.get<UsuarioOption[]>("/clientes"),
        api.get<UsuarioOption[]>("/prestamistas"),
        api.get<CampoOption[]>("/campos"),
      ]);

      setServicios(servRes.data);
      setClientes(cliRes.data);
      setPrestamistas(presRes.data);
      setCampos(campRes.data);
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar los datos auxiliares"));
    }
  };

  const loadSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await getSolicitudes(
        estadoFilter === "" ? undefined : estadoFilter
      );
      console.log(data);
      setItems(data);
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar las solicitudes"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  useEffect(() => {
    loadSolicitudes();
  }, [estadoFilter]);

  const handleCreate = async () => {
    if (
      !idServicio ||
      !idCliente ||
      !idPrestamista ||
      !idCampo ||
      hectareas <= 0
    ) {
      alert("Completá todos los campos obligatorios.");
      return;
    }

    try {
      const payload: CreateSolicitudInput = {
        id_servicio: Number(idServicio),
        id_cliente: Number(idCliente),
        id_prestamista: Number(idPrestamista),
        id_campo: Number(idCampo),
        hectareas_trabajadas: hectareas,
        insumos: [], // por ahora vacíos, se podría manejar en otra pantalla
      };

      if (fechaInicio) payload.fecha_inicio = `${fechaInicio}T00:00:00.000Z`;
      if (fechaFin) payload.fecha_fin = `${fechaFin}T00:00:00.000Z`;

      await createSolicitud(payload);
      resetForm();
      await loadSolicitudes();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo crear la solicitud"));
    }
  };

  const handleChangeEstado = async (
    id: number,
    nuevoEstado: SolicitudEstado
  ) => {
    try {
      await updateSolicitudEstado(id, { estado: nuevoEstado });
      await loadSolicitudes();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo actualizar el estado"));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que querés eliminar la solicitud?")) return;
    try {
      await deleteSolicitud(id);
      await loadSolicitudes();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo eliminar la solicitud"));
    }
  };

  const formatUsuario = (u?: UsuarioOption) => {
    if (!u) return "";
    return `${u.users.nombre} ${u.users.apellido}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-8">Solicitudes de servicio</h1>

      {/* Filtro de estado */}
      <div className="mb-6 flex gap-4 items-center">
        <span className="font-medium">Filtrar por estado:</span>
        <select
          className="border px-3 py-2 rounded bg-slate-900 text-white"
          value={estadoFilter}
          onChange={(e) =>
            setEstadoFilter(
              (e.target.value || "") as SolicitudEstado | ""
            )
          }
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="aceptada">Aceptada</option>
          <option value="rechazada">Rechazada</option>
          <option value="completada">Completada</option>
        </select>
      </div>

      {/* Card crear solicitud */}
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg p-8 mb-10 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Nueva solicitud
        </h2>

        <div className="flex flex-col gap-4">
          {/* Servicio */}
          <select
            className="border px-3 py-2 rounded bg-slate-950 text-white"
            value={idServicio}
            onChange={(e) =>
              setIdServicio(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">Seleccionar servicio</option>
            {servicios.map((s) => (
              <option key={s.id_servicio} value={s.id_servicio}>
                {s.nombre}
              </option>
            ))}
          </select>

          {/* Cliente */}
          <select
            className="border px-3 py-2 rounded bg-slate-950 text-white"
            value={idCliente}
            onChange={(e) =>
              setIdCliente(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c.id_user} value={c.id_user}>
                {formatUsuario(c)}
              </option>
            ))}
          </select>

          {/* Prestamista */}
          <select
            className="border px-3 py-2 rounded bg-slate-950 text-white"
            value={idPrestamista}
            onChange={(e) =>
              setIdPrestamista(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">Seleccionar prestamista</option>
            {prestamistas.map((p) => (
              <option key={p.id_user} value={p.id_user}>
                {formatUsuario(p)}
              </option>
            ))}
          </select>

          {/* Campo */}
          <select
            className="border px-3 py-2 rounded bg-slate-950 text-white"
            value={idCampo}
            onChange={(e) =>
              setIdCampo(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">Seleccionar campo</option>
              {campos.map((c) => (
                <option key={c.id_campo} value={c.id_campo}>
                  {c.coordenadas} - {c.hectareas} ha
                </option>
              ))}
          </select>

          {/* Hectáreas */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">
              Hectáreas trabajadas
            </label>

            <input
              type="number"
              min="1"
              step="0.1"
              value={hectareas}
              onChange={(e) => setHectareas(Number(e.target.value))}
              className="
                w-full px-3 py-2 
                bg-[#0f1628] text-white 
                rounded-md border border-gray-500 
                focus:outline-none focus:ring-2 focus:ring-green-400
                appearance-none
              "
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Fecha inicio (opcional)</label>
              <input
                type="date"
                className="border px-3 py-2 rounded bg-transparent text-white w-full"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fecha fin (opcional)</label>
              <input
                type="date"
                className="border px-3 py-2 rounded bg-transparent text-white w-full"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            onClick={handleCreate}
          >
            Crear solicitud
          </button>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Servicio</th>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Prestamista</th>
              <th className="px-4 py-2 text-left">Campo</th>
              <th className="px-4 py-2 text-left">Hectáreas</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Precio total</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center">
                  Cargando...
                </td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center">
                  Sin resultados
                </td>
              </tr>
            )}

            {!loading &&
              items.map((s) => (
                <tr
                  key={s.id_solicitud}
                  className="border-t border-slate-800 hover:bg-slate-800/60"
                >
                  <td className="px-4 py-2">{s.id_solicitud}</td>
                  <td className="px-4 py-2">
                    {s.servicio?.nombre ?? s.id_servicio}
                  </td>
                  <td className="px-4 py-2">
                    {s.cliente_profile
                      ? `${s.cliente_profile.nombre} ${s.cliente_profile.apellido}`
                      : s.id_cliente}
                  </td>
                  <td className="px-4 py-2">
                    {s.prestamista_profile
                      ? `${s.prestamista_profile.nombre} ${s.prestamista_profile.apellido}`
                      : s.id_prestamista}
                  </td>
                  <td className="px-4 py-2">
                    {s.campo?.nombre ?? s.id_campo}
                  </td>
                  <td className="px-4 py-2">
                    {s.hectareas_trabajadas}
                  </td>
                  <td className="px-4 py-2 capitalize">{s.estado}</td>
                  <td className="px-4 py-2">
                    {s.precio_total.toFixed
                      ? s.precio_total.toFixed(2)
                      : s.precio_total}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      {s.estado === "pendiente" && (
                        <>
                          <button
                            className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700"
                            onClick={() =>
                              handleChangeEstado(s.id_solicitud, "aceptada")
                            }
                          >
                            Aceptar
                          </button>
                          <button
                            className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              handleChangeEstado(s.id_solicitud, "rechazada")
                            }
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {s.estado === "aceptada" && (
                        <button
                          className="px-2 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            handleChangeEstado(s.id_solicitud, "completada")
                          }
                        >
                          Marcar completada
                        </button>
                      )}
                      <button
                        className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-800"
                        onClick={() => handleDelete(s.id_solicitud)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
