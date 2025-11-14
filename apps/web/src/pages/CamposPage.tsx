import { useEffect, useState } from "react";
import {
  listCampos,
  createCampo,
  updateCampo,
  deleteCampo,
  type Campo,
} from "../api/campo.js";

export default function CamposPage() {
  const [items, setItems] = useState<Campo[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");

  // form crear/editar
  const [idCliente, setIdCliente] = useState("");
  const [coordenadas, setCoordenadas] = useState("");
  const [hectareas, setHectareas] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setIdCliente("");
    setCoordenadas("");
    setHectareas("");
    setEditingId(null);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await listCampos(q ? { q } : undefined);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async () => {
    const id_cliente_num = Number(idCliente);
    const hectareas_num = Number(hectareas);

    if (!Number.isFinite(id_cliente_num) || id_cliente_num <= 0) {
      alert("El id_cliente debe ser un número válido mayor a 0");
      return;
    }
    if (!Number.isFinite(hectareas_num) || hectareas_num <= 0) {
      alert("Las hectáreas deben ser un número válido mayor a 0");
      return;
    }
    if (!coordenadas.trim()) {
      alert("Las coordenadas no pueden estar vacías");
      return;
    }

    await createCampo({
      id_cliente: id_cliente_num,
      coordenadas: coordenadas.trim(),
      hectareas: hectareas_num,
    });
    resetForm();
    await load();
  };

  const onEdit = (x: Campo) => {
    setEditingId(x.id_campo);
    setIdCliente(String(x.id_cliente));
    setCoordenadas(x.coordenadas);
    setHectareas(String(x.hectareas));
  };

  const onUpdate = async () => {
    if (!editingId) return;

    const id_cliente_num = Number(idCliente);
    const hectareas_num = Number(hectareas);

    if (!Number.isFinite(id_cliente_num) || id_cliente_num <= 0) {
      alert("El id_cliente debe ser un número válido mayor a 0");
      return;
    }
    if (!Number.isFinite(hectareas_num) || hectareas_num <= 0) {
      alert("Las hectáreas deben ser un número válido mayor a 0");
      return;
    }
    if (!coordenadas.trim()) {
      alert("Las coordenadas no pueden estar vacías");
      return;
    }

    await updateCampo(editingId, {
      id_cliente: id_cliente_num,
      coordenadas: coordenadas.trim(),
      hectareas: hectareas_num,
    });
    resetForm();
    await load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar campo?")) return;
    await deleteCampo(id);
    await load();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Campos / Terrenos</h1>

      {/* Filtro */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 w-full max-w-md">
          <input
            className="border px-3 py-2 rounded w-full bg-transparent text-white"
            placeholder="Buscar por coordenadas"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void load()}
          />
          <button
            className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
            onClick={() => void load()}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Form crear/editar */}
      <div className="bg-[#1e1e1e] border rounded p-6 max-w-md mx-auto mb-10 shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {editingId ? `Editar campo #${editingId}` : "Nuevo campo"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="ID cliente"
            type="number"
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value)}
          />

          <input
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="Coordenadas (ej: -32.88, -68.84)"
            value={coordenadas}
            onChange={(e) => setCoordenadas(e.target.value)}
          />

          <input
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="Hectáreas (ej: 120.5)"
            type="number"
            step="0.01"
            value={hectareas}
            onChange={(e) => setHectareas(e.target.value)}
          />

          {editingId ? (
            <div className="flex gap-3 justify-center mt-2">
              <button
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => void onUpdate()}
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
              onClick={() => void onCreate()}
            >
              Crear
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead className="bg-[#2d6a4f] text-white">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Coordenadas</th>
              <th className="border p-2">Hectáreas</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            )}

            {items.map((x) => (
              <tr key={x.id_campo}>
                <td className="border p-2">{x.id_campo}</td>
                <td className="border p-2">
                  {x.cliente_profile?.users
                    ? `${x.cliente_profile.users.nombre} ${x.cliente_profile.users.apellido}`
                    : `Cliente #${x.id_cliente}`}
                </td>
                <td className="border p-2">{x.coordenadas}</td>
                <td className="border p-2">{x.hectareas}</td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 border rounded mr-2 hover:bg-gray-700"
                    onClick={() => onEdit(x)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                    onClick={() => onDelete(x.id_campo)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
