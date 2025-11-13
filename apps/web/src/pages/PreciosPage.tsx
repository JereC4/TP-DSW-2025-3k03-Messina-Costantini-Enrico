// apps/web/src/pages/PreciosPage.tsx

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/auth";
import { getServicios, type Servicio } from "../api/servicios";
import {
  getPrecios,
  createPrecio,
  updatePrecio,
  deletePrecio,
  type Precio,
} from "../api/precios";

export default function PreciosPage() {
  // listado de servicios para elegir
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selectedServicioId, setSelectedServicioId] = useState<number | "">("");

  // histórico de precios del servicio seleccionado
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [loading, setLoading] = useState(false);

  // form crear/editar precio
  const [valor, setValor] = useState<number>(0);
  const [fechaDesde, setFechaDesde] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );
  const [editingId, setEditingId] = useState<number | null>(null);

  // cargar servicios al montar
  useEffect(() => {
    loadServicios();
  }, []);

  // cuando cambia el servicio seleccionado, cargo sus precios
  useEffect(() => {
    loadPrecios();
  }, [selectedServicioId]);

  async function loadServicios() {
    try {
      const data = await getServicios(); // sin filtros
      setServicios(data);
      // si no hay servicio seleccionado y hay alguno, selecciono el primero
      if (!selectedServicioId && data.length > 0) {
        setSelectedServicioId(data[0].id_servicio);
      }
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar los servicios"));
    }
  }

  async function loadPrecios() {
    if (!selectedServicioId) {
      setPrecios([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getPrecios(selectedServicioId);
      setPrecios(data);
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar los precios"));
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setValor(0);
    setFechaDesde(new Date().toISOString().slice(0, 10));
    setEditingId(null);
  }

  // crear un nuevo precio (nuevo registro histórico)
  async function onCreate() {
    if (!selectedServicioId) {
      alert("Primero seleccioná un servicio");
      return;
    }
    if (!valor || valor <= 0) {
      alert("El valor del precio debe ser mayor a 0");
      return;
    }

    try {
      await createPrecio(selectedServicioId, valor, fechaDesde);
      resetForm();
      await loadPrecios();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo crear el precio"));
    }
  }

  // cargar datos de un precio en el form para editar
  function onEdit(p: Precio) {
    setEditingId(p.id_precio);
    setValor(p.valor);
    setFechaDesde(p.fecha_desde.slice(0, 10));
  }

  // guardar edición de precio
  async function onUpdate() {
    if (!editingId) return;
    if (!valor || valor <= 0) {
      alert("El valor del precio debe ser mayor a 0");
      return;
    }

    try {
      await updatePrecio(editingId, {
        valor,
        fecha_desde: fechaDesde,
      });
      resetForm();
      await loadPrecios();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo actualizar el precio"));
    }
  }

  // borrar un precio
  async function onDelete(id: number) {
    if (!confirm("¿Eliminar este precio?")) return;
    try {
      await deletePrecio(id);
      await loadPrecios();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo eliminar el precio"));
    }
  }

  const servicioActual = servicios.find(
    (s) => s.id_servicio === selectedServicioId
  );

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Precios</h1>

      {/* Selector de servicio */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <label className="text-lg font-medium">
          Seleccionar servicio para ver su historial de precios
        </label>
        <select
          className="border px-3 py-2 rounded bg-transparent text-white min-w-[280px]"
          value={selectedServicioId}
          onChange={(e) =>
            setSelectedServicioId(
              e.target.value ? Number(e.target.value) : ""
            )
          }
        >
          <option value="">-- Elegir servicio --</option>
          {servicios.map((s) => (
            <option key={s.id_servicio} value={s.id_servicio}>
              {s.nombre}
            </option>
          ))}
        </select>
        {servicioActual && (
          <p className="text-sm text-gray-300">
            Servicio seleccionado:{" "}
            <span className="font-semibold">{servicioActual.nombre}</span>
          </p>
        )}
      </div>

      {/* Form crear/editar precio */}
      <div className="bg-[#1e1e1e] border rounded p-6 max-w-md mx-auto mb-10 shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {editingId ? "Editar precio" : "Nuevo precio"}
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Valor (por hectárea)
            </label>
            <input
              type="number"
              className="border px-3 py-2 rounded bg-transparent text-white w-full"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              min={0}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Fecha desde
            </label>
            <input
              type="date"
              className="border px-3 py-2 rounded bg-transparent text-white w-full"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>

          {editingId ? (
            <div className="flex gap-3 justify-center mt-2">
              <button
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={onUpdate}
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 rounded border"
                onClick={resetForm}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition mt-2"
              onClick={onCreate}
              disabled={!selectedServicioId}
            >
              Crear
            </button>
          )}
        </div>
      </div>

      {/* Tabla historial de precios */}
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
                  <td className="border p-2">${p.valor}</td>
                  <td className="border p-2">
                    {p.fecha_desde.slice(0, 10)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="px-3 py-1 border rounded mr-2 hover:bg-gray-700"
                      onClick={() => onEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                      onClick={() => onDelete(p.id_precio)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && precios.length === 0 && selectedServicioId && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  Este servicio todavía no tiene precios cargados
                </td>
              </tr>
            )}

            {!loading && !selectedServicioId && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  Seleccioná un servicio para ver sus precios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
