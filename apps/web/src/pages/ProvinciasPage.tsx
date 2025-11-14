import { useEffect, useState } from "react";
import {
  getProvincias,
  createProvincia,
  deleteProvincia,
} from "../api/provincias";

type Provincia = { id_provincia: number; nombre: string };

export default function ProvinciasPage() {
  const [items, setItems] = useState<Provincia[]>([]);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProvincias();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) return;
    await createProvincia(n);
    setNombre("");
    await load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar provincia?")) return;
    await deleteProvincia(id);
    await load();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Provincias</h1>

      {/* Form crear provincia */}
      <div className="bg-[#1e1e1e] border rounded p-6 max-w-md mx-auto mb-10 shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          Nueva provincia
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            className="border px-3 py-2 rounded bg-transparent text-white"
            placeholder="Nombre de la provincia"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition mt-2"
          >
            Crear
          </button>
        </form>
      </div>

      {/* Lista / tabla */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead className="bg-[#2d6a4f] text-white">
            <tr>
              <th className="border p-2 w-24">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2 w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            )}

            {!loading &&
              items.map((p) => (
                <tr key={p.id_provincia}>
                  <td className="border p-2 text-center">{p.id_provincia}</td>
                  <td className="border p-2">{p.nombre}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                      onClick={() => onDelete(p.id_provincia)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-400">
                  No hay provincias cargadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
