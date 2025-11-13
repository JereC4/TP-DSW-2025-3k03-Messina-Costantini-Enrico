import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getApiErrorMessage } from "../api/auth";
import { getServicios, type Servicio } from "../api/servicios";
import {
  getPrecios,
  createPrecio,
  updatePrecio,
  deletePrecio,
  type Precio,
} from "../api/precios";

type LocationState = {
  id_servicio?: number;
  nombre?: string;
} | undefined;

export default function PreciosPage() {
  const location = useLocation() as { state?: LocationState };

  // listado de servicios para elegir
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selectedServicioId, setSelectedServicioId] = useState<number | "">("");

  // histórico de precios del servicio seleccionado
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [loading, setLoading] = useState(false);

  // form crear/editar precio
  const [editingId, setEditingId] = useState<number | null>(null);
  const [valor, setValor] = useState<number>(0);
  const [fechaDesde, setFechaDesde] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const selectedServicio =
    selectedServicioId === ""
      ? undefined
      : servicios.find((s) => s.id_servicio === Number(selectedServicioId));

  useEffect(() => {
    loadServicios();
  }, []);

  useEffect(() => {
    if (selectedServicioId !== "") {
      loadPrecios(Number(selectedServicioId));
    } else {
      setPrecios([]);
    }
  }, [selectedServicioId]);

  async function loadServicios() {
    setLoading(true);
    try {
      const data = await getServicios();
      setServicios(data);

      // si vengo desde ServiciosPage con un servicio seleccionado
      const pre = location.state as LocationState;
      if (pre?.id_servicio) {
        setSelectedServicioId(pre.id_servicio);
      }
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar los servicios"));
    } finally {
      setLoading(false);
    }
  }

  async function loadPrecios(id_servicio: number) {
    setLoading(true);
    try {
      const data = await getPrecios(id_servicio);
      setPrecios(data);
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar los precios"));
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setValor(0);
    setFechaDesde(new Date().toISOString().slice(0, 10));
  }

  async function onSubmitPrecio() {
    if (selectedServicioId === "") {
      alert("Primero seleccioná un servicio");
      return;
    }

    if (!valor || valor <= 0) {
      alert("El valor debe ser mayor a 0");
      return;
    }

    try {
      if (editingId) {
        await updatePrecio(editingId, { valor, fecha_desde: fechaDesde });
      } else {
        await createPrecio(Number(selectedServicioId), valor, fechaDesde);
      }
      resetForm();
      await loadPrecios(Number(selectedServicioId));
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo guardar el precio"));
    }
  }

  function onEditPrecio(p: Precio) {
    setEditingId(p.id_precio);
    setValor(p.valor);
    setFechaDesde(p.fecha_desde.slice(0, 10));
  }

  async function onDeletePrecio(id_precio: number) {
    if (!confirm("¿Eliminar este precio?")) return;
    try {
      await deletePrecio(id_precio);
      if (selectedServicioId !== "") {
        await loadPrecios(Number(selectedServicioId));
      }
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo eliminar el precio"));
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Precios</h1>

      {/* Selección de servicio */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <label className="font-semibold">
          Seleccioná un servicio para ver su historial de precios
        </label>
        <select
          className="border px-3 py-2 rounded bg-transparent text-white w-full max-w-md"
          value={selectedServicioId}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedServicioId(v === "" ? "" : Number(v));
          }}
        >
          <option value="">-- Elegir servicio --</option>
          {servicios.map((s) => (
            <option key={s.id_servicio} value={s.id_servicio}>
              {s.nombre}
            </option>
          ))}
        </select>

        {selectedServicio && (
          <p className="text-sm text-gray-300">
            Servicio seleccionado:{" "}
            <span className="font-semibold">{selectedServicio.nombre}</span>
          </p>
        )}
      </div>

      {/* Formulario de precio */}
      <div className="bg-[#1e1e1e] border rounded p-6 max-w-md mx-auto mb-10 shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {editingId ? "Editar precio" : "Nuevo precio"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Fecha desde</label>
            <input
              type="date"
              className="border px-3 py-2 rounded bg-transparent text-white"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-center mt-2">
            <button
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={onSubmitPrecio}
            >
              {editingId ? "Guardar cambios" : "Crear precio"}
            </button>
            {editingId && (
              <button
                className="px-4 py-2 rounded border"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead className="bg-[#2d6a4f] text-white">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Valor</th>
              <th className="border p-2">Fecha desde</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            )}

            {!loading &&
              precios.map((p) => (
                <tr key={p.id_precio}>
                  <td className="border p-2">{p.id_precio}</td>
                  <td className="border p-2">{p.valor}</td>
                  <td className="border p-2">
                    {p.fecha_desde.slice(0, 10)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="px-3 py-1 border rounded mr-2 hover:bg-gray-700"
                      onClick={() => onEditPrecio(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                      onClick={() => onDeletePrecio(p.id_precio)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && precios.length === 0 && selectedServicioId !== "" && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  Este servicio todavía no tiene precios cargados
                </td>
              </tr>
            )}

            {!loading && selectedServicioId === "" && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  Seleccioná un servicio para ver los precios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

