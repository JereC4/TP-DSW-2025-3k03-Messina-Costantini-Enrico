import { useEffect, useState } from "react";
import { getProvincias } from "../api/provincias";
import {
  createLocalidad,
  deleteLocalidad,
  getLocalidades,
  type Localidad,
} from "../api/localidades";

type Provincia = { id_provincia: number; nombre: string };

export default function LocalidadesPage() {
  const [items, setItems] = useState<Localidad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [idProvincia, setIdProvincia] = useState<number | "">("");
  const [nombre, setNombre] = useState("");
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [prov, locs] = await Promise.all([
        getProvincias(),
        getLocalidades(undefined, idProvincia || undefined),
      ]);

      setProvincias(
        prov.map((p) => ({
          id_provincia: Number(p.id_provincia),
          nombre: p.nombre,
        }))
      );
      setItems(locs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [idProvincia]);

  const handleCreate = async () => {
    if (!idProvincia || !nombre.trim()) return;

    await createLocalidad({
      id_provincia: idProvincia,
      nombre: nombre.trim(),
      codigo_postal: cp || undefined,
    });

    setNombre("");
    setCp("");
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar localidad?")) return;
    await deleteLocalidad(id);
    await load();
  };

  const provinciaNombre = (id: number | bigint) =>
    provincias.find((p) => p.id_provincia === Number(id))?.nombre ?? `#${id}`;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Localidades</h1>

      {/* Filtro + alta */}
      <div className="bg-[#1e1e1e] border rounded p-6 mb-10 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Filtrar y crear localidades
        </h2>

        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          {/* Provincia */}
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-300">
              Provincia
            </label>
            <select
              value={idProvincia}
              onChange={(e) =>
                setIdProvincia(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="">(todas las provincias)</option>
              {provincias.map((p) => (
                <option key={p.id_provincia} value={p.id_provincia}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre localidad */}
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-300">
              Nombre de la localidad
            </label>
            <input
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Código postal */}
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-300">
              Código Postal (opcional)
            </label>
            <input
              placeholder="Código Postal"
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Botón crear */}
          <div className="md:w-40">
            <button
              onClick={handleCreate}
              className="w-full mt-2 md:mt-0 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-green-700 transition"
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de localidades */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead className="bg-[#2d6a4f] text-white">
            <tr>
              <th className="border p-2 w-20">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Provincia</th>
              <th className="border p-2">Código Postal</th>
              <th className="border p-2 w-32">Acciones</th>
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

            {!loading &&
              items.map((l) => (
                <tr key={l.id_localidad}>
                  <td className="border p-2 text-center">{l.id_localidad}</td>
                  <td className="border p-2">{l.nombre}</td>
                  <td className="border p-2">
                    {provinciaNombre(l.id_provincia)}
                  </td>
                  <td className="border p-2">
                    {l.codigo_postal ? l.codigo_postal : "-"}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="px-3 py-1 border rounded text-red-500 hover:bg-gray-700"
                      onClick={() => handleDelete(l.id_localidad)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No hay localidades para la selección actual
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
