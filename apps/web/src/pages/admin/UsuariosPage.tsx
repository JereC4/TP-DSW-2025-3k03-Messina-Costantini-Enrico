import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { getApiErrorMessage, localidades as localidadesApi, usuarios as usuariosApi } from "../../api";
import { ROLE_LABELS, type RoleName, type Usuario } from "../../api/types";
import { useAuth } from "../../auth/AuthContext";
import { useFeedback } from "../../components/feedback";
import { AnimatedPage } from "../../components/layout/AppShell";
import { Alert, Avatar, Button, Card, EmptyState, Field, Input, PageHeader, Pagination, RoleBadge, Select, Skeleton, Td, Th } from "../../components/ui";
import { Dialog } from "../../components/ui/Dialog";
import { cn } from "../../lib/cn";
import { fullName, ubicacion } from "../../lib/format";
import { useDebounce } from "../../lib/useDebounce";
import { useQuery } from "../../lib/useQuery";

const ALL: RoleName[] = ["ADMIN", "PRODUCTOR", "CONTRATISTA"];
type Form = { email: string; password: string; nombre: string; apellido: string; roles: RoleName[]; id_localidad: string; telefono: string; cuil_cuit: string };
const empty: Form = { email: "", password: "", nombre: "", apellido: "", roles: ["PRODUCTOR"], id_localidad: "", telefono: "", cuil_cuit: "" };

export default function UsuariosPage() {
  const { user: me } = useAuth();
  const { toast, confirm } = useFeedback();
  const [q, setQ] = useState("");
  const dq = useDebounce(q);
  const [role, setRole] = useState<RoleName | "">("");
  const [page, setPage] = useState(1);
  const lista = useQuery(() => usuariosApi.list({ q: dq || undefined, role: role || undefined, page, pageSize: 15 }), [dq, role, page]);
  const localidades = useQuery(() => localidadesApi.list(), []);
  const [editing, setEditing] = useState<Usuario | null | undefined>(undefined);
  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const open = (u: Usuario | null) => {
    setEditing(u);
    setError(null);
    setForm(u ? { email: u.email, password: "", nombre: u.nombre, apellido: u.apellido, roles: u.roles, id_localidad: u.id_localidad ? String(u.id_localidad) : "", telefono: u.telefono ?? "", cuil_cuit: u.cuil_cuit ?? "" } : empty);
  };
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleRole = (r: RoleName) => setForm((p) => {
    let roles = p.roles.includes(r) ? p.roles.filter((x) => x !== r) : [...p.roles, r];
    // productor y contratista son excluyentes
    if (r === "PRODUCTOR" && roles.includes("PRODUCTOR")) roles = roles.filter((x) => x !== "CONTRATISTA");
    if (r === "CONTRATISTA" && roles.includes("CONTRATISTA")) roles = roles.filter((x) => x !== "PRODUCTOR");
    return { ...p, roles };
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.roles.length) return setError("Asigná al menos un rol.");
    setSaving(true);
    const base = { email: form.email.trim(), nombre: form.nombre.trim(), apellido: form.apellido.trim(), roles: form.roles, id_localidad: form.id_localidad ? Number(form.id_localidad) : null, telefono: form.telefono.trim() || null, cuil_cuit: form.cuil_cuit.trim() || null };
    try {
      if (editing) await usuariosApi.update(editing.id_user, { ...base, ...(form.password ? { password: form.password } : {}) });
      else await usuariosApi.create({ ...base, password: form.password });
      toast.success(editing ? "Usuario actualizado" : "Usuario creado");
      setEditing(undefined);
      lista.reload();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const del = async (u: Usuario) => {
    if (!(await confirm({ title: "Eliminar usuario", message: `¿Eliminar a ${fullName(u)} (${u.email})? Solo es posible si no tiene campos, servicios ni solicitudes.`, danger: true, confirmLabel: "Eliminar" }))) return;
    try {
      await usuariosApi.remove(u.id_user);
      toast.success("Usuario eliminado");
      lista.reload();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <AnimatedPage>
      <PageHeader eyebrow="Administración" title="Usuarios" subtitle="Alta, edición y roles. Un usuario es productor o contratista, no ambos; ADMIN se puede sumar a cualquiera." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => open(null)}>Nuevo usuario</Button>} />
      <Card padded={false}>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:max-w-2xl">
          <Input placeholder="Buscar por nombre o email" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <Select value={role} onChange={(e) => { setRole(e.target.value as RoleName | ""); setPage(1); }}>
            <option value="">Todos los roles</option>
            {ALL.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </Select>
        </div>
        {lista.error && <div className="px-4 pb-4"><Alert kind="error">{lista.error}</Alert></div>}
        {lista.loading ? (
          <div className="space-y-2 p-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : !lista.data?.items.length ? (
          <div className="p-4"><EmptyState icon={<Users className="h-6 w-6" />} title="Sin resultados" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr><Th>Usuario</Th><Th>Roles</Th><Th>Localidad</Th><Th>Teléfono</Th><Th className="text-right">Acciones</Th></tr></thead>
              <tbody>
                {lista.data.items.map((u) => (
                  <tr key={u.id_user} className={cn("transition hover:bg-stone-50 dark:hover:bg-stone-800/50", u.id_user === me?.id_user && "bg-brand-50/40 dark:bg-brand-900/10")}>
                    <Td><span className="flex items-center gap-3"><Avatar name={fullName(u)} src={u.foto_url} size="sm" zoomable /><span><span className="block font-semibold">{fullName(u)}</span><span className="block text-xs text-stone-500">{u.email}</span></span></span></Td>
                    <Td><span className="flex flex-wrap gap-1">{u.roles.map((r) => <RoleBadge key={r} role={r} />)}</span></Td>
                    <Td>{ubicacion(u.localidad)}</Td>
                    <Td>{u.telefono || "—"}</Td>
                    <Td className="text-right"><span className="inline-flex gap-1"><Button variant="ghost" size="sm" onClick={() => open(u)} aria-label="Editar"><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => del(u)} disabled={u.id_user === me?.id_user} aria-label="Eliminar"><Trash2 className="h-4 w-4 text-red-500" /></Button></span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {lista.data && <div className="px-4 pb-4"><Pagination page={lista.data.page} totalPages={lista.data.totalPages} total={lista.data.total} onChange={setPage} /></div>}
      </Card>

      {editing !== undefined && (
        <Dialog open onClose={() => setEditing(undefined)} title={editing ? `Editar ${fullName(editing)}` : "Nuevo usuario"} footer={<><Button variant="ghost" onClick={() => setEditing(undefined)}>Cancelar</Button><Button form="user-form" type="submit" loading={saving}>Guardar</Button></>}>
          <form id="user-form" onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" required><Input value={form.nombre} onChange={set("nombre")} required /></Field>
              <Field label="Apellido" required><Input value={form.apellido} onChange={set("apellido")} required /></Field>
              <Field label="Email" required><Input type="email" value={form.email} onChange={set("email")} required /></Field>
              <Field label={editing ? "Nueva contraseña (opcional)" : "Contraseña"} required={!editing} hint="Mínimo 8 caracteres"><Input type="password" autoComplete="new-password" value={form.password} onChange={set("password")} required={!editing} minLength={8} /></Field>
              <Field label="CUIL / CUIT"><Input value={form.cuil_cuit} onChange={set("cuil_cuit")} placeholder="20-12345678-9" /></Field>
              <Field label="Teléfono"><Input value={form.telefono} onChange={set("telefono")} /></Field>
              <Field label="Localidad" className="sm:col-span-2">
                <Select value={form.id_localidad} onChange={set("id_localidad")}>
                  <option value="">Sin localidad</option>
                  {localidades.data?.map((l) => <option key={l.id_localidad} value={l.id_localidad}>{l.nombre}{l.provincia ? ` (${l.provincia.nombre})` : ""}</option>)}
                </Select>
              </Field>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">Roles</legend>
              <div className="flex flex-wrap gap-2">
                {ALL.map((r) => (
                  <button key={r} type="button" onClick={() => toggleRole(r)} aria-pressed={form.roles.includes(r)} className={cn("rounded-xl border-2 px-3 py-1.5 text-sm font-semibold transition", form.roles.includes(r) ? "border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-900/30 dark:text-brand-100" : "border-stone-200 text-stone-600 hover:border-stone-300 dark:border-stone-700 dark:text-stone-300")}>
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </fieldset>
            {error && <Alert kind="error">{error}</Alert>}
          </form>
        </Dialog>
      )}
    </AnimatedPage>
  );
}
