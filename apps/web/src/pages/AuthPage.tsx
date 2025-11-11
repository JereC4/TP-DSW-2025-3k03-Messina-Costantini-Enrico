import { useEffect, useState } from "react";
import { login, signup, type AuthUser } from "../api/auth";

type FormState = {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("auth:user");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } else {
        const u = await signup({
          email: form.email,
          password: form.password,
          nombre: form.nombre,
          apellido: form.apellido,
        });
        setUser(u);
        localStorage.setItem("auth:user", JSON.stringify(u));
      }
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : "Error");
      setError(message);
    }
  };

  if (user) {
  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h2>Bienvenido, {user.nombre}!</h2>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles?.join(", ") || "(sin roles)"}</p>

      <button
        onClick={() => {
          setUser(null);
          localStorage.removeItem("auth:user"); // 🟢 Borra sesión guardada
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <>
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
          </>
        )}
        <button type="submit">{isLogin ? "Entrar" : "Registrarse"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: 12 }}>
        {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin((v) => !v)}
          style={{ color: "blue", border: "none", background: "none", padding: 0 }}
        >
          {isLogin ? "Crear una" : "Iniciar sesión"}
        </button>
      </p>
    </div>
  );
}
