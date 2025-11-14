import { useEffect, useState } from "react";
import {
  getUsuario,
  updateUsuario,
  type UsuarioUpdateInput,
} from "../api/usuarios";
import { getLocalidades, type Localidad } from "../api/localidades";
import { getApiErrorMessage, type RoleName } from "../api/auth";
import { Link } from "react-router-dom";

type PerfilForm = {
  email: string;
  nombre: string;
  apellido: string;
  cuil_cuit: string;
  fecha_nac: string;
  domicilio: string;
  id_localidad: string;
};

export default function ProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userRoles, setUserRoles] = useState<RoleName[]>([]);

  const [form, setForm] = useState<PerfilForm>({
    email: "",
    nombre: "",
    apellido: "",
    cuil_cuit: "",
    fecha_nac: "",
    domicilio: "",
    id_localidad: "",
  });

  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const raw = localStorage.getItem("auth:user");
      if (!raw) {
        setLoading(false);
        return;
      }

      try {
        const basic = JSON.parse(raw) as {
          id_user: number;
          roles?: RoleName[];
        };

        setUserId(basic.id_user);
        setUserRoles(basic.roles ?? []);

        const u = await getUsuario(basic.id_user);

        setForm({
          email: u.email ?? "",
          nombre: u.nombre ?? "",
          apellido: u.apellido ?? "",
          cuil_cuit: u.cuil_cuit ?? "",
          fecha_nac: u.fecha_nac ? u.fecha_nac.slice(0, 10) : "",
          domicilio: u.domicilio ?? "",
          id_localidad: u.id_localidad ? String(u.id_localidad) : "",
        });
      } catch (e) {
        console.error("Error inicializando perfil:", e);
        localStorage.removeItem("auth:user");
      } finally {
        setLoading(false);
      }
    };

    const loadLocs = async () => {
      try {
        setLocalidades(await getLocalidades());
      } catch (err) {
        console.error("Error en la carga de localidades:", err);
      }
    };

    init();
    loadLocs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRole = (role: RoleName) => {
    setUserRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload: UsuarioUpdateInput = {
      email: form.email.trim() || undefined,
      nombre: form.nombre.trim() || undefined,
      apellido: form.apellido.trim() || undefined,
      cuil_cuit: form.cuil_cuit.trim() || null,
      fecha_nac: form.fecha_nac || null,
      domicilio: form.domicilio.trim() || null,
      id_localidad: form.id_localidad ? Number(form.id_localidad) : null,
      roles: userRoles,
    };

    try {
      const updated = await updateUsuario(userId, payload);

      const raw = localStorage.getItem("auth:user");
      if (raw) {
        try {
          const prev = JSON.parse(raw);
          const merged = {
            ...prev,
            email: updated.email,
            nombre: updated.nombre,
            apellido: updated.apellido,
            roles: userRoles,
          };
          localStorage.setItem("auth:user", JSON.stringify(merged));
        } catch {
          localStorage.setItem(
            "auth:user",
            JSON.stringify({
              id_user: updated.id_user,
              email: updated.email,
              nombre: updated.nombre,
              apellido: updated.apellido,
              roles: userRoles,
            })
          );
        }
      }

      setSuccess("Perfil actualizado correctamente.");
    } catch (e) {
      setError(getApiErrorMessage(e, "No se pudo actualizar el perfil"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Cargando perfil…</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="bg-slate-900/80 p-6 rounded-xl shadow-xl max-w-md w-full text-center">
          <p className="mb-4">No estás autenticado.</p>
          <Link
            to="/auth"
            className="inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-500 transition"
          >
            Ir a Login / Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center pt-16">
      <div className="w-full max-w-xl rounded-xl bg-slate-900/80 p-6 shadow-xl ring-1 ring-emerald-500/20">
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-300">
          Mi Perfil
        </h1>

        {/* Roles: editable */}
        <div className="mb-6 text-sm text-slate-300">
          <p className="font-semibold mb-2 text-center">Roles asignados:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={userRoles.includes("CLIENTE")}
                onChange={() => toggleRole("CLIENTE")}
              />
              <span>Cliente</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={userRoles.includes("PRESTAMISTA")}
                onChange={() => toggleRole("PRESTAMISTA")}
              />
              <span>Prestamista</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Nombre
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Apellido
              </label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1 text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1 text-slate-300">
                CUIL/CUIT
              </label>
              <input
                name="cuil_cuit"
                value={form.cuil_cuit}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fecha_nac"
                value={form.fecha_nac}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1 text-slate-300">
              Domicilio
            </label>
            <input
              name="domicilio"
              value={form.domicilio}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-slate-300">
              Localidad
            </label>
            <select
              name="id_localidad"
              value={form.id_localidad}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            >
              <option value="">Sin localidad</option>
              {localidades.map((l) => (
                <option
                  key={l.id_localidad}
                  value={l.id_localidad}
                  className="bg-slate-900 text-slate-100"
                >
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-500 transition disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-emerald-300 text-center">
            {success}
          </p>
        )}

        {/* Cerrar sesión */}
        <button
          onClick={() => {
            localStorage.removeItem("auth:user");
            window.location.href = "/auth";
          }}
          className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
