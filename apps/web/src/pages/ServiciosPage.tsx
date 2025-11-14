import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/auth";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  type Servicio,
} from "../api/servicios";
import {
  getCategoriasServicio,
  type CategoriaServicio,
} from "../api/categoriasServicio";

export default function ServiciosPage() {
  // listado + filtro
  const [items, setItems] = useState<Servicio[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // catálogo de categorías
  const [categorias, setCategorias] = useState<CategoriaServicio[]>([]);

  // form crear/editar servicio
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idCategoria, setIdCategoria] = useState<number | "">("");

  // cargar servicios
  const loadServicios = async () => {
    setLoading(true);
    try {
      const data = await getServicios(q);
      setItems(data);
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar los servicios"));
    } finally {
      setLoading(false);
    }
  };

  // cargar categorías
  const loadCategorias = async () => {
    try {
      const data = await getCategoriasServicio("");
      setCategorias(data);
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudieron cargar las categorías"));
    }
  };

  useEffect(() => {
    loadServicios();
    loadCategorias();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setIdCategoria("");
  };

  // crear nuevo servicio
  const onCreate = async () => {
    if (!nombre.trim() || idCategoria === "") return;
    try {
      await createServicio({
        nombre,
        descripcion,
        id_categoria: Number(idCategoria),
      });
      resetForm();
      await loadServicios();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo crear el servicio"));
    }
  };

  // cargar datos en el form para editar
  const onEdit = (s: Servicio) => {
    setEditingId(s.id_servicio);
    setNombre(s.nombre);
    setDescripcion(s.descripcion ?? "");
    setIdCategoria(s.id_categoria);
  };

  // guardar cambios de un servicio existente
  const onUpdate = async () => {
    if (!editingId) return;
    if (!nombre.trim() || idCategoria === "") return;
    try {
      await updateServicio(editingId, {
        nombre,
        descripcion,
        id_categoria: Number(idCategoria),
      });
      resetForm();
      await loadServicios();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo actualizar el servicio"));
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar servicio?")) return;
    try {
      await deleteServicio(id);
      await loadServicios();
    } catch (e) {
      alert(getApiErrorMessage(e, "No se pudo borrar el servicio"));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Servicios</h1>

      {/* Filtro */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 w-full max-w-md">
          <input
            className="border px-3 py-2 rounded w-full bg-transparent text-white"
            placeholder="Buscar por nombre o descripción"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadServicios()}
          />
          <button
            className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
            onClick={loadServicios}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Form crear/editar */}
      <div className="bg-[#1e1e1e] border rounded p-6 max-w-md mx-auto mb-10 shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {editingId ? "Editar servicio" : "Nuevo servicio"}
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

          <select
            value={idCategoria ?? ""}
            onChange={(e) => setIdCategoria(Number(e.target.value))}
            className="
              border px-3 py-2 rounded
              bg-[#1F1F1F] text-white
              appearance-none
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          >
            <option value="" className="bg-[#1F1F1F] text-gray-300">
              Seleccionar categoría
            </option>

            {categorias.map((c) => (
              <option
                key={c.id_categoria}
                value={c.id_categoria}
                className="bg-[#1F1F1F] text-white"
              >
                {c.nombre}
              </option>
            ))}
          </select>
          

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
              <th className="border p-2">Categoría</th>
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
            {items.map((s) => (
              <tr key={s.id_servicio}>
                <td className="border p-2">{s.id_servicio}</td>
                <td className="border p-2">{s.nombre}</td>
                <td className="border p-2">{s.descripcion ?? "-"}</td>
                <td className="border p-2">
                  {/* si tu backend manda nombre de categoría lo mostrás acá */}
                  {"id_categoria" in s ? s.id_categoria : "-"}
                </td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 border rounded mr-2 hover:bg-gray-700"
                    onClick={() => onEdit(s)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                    onClick={() => onDelete(s.id_servicio)}
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


