import { motion } from "framer-motion";
import { Sprout, Tractor } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage, localidades as localidadesApi } from "../api";
import type { Localidad } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { useFeedback } from "../components/feedback";
import { AnimatedPage } from "../components/layout/AppShell";
import { Alert, Button, Field, Input, Select } from "../components/ui";
import { cn } from "../lib/cn";

type Mode = "login" | "register";
type FormState = { email: string; emailConfirm: string; password: string; nombre: string; apellido: string; rol: "PRODUCTOR" | "CONTRATISTA"; id_localidad: string; telefono: string };
const initial: FormState = { email: "", emailConfirm: "", password: "", nombre: "", apellido: "", rol: "PRODUCTOR", id_localidad: "", telefono: "" };

type Props = {
  /** Modo inicial (input property). */
  mode?: Mode;
  /** Se dispara al autenticarse (output property). */
  onAuthenticated?: (email: string) => void;
};

export default function AuthPage({ mode = "login", onAuthenticated }: Props) {
  const { user, login, register } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/app";

  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [locError, setLocError] = useState(false);

  useEffect(() => {
    if (mode === "register") localidadesApi.list().then(setLocalidades).catch(() => setLocError(true));
  }, [mode]);

  if (user) return <Navigate to={from} replace />;

  const set = (name: keyof FormState) => (e: { target: { value: string } }) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const emailMismatch = mode === "register" && form.emailConfirm.length > 0 && form.email !== form.emailConfirm;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "register" && form.email !== form.emailConfirm) {
      setError("Los emails no coinciden");
      return;
    }
    setSubmitting(true);
    try {
      const u =
        mode === "login"
          ? await login(form.email, form.password)
          : await register({ email: form.email, password: form.password, nombre: form.nombre, apellido: form.apellido, rol: form.rol, id_localidad: form.id_localidad ? Number(form.id_localidad) : null, telefono: form.telefono || null });
      toast.success(mode === "login" ? `Hola de nuevo, ${u.nombre}` : "¡Cuenta creada! Bienvenido a AgroApp");
      onAuthenticated?.(u.email);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo completar la operación"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">AgroApp</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-stone-900 dark:text-white">{mode === "login" ? "Qué bueno verte de nuevo." : "Empezá hoy, gratis."}</h1>
          <p className="mt-3 max-w-md text-stone-600 dark:text-stone-400">
            {mode === "login" ? "Ingresá para seguir tus solicitudes, administrar tus campos o tus servicios." : "Elegí cómo vas a usar AgroApp. Podés cambiar tus datos después desde tu perfil."}
          </p>
          <ul className="mt-8 space-y-3 text-sm text-stone-600 dark:text-stone-400">
            <li className="flex gap-3"><Sprout className="h-5 w-5 shrink-0 text-brand-600" /><span><b className="text-stone-800 dark:text-stone-200">Productor:</b> registrás tus campos y solicitás servicios a contratistas cercanos.</span></li>
            <li className="flex gap-3"><Tractor className="h-5 w-5 shrink-0 text-brand-600" /><span><b className="text-stone-800 dark:text-stone-200">Contratista:</b> publicás tus servicios con precio por hectárea y gestionás los pedidos.</span></li>
          </ul>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface mx-auto w-full max-w-md p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
          <p className="mt-1 text-sm text-stone-500">
            {mode === "login" ? "¿Todavía no tenés cuenta? " : "¿Ya tenés cuenta? "}
            <Link to={mode === "login" ? "/registro" : "/ingresar"} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">{mode === "login" ? "Registrate" : "Ingresá"}</Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de cuenta">
                {([["PRODUCTOR", "Soy productor", Sprout, "Tengo campos"], ["CONTRATISTA", "Soy contratista", Tractor, "Ofrezco servicios"]] as const).map(([rol, label, Icon, hint]) => (
                  <button key={rol} type="button" role="radio" aria-checked={form.rol === rol} onClick={() => setForm((p) => ({ ...p, rol }))} className={cn("rounded-xl border-2 p-3 text-left transition", form.rol === rol ? "border-brand-600 bg-brand-50 dark:bg-brand-900/30" : "border-stone-200 hover:border-stone-300 dark:border-stone-700")}>
                    <Icon className={cn("h-5 w-5", form.rol === rol ? "text-brand-700 dark:text-brand-300" : "text-stone-400")} />
                    <p className="mt-1.5 text-sm font-semibold">{label}</p>
                    <p className="text-xs text-stone-500">{hint}</p>
                  </button>
                ))}
              </div>
            )}

            {mode === "register" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" required><Input name="nombre" value={form.nombre} onChange={set("nombre")} required autoComplete="given-name" /></Field>
                <Field label="Apellido" required><Input name="apellido" value={form.apellido} onChange={set("apellido")} required autoComplete="family-name" /></Field>
              </div>
            )}

            <Field label="Email" required><Input type="email" name="email" value={form.email} onChange={set("email")} required autoComplete="email" placeholder="vos@ejemplo.com" /></Field>
            {mode === "register" && (
              <Field label="Confirmar email" required error={emailMismatch ? "Los emails no coinciden" : undefined}>
                <Input type="email" name="emailConfirm" value={form.emailConfirm} onChange={set("emailConfirm")} required autoComplete="email" placeholder="vos@ejemplo.com" onPaste={(e) => e.preventDefault()} />
              </Field>
            )}
            <Field label="Contraseña" required hint={mode === "register" ? "Mínimo 8 caracteres" : undefined}>
              <Input type="password" name="password" value={form.password} onChange={set("password")} required minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </Field>

            {mode === "register" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Localidad" hint={locError ? "No se pudieron cargar; podés elegirla después" : undefined}>
                  <Select name="id_localidad" value={form.id_localidad} onChange={set("id_localidad")} disabled={locError}>
                    <option value="">Elegir…</option>
                    {localidades.map((l) => <option key={l.id_localidad} value={l.id_localidad}>{l.nombre}{l.provincia ? ` (${l.provincia.nombre})` : ""}</option>)}
                  </Select>
                </Field>
                <Field label="Teléfono"><Input name="telefono" value={form.telefono} onChange={set("telefono")} placeholder="341-4000000" autoComplete="tel" /></Field>
              </div>
            )}

            {error && <Alert kind="error">{error}</Alert>}

            <Button type="submit" size="lg" className="w-full" loading={submitting}>{mode === "login" ? "Entrar" : "Crear cuenta"}</Button>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
