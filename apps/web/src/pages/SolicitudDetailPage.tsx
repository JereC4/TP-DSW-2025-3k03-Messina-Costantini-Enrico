import { ArrowLeft, Ban, Check, CheckCircle2, Mail, MapPin, Phone, Star, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage, solicitudes as solicitudesApi, valoraciones as valoracionesApi } from "../api";
import type { UsuarioContacto } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { useFeedback } from "../components/feedback";
import { AnimatedPage } from "../components/layout/AppShell";
import { SolicitudTimeline } from "../components/SolicitudTimeline";
import { Alert, Avatar, Button, Card, DetailItem, EstadoBadge, PageSpinner, Stars, Table, Td, Textarea, Th, Field, Input } from "../components/ui";
import { Dialog } from "../components/ui/Dialog";
import { fmtDate, fmtDateTime, fmtHa, fmtMoneyExact, fmtNumber, fullName, isoToDateInput, dateInputToIso, ubicacion } from "../lib/format";
import { useQuery } from "../lib/useQuery";

function Contacto({ titulo, u, extra }: { titulo: string; u?: UsuarioContacto; extra?: string | null }) {
  return (
    <div className="flex gap-3">
      <Avatar name={fullName(u)} src={u?.foto_url} zoomable />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{titulo}</p>
        <p className="font-bold">{fullName(u)}</p>
        {extra && <p className="text-xs text-stone-500">{extra}</p>}
        <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-300"><MapPin className="h-3.5 w-3.5" />{ubicacion(u?.localidad)}</p>
        {u?.email && <a href={`mailto:${u.email}`} className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline dark:text-brand-300"><Mail className="h-3.5 w-3.5" />{u.email}</a>}
        {u?.telefono && <a href={`tel:${u.telefono}`} className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline dark:text-brand-300"><Phone className="h-3.5 w-3.5" />{u.telefono}</a>}
      </div>
    </div>
  );
}

export default function SolicitudDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast, confirm } = useFeedback();
  const q = useQuery(() => solicitudesApi.get(Number(id)), [id]);
  const [motivoDialog, setMotivoDialog] = useState<"rechazada" | "cancelada" | null>(null);
  const [motivo, setMotivo] = useState("");
  const [aceptarDialog, setAceptarDialog] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");

  if (q.loading) return <PageSpinner />;
  if (q.error || !q.data) return <Alert kind="error">{q.error ?? "Solicitud no encontrada"}</Alert>;
  const s = q.data;

  const soyProductor = user?.id_user === s.id_productor;
  const soyContratista = user?.id_user === s.id_contratista;
  const puedeAceptar = (soyContratista || isAdmin) && s.estado === "pendiente";
  const puedeCompletar = (soyContratista || isAdmin) && s.estado === "aceptada";
  const puedeCancelar = ((soyProductor && (s.estado === "pendiente" || s.estado === "aceptada")) || (soyContratista && s.estado === "aceptada") || (isAdmin && (s.estado === "pendiente" || s.estado === "aceptada")));
  const puedeValorar = soyProductor && s.estado === "completada" && !s.valoracion;

  const cambiar = async (estado: "aceptada" | "rechazada" | "cancelada" | "completada", extra: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const updated = await solicitudesApi.cambiarEstado(s.id_solicitud, { estado, ...extra });
      q.setData(updated);
      toast.success(`Solicitud ${estado}`);
      setMotivoDialog(null);
      setAceptarDialog(false);
      setMotivo("");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const completar = async () => {
    if (!(await confirm({ title: "Marcar como completada", message: "¿Confirmás que el trabajo se realizó? El productor va a poder valorarte." }))) return;
    cambiar("completada");
  };

  const valorar = async () => {
    if (!rating) return toast.error("Elegí una puntuación");
    setBusy(true);
    try {
      await valoracionesApi.create({ id_solicitud: s.id_solicitud, puntaje: rating, comentario: comentario.trim() || null });
      toast.success("¡Gracias por tu valoración!");
      q.reload();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const eliminar = async () => {
    if (!(await confirm({ title: "Eliminar solicitud", message: "Borrado físico, solo para administración.", danger: true, confirmLabel: "Eliminar" }))) return;
    await solicitudesApi.remove(s.id_solicitud);
    toast.success("Solicitud eliminada");
    navigate("/solicitudes");
  };

  return (
    <AnimatedPage>
      <Link to="/solicitudes" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"><ArrowLeft className="h-4 w-4" /> Solicitudes</Link>

      <div className="surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-stone-400">Solicitud #{s.id_solicitud}</span>
              <EstadoBadge estado={s.estado} />
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-white">{s.servicio?.nombre}</h1>
            <p className="text-sm text-stone-500">{s.servicio?.categoria?.nombre} · pedida el {fmtDateTime(s.fecha_solicitud)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {puedeAceptar && <Button icon={<Check className="h-4 w-4" />} onClick={() => { setFechaInicio(isoToDateInput(s.fecha_inicio)); setAceptarDialog(true); }}>Aceptar</Button>}
            {puedeAceptar && <Button variant="outline" icon={<X className="h-4 w-4" />} onClick={() => setMotivoDialog("rechazada")}>Rechazar</Button>}
            {puedeCompletar && <Button icon={<CheckCircle2 className="h-4 w-4" />} onClick={completar} loading={busy}>Marcar completada</Button>}
            {puedeCancelar && <Button variant="ghost" icon={<Ban className="h-4 w-4" />} onClick={() => setMotivoDialog("cancelada")}>Cancelar solicitud</Button>}
            {isAdmin && <Button variant="danger" size="sm" onClick={eliminar}>Eliminar</Button>}
          </div>
        </div>
        <div className="mt-5"><div className="overflow-x-auto"><SolicitudTimeline s={s} /></div></div>
        {(s.estado === "rechazada" || s.estado === "cancelada") && s.motivo && <Alert kind="warning" className="mt-4"><b>Motivo:</b> {s.motivo}</Alert>}
        {s.estado === "pendiente" && soyContratista && <Alert kind="info" className="mt-4">El productor espera tu respuesta. Al aceptar podés fijar la fecha de inicio.</Alert>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card title="Detalle del trabajo">
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Campo"><Link to={`/campos/${s.id_campo}`} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">{s.campo?.nombre}</Link><span className="block text-xs text-stone-500">{ubicacion(s.campo?.localidad)} · {fmtHa(s.campo?.hectareas)} totales</span></DetailItem>
              <DetailItem label="Hectáreas a trabajar"><span className="text-lg font-bold">{fmtHa(s.hectareas_trabajadas)}</span></DetailItem>
              <DetailItem label="Fecha de inicio">{fmtDate(s.fecha_inicio)}</DetailItem>
              <DetailItem label="Fecha de fin">{fmtDate(s.fecha_fin)}</DetailItem>
              {s.observaciones && <DetailItem label="Observaciones del productor" className="sm:col-span-2"><span className="italic text-stone-600 dark:text-stone-300">“{s.observaciones}”</span></DetailItem>}
            </dl>
          </Card>

          <Card title="Insumos" subtitle="Solo se cobran los que aporta el contratista, al precio de referencia del momento.">
            {!s.solicitud_insumo?.length ? (
              <p className="text-sm text-stone-500">Sin insumos.</p>
            ) : (
              <Table>
                <thead><tr><Th>Insumo</Th><Th>Cantidad</Th><Th>Lo aporta</Th><Th>Precio unit.</Th><Th className="text-right">Subtotal</Th></tr></thead>
                <tbody>
                  {s.solicitud_insumo.map((i) => (
                    <tr key={i.id_solicitud_insumo ?? i.id_insumo}>
                      <Td className="font-medium">{i.insumo?.nombre}</Td>
                      <Td>{fmtNumber(i.cantidad)} {i.insumo?.unidad}</Td>
                      <Td>{i.proveedor === "PRODUCTOR" ? "Productor" : "Contratista"}</Td>
                      <Td>{i.proveedor === "PRODUCTOR" ? "—" : fmtMoneyExact(i.precio_unit)}</Td>
                      <Td className="text-right font-semibold">{i.proveedor === "PRODUCTOR" ? "—" : fmtMoneyExact(Number(i.cantidad) * Number(i.precio_unit))}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>

          {s.valoracion && (
            <Card title="Valoración del productor">
              <Stars value={s.valoracion.puntaje} size="md" />
              {s.valoracion.comentario && <p className="mt-2 text-stone-700 dark:text-stone-300">“{s.valoracion.comentario}”</p>}
              <p className="mt-1 text-xs text-stone-500">{fmtDate(s.valoracion.fecha)}</p>
            </Card>
          )}
          {puedeValorar && (
            <Card title="¿Cómo fue el trabajo?" subtitle="Tu valoración se muestra en el perfil del contratista y ayuda a otros productores.">
              <Stars value={rating || null} size="lg" onChange={setRating} />
              <Textarea className="mt-3" placeholder="Contá cómo te fue (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} maxLength={500} />
              <Button className="mt-3" icon={<Star className="h-4 w-4" />} onClick={valorar} loading={busy}>Enviar valoración</Button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Importes">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-stone-500">Servicio ({fmtMoneyExact(s.precio_hectarea)} × {fmtNumber(s.hectareas_trabajadas)} ha)</dt><dd className="font-semibold">{fmtMoneyExact(s.precio_servicio)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Insumos del contratista</dt><dd className="font-semibold">{fmtMoneyExact(s.costo_insumos)}</dd></div>
              <div className="flex justify-between border-t border-stone-200 pt-2 dark:border-stone-700"><dt className="font-bold">Total</dt><dd className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">{fmtMoneyExact(s.precio_total)}</dd></div>
            </dl>
          </Card>
          <Card>
            <div className="space-y-5">
              <Contacto titulo="Contratista" u={s.contratista_profile?.users} extra={s.contratista_profile?.descripcion ?? undefined} />
              <div className="h-px bg-stone-200 dark:bg-stone-800" />
              <Contacto titulo="Productor" u={s.productor_profile?.users} extra={s.productor_profile?.razon_social ?? undefined} />
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={aceptarDialog} onClose={() => setAceptarDialog(false)} title="Aceptar solicitud" size="sm" footer={<><Button variant="ghost" onClick={() => setAceptarDialog(false)}>Volver</Button><Button loading={busy} onClick={() => cambiar("aceptada", { fecha_inicio: dateInputToIso(fechaInicio) ?? null })}>Confirmar</Button></>}>
        <p className="text-sm text-stone-600 dark:text-stone-300">Al aceptar te comprometés a realizar el trabajo por {fmtMoneyExact(s.precio_total)}. Podés indicar cuándo empezás.</p>
        <Field label="Fecha de inicio" className="mt-4" hint={s.fecha_inicio ? `El productor pidió ${fmtDate(s.fecha_inicio)}` : "Si la dejás vacía, se toma hoy"}><Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} /></Field>
      </Dialog>

      <Dialog open={!!motivoDialog} onClose={() => setMotivoDialog(null)} title={motivoDialog === "rechazada" ? "Rechazar solicitud" : "Cancelar solicitud"} size="sm" footer={<><Button variant="ghost" onClick={() => setMotivoDialog(null)}>Volver</Button><Button variant="danger" loading={busy} disabled={motivo.trim().length < 3} onClick={() => cambiar(motivoDialog!, { motivo: motivo.trim() })}>{motivoDialog === "rechazada" ? "Rechazar" : "Cancelar solicitud"}</Button></>}>
        <Field label="Motivo" required hint="La otra parte lo va a ver."><Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={500} placeholder={motivoDialog === "rechazada" ? "Ej: no tengo disponibilidad en esa fecha" : "Ej: cambió el plan de siembra"} /></Field>
      </Dialog>
    </AnimatedPage>
  );
}
