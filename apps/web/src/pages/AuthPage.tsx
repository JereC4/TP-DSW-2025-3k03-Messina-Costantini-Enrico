import { useEffect, useState } from "react";
import { login, RoleName, signup, type AuthUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

type FormState = {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: RoleName;
};

type AuthPageProps = {
  onAuthChange?: (user: AuthUser | null) => void;
};

export default function AuthPage({ onAuthChange }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "CLIENTE",
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        const u = JSON.parse(raw) as AuthUser;
        setUser(u);
        onAuthChange?.(u); // sincronizar si ya estaba logueado
      } catch {
        localStorage.removeItem("auth:user");
        onAuthChange?.(null); // sincronizar si hubo error
      }
    }
  }, [onAuthChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const u = await login(form.email, form.password);
        setUser(u);
        localStorage.setItem("auth:user", JSON.stringify(u));
        onAuthChange?.(u); // 🔔 avisamos a App
      } else {
        await signup({
          email: form.email,
          password: form.password,
          nombre: form.nombre,
          apellido: form.apellido,
          roles: [form.rol],
        });

        const logged = await login(form.email, form.password);
        setUser(logged);
        localStorage.setItem("auth:user", JSON.stringify(logged));
        onAuthChange?.(logged); // 🔔 avisamos a App
      }
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (e instanceof Error ? e.message : "Error");
      setError(message);
    }
  };

  // Vista cuando el usuario ya está logueado
  if (user) {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center pt-16">
        <div className="w-full max-w-md rounded-xl bg-slate-900/80 p-6 shadow-xl ring-1 ring-emerald-500/20">
          <h2 className="text-2xl font-bold mb-2 text-emerald-300">
            Bienvenido, {user.nombre}!
          </h2>
          <p className="text-sm text-slate-200 mb-1">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-sm text-slate-200 mb-4">
            <span className="font-semibold">Roles:</span>{" "}
            {user.roles?.join(", ") || "(sin roles)"}
          </p>

          <button
            className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-500 transition"
            onClick={() => {
              setUser(null);
              localStorage.removeItem("auth:user");
              onAuthChange?.(null); // 🔔 avisamos que se deslogueó
              navigate("/auth");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // Vista login / signup
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center pt-16">
      <div className="w-full max-w-md rounded-xl bg-slate-900/80 p-6 shadow-xl ring-1 ring-emerald-500/20">
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-300">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <input
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <input
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="text-sm">
                <label className="block mb-1 text-slate-200">
                  Tipo de usuario:
                </label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="PRESTAMISTA">Prestamista</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-500 transition"
          >
            {isLogin ? "Entrar" : "Registrarse"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
        )}

        <p className="mt-4 text-xs text-center text-slate-300">
          {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin((v) => !v)}
            className="text-emerald-300 underline-offset-2 hover:underline"
          >
            {isLogin ? "Crear una" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
