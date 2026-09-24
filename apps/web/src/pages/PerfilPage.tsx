import { Camera, KeyRound, MapPinOff, Save, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { auth as authApi, getApiErrorMessage, localidades as localidadesApi } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useFeedback } from "../components/feedback";
import { AnimatedPage } from "../components/layout/AppShell";
import { MapView } from "../components/MapView";
import { Alert, Avatar, Button, Card, Field, Input, PageHeader, RoleBadge, Select, Textarea } from "../components/ui";
import { fullName, isoToDateInput } from "../lib/format";
import { useQuery } from "../lib/useQuery";

const FOTO_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const FOTO_MAX_BYTES = 5 * 1024 * 1024;

export default function PerfilPage() {
  const { user, setUser, isContratista, isProductor } = useAuth();
  const { toast } = useFeedback();
  const localidades = useQuery(() => localidadesApi.list(), []);

  const [form, setForm] = useState({
    nombre: user?.nombre ?? "", apellido: user?.apellido ?? "", cuil_cuit: user?.cuil_cuit ?? "", telefono: user?.telefono ?? "",
    fecha_nac: isoToDateInput(user?.fecha_nac), domicilio: user?.domicilio ?? "", id_localidad: user?.id_localidad ? String(user.id_localidad) : "",
    razon_social: user?.productor?.razon_social ?? "", descripcion: user?.contratista?.descripcion ?? "", anios_experiencia: user?.contratista?.anios_experiencia?.toString() ?? "",
    lat: user?.contratista?.latitud != null ? String(user.contratista.latitud) : "", lng: user?.contratista?.longitud != null ? String(user.contratista.longitud) : "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pw, setPw] = useState({ actual: "", nueva: "", repetir: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [fotoSaving, setFotoSaving] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onFotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!file) return;
    if (!FOTO_MIME_TYPES.includes(file.type)) return toast.error("Formatos permitidos: JPG, PNG o WebP");
    if (file.size > FOTO_MAX_BYTES) return toast.error("La imagen no puede superar los 5 MB");
    setFotoSaving(true);
    try {
      setUser(await authApi.uploadFoto(file));
      toast.success("Foto de perfil actualizada");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "No se pudo subir la foto"));
    } finally {
      setFotoSaving(false);
    }
  };

  const quitarFoto = async () => {
    setFotoSaving(true);
    try {
      setUser(await authApi.deleteFoto());
      toast.success("Foto de perfil eliminada");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "No se pudo quitar la foto"));
    } finally {
      setFotoSaving(false);
    }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await authApi.updateMe({
        nombre: form.nombre.trim(), apellido: form.apellido.trim(), cuil_cuit: form.cuil_cuit.trim() || null, telefono: form.telefono.trim() || null,
        fecha_nac: form.fecha_nac || null, domicilio: form.domicilio.trim() || null, id_localidad: form.id_localidad ? Number(form.id_localidad) : null,
        ...(isProductor ? { razon_social: form.razon_social.trim() || null } : {}),
        ...(isContratista
          ? {
              descripcion: form.descripcion.trim() || null,
              anios_experiencia: form.anios_experiencia ? Number(form.anios_experiencia) : null,
              latitud: form.lat ? Number(form.lat) : null,
              longitud: form.lng ? Number(form.lng) : null,
            }
          : {}),
      });
      setUser(updated);
      toast.success("Perfil actualizado");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const changePw = async (e: FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (pw.nueva !== pw.repetir) return setPwError("Las contraseñas nuevas no coinciden");
    setPwSaving(true);
    try {
      await authApi.changePassword(pw.actual, pw.nueva);
      setPw({ actual: "", nueva: "", repetir: "" });
      toast.success("Contraseña actualizada");
    } catch (err) {
      setPwError(getApiErrorMessage(err));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <AnimatedPage>
      <PageHeader title="Mi perfil" subtitle="Tus datos de contacto se muestran solo a la otra parte de una solicitud." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card title="Datos personales">
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" required><Input value={form.nombre} onChange={set("nombre")} required /></Field>
              <Field label="Apellido" required><Input value={form.apellido} onChange={set("apellido")} required /></Field>
              <Field label="CUIL / CUIT" hint="Formato 20-12345678-9"><Input value={form.cuil_cuit} onChange={set("cuil_cuit")} placeholder="20-12345678-9" /></Field>
              <Field label="Teléfono"><Input value={form.telefono} onChange={set("telefono")} placeholder="341-4000000" /></Field>
              <Field label="Fecha de nacimiento"><Input type="date" value={form.fecha_nac} onChange={set("fecha_nac")} /></Field>
              <Field label="Localidad">
                <Select value={form.id_localidad} onChange={set("id_localidad")}>
                  <option value="">Sin localidad</option>
                  {localidades.data?.map((l) => <option key={l.id_localidad} value={l.id_localidad}>{l.nombre}{l.provincia ? ` (${l.provincia.nombre})` : ""}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Domicilio"><Input value={form.domicilio} onChange={set("domicilio")} /></Field>
            {isProductor && <Field label="Razón social / establecimiento"><Input value={form.razon_social} onChange={set("razon_social")} placeholder="Ej: Establecimiento La Esperanza" /></Field>}
            {isContratista && (
              <>
                <Field label="Descripción pública" hint="Se muestra en tu perfil y en tus servicios. Contá qué hacés, con qué equipos y en qué zona trabajás."><Textarea value={form.descripcion} onChange={set("descripcion")} maxLength={600} /></Field>
                <Field label="Años de experiencia"><Input type="number" min="0" max="80" value={form.anios_experiencia} onChange={set("anios_experiencia")} /></Field>
              </>
            )}
            {error && <Alert kind="error">{error}</Alert>}
            <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>Guardar cambios</Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar name={fullName(user)} src={user.foto_url} size="lg" />
                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  disabled={fotoSaving}
                  aria-label="Cambiar foto de perfil"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input ref={fotoInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={onFotoChange} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{fullName(user)}</p>
                <p className="truncate text-sm text-stone-500">{user.email}</p>
                {user.foto_url && (
                  <button type="button" onClick={quitarFoto} disabled={fotoSaving} className="mt-1 flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 disabled:opacity-60">
                    <X className="h-3 w-3" /> Quitar foto
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">{user.roles.map((r) => <RoleBadge key={r} role={r} />)}</div>
            <p className="mt-3 text-xs text-stone-500">El email y los roles los administra un administrador.</p>
          </Card>

          {isContratista && (
            <Card title="Zona de trabajo" subtitle="Marcá desde dónde salís a trabajar. Se usa solo para calcular distancias: los productores ven a cuántos kilómetros estás, nunca tu ubicación exacta.">
              <MapView
                point={form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : null}
                onPick={(p) => setForm((f) => ({ ...f, lat: String(p.lat), lng: String(p.lng) }))}
                height="h-56"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Latitud"><Input type="number" step="0.000001" value={form.lat} onChange={set("lat")} placeholder="-33.7458" /></Field>
                <Field label="Longitud"><Input type="number" step="0.000001" value={form.lng} onChange={set("lng")} placeholder="-61.9689" /></Field>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Si no la cargás, la distancia se calcula desde el centro de tu localidad.
              </p>
              {(form.lat || form.lng) && (
                <Button variant="ghost" size="sm" className="mt-2" icon={<MapPinOff className="h-4 w-4" />} onClick={() => setForm((f) => ({ ...f, lat: "", lng: "" }))}>
                  Quitar ubicación
                </Button>
              )}
              <p className="mt-3 text-xs text-stone-500">Se guarda con el botón de arriba, junto al resto del perfil.</p>
            </Card>
          )}

          <Card title="Cambiar contraseña">
            <form onSubmit={changePw} className="space-y-3">
              <Field label="Contraseña actual" required><Input type="password" autoComplete="current-password" value={pw.actual} onChange={(e) => setPw((p) => ({ ...p, actual: e.target.value }))} required /></Field>
              <Field label="Nueva contraseña" required hint="Mínimo 8 caracteres"><Input type="password" autoComplete="new-password" value={pw.nueva} onChange={(e) => setPw((p) => ({ ...p, nueva: e.target.value }))} required minLength={8} /></Field>
              <Field label="Repetir nueva contraseña" required><Input type="password" autoComplete="new-password" value={pw.repetir} onChange={(e) => setPw((p) => ({ ...p, repetir: e.target.value }))} required /></Field>
              {pwError && <Alert kind="error">{pwError}</Alert>}
              <Button type="submit" variant="outline" loading={pwSaving} icon={<KeyRound className="h-4 w-4" />}>Actualizar contraseña</Button>
            </form>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
