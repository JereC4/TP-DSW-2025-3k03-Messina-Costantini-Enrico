import { useEffect, useState } from "react";
import {
  getCategoriasServicio,
  createCategoriaServicio,
  updateCategoriaServicio,
  deleteCategoriaServicio,
  type CategoriaServicio,
} from "../api/categoriasServicio";
import { getApiErrorMessage } from "../api/auth";

export default function CategoriasServicioPage() {
  const [items, setItems] = useState<CategoriaServicio[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCategoriasServicio(q);
      setItems(data);
    } catch (e) {
      alert(getApiErrorMessage(e, "Error cargando categorías"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
  };

  const onCreate = async () => {
    try {
      await createCategoriaServicio(nombre, descripcion || null);
      resetForm();
      await load();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo crear"));
    }
  };

  const onUpdate = async () => {
    if (editingId == null) return;
    try {
      await updateCategoriaServicio(editingId, {
        nombre,
        descripcion: descripcion || null,
      });
      resetForm();
      await load();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo actualizar"));
    }
  };

  const onEdit = (x: CategoriaServicio) => {
    setEditingId(x.id_categoria);
    setNombre(x.nombre);
    setDescripcion(x.descripcion ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar la categoría?")) return;
    try {
      await deleteCategoriaServicio(id);
      await load();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo eliminar"));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Categorías de Servicio</h1>

      {/* Filtro */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 w-full max-w-md">
          <input
            className="border px-3 py-2 rounded w-full bg-transparent text-white"
            placeholder="Buscar por nombre o descripción"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <button
            className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
            onClick={load}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Form crear/editar */}
      <div className="bg-[#1e1e1e] border rounded p-6 max-w-md mx-auto mb-10 shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {editingId ? "Editar categoría" : "Nueva categoría"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

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
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Descripción</th>
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
            {items.map((x) => (
              <tr key={x.id_categoria}>
                <td className="border p-2">{x.id_categoria}</td>
                <td className="border p-2">{x.nombre}</td>
                <td className="border p-2">{x.descripcion ?? "-"}</td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 border rounded mr-2 hover:bg-gray-700"
                    onClick={() => onEdit(x)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                    onClick={() => onDelete(x.id_categoria)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
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
