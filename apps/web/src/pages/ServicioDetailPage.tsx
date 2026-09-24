import { ArrowLeft, Award, CalendarDays, Info, MapPin, Tractor, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { servicios as serviciosApi, valoraciones as valoracionesApi } from "../api";
import { useAuth } from "../auth/AuthContext";
import { AnimatedPage } from "../components/layout/AppShell";
import { SolicitarWizard } from "../components/SolicitarWizard";
import { Alert, Avatar, Button, Card, DetailItem, LinkButton, PageSpinner, Stars, Table, Td, Th, VerificadoBadge } from "../components/ui";
import { fmtDate, fmtMoney, fmtMoneyExact, fullName, ubicacion } from "../lib/format";
import { useQuery } from "../lib/useQuery";

export default function ServicioDetailPage() {
  const { id } = useParams();
  const { user, isProductor } = useAuth();
  const servicio = useQuery(() => serviciosApi.get(Number(id)), [id]);
  const valoraciones = useQuery(() => valoracionesApi.list({ id_servicio: Number(id) }), [id]);
  const referencia = useQuery(() => serviciosApi.referenciaPrecio(Number(id)), [id]);
  const [wizardOpen, setWizardOpen] = useState(false);

  if (servicio.loading) return <PageSpinner />;
  if (servicio.error || !servicio.data) return <div className="mx-auto max-w-3xl p-6"><Alert kind="error">{servicio.error ?? "Servicio no encontrado"}</Alert></div>;

  const s = servicio.data;
  const c = s.contratista_profile;
  const precio = s.precio_vigente;
  const esPropio = user?.id_user === s.id_contratista;

  return (
    <AnimatedPage className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/servicios" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"><ArrowLeft className="h-4 w-4" /> Volver al catálogo</Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="surface p-6 sm:p-8">
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-100">{s.categoria?.nombre}</span>
            <h1 className="mt-3 text-3xl font-extrabold text-stone-900 dark:text-white">{s.nombre}</h1>
            {!s.activo && <Alert kind="warning" className="mt-3">Este servicio está desactivado y no aparece en el catálogo.</Alert>}
            <p className="mt-3 text-stone-600 dark:text-stone-300">{s.descripcion || "El contratista no agregó una descripción."}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <DetailItem label="Precio vigente"><span className="text-lg font-extrabold text-brand-700 dark:text-brand-300">{precio ? `${fmtMoneyExact(precio.valor)} / ha` : "Sin precio"}</span></DetailItem>
              <DetailItem label="Trabajos completados">{s.trabajos_completados ?? 0}</DetailItem>
              <DetailItem label="Publicado">{fmtDate(s.created_at)}</DetailItem>
            </dl>
          </div>

          {referencia.data?.mercado && (
            <div className="surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Precio de mercado</p>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                En {referencia.data.alcance === "provincia" ? "la provincia" : "el país"}, {referencia.data.categoria.toLowerCase()} promedia{" "}
                <strong className="text-stone-900 dark:text-white">{fmtMoney(referencia.data.mercado.promedio)}/ha</strong>, entre{" "}
                {fmtMoney(referencia.data.mercado.minimo)} y {fmtMoney(referencia.data.mercado.maximo)}.
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Calculado con los precios vigentes de {referencia.data.mercado.cantidad}{" "}
                {referencia.data.mercado.cantidad === 1 ? "servicio comparable" : "servicios comparables"} publicados en AgroApp.
              </p>
              {esPropio && referencia.data.desvio_pct !== null && (
                <p className={`mt-3 flex items-center gap-1.5 text-sm font-semibold ${referencia.data.desvio_pct > 0 ? "text-harvest-700 dark:text-harvest-300" : "text-brand-700 dark:text-brand-300"}`}>
                  {referencia.data.desvio_pct > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  Tu precio está {Math.abs(referencia.data.desvio_pct)}% {referencia.data.desvio_pct > 0 ? "por encima" : "por debajo"} del promedio.
                </p>
              )}
            </div>
          )}

          {s.precios && s.precios.length > 0 && (
            <Card title="Historial de precios" subtitle="El vigente es el de fecha más reciente que no sea futura.">
              <Table>
                <thead><tr><Th>Vigente desde</Th><Th>Precio por hectárea</Th><Th></Th></tr></thead>
                <tbody>
                  {s.precios.map((p) => (
                    <tr key={p.id_precio}>
                      <Td>{fmtDate(p.fecha_desde)}</Td>
                      <Td className="font-semibold">{fmtMoneyExact(p.valor)}</Td>
                      <Td>{precio?.id_precio === p.id_precio && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-100">vigente</span>}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          <Card title="Valoraciones" subtitle={valoraciones.data?.cantidad ? `${valoraciones.data.cantidad} opiniones de productores` : "Todavía nadie valoró este servicio"}>
            {valoraciones.data?.promedio != null && <Stars value={valoraciones.data.promedio} count={valoraciones.data.cantidad} size="md" className="mb-4" />}
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {valoraciones.data?.items.map((v) => (
                <li key={v.id_valoracion} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{fullName(v.solicitud?.productor_profile.users)}</span>
                    <Stars value={v.puntaje} />
                  </div>
                  {v.comentario && <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{v.comentario}</p>}
                  <p className="mt-1 text-xs text-stone-400">{fmtDate(v.fecha)}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Contratista</p>
            <Link to={`/contratistas/${s.id_contratista}`} className="mt-3 flex items-center gap-3 rounded-xl p-2 transition hover:bg-stone-100 dark:hover:bg-stone-800">
              <Avatar name={fullName(c?.users)} src={c?.users.foto_url} />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="truncate font-bold">{fullName(c?.users)}</span>
                  <VerificadoBadge verificado={c?.verificado} size="sm" className="shrink-0" />
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500"><MapPin className="h-3 w-3" />{ubicacion(c?.users.localidad)}</span>
              </span>
            </Link>
            {c?.descripcion && <p className="mt-3 line-clamp-3 text-sm text-stone-600 dark:text-stone-400">{c.descripcion}</p>}
            {c?.anios_experiencia != null && <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500"><Award className="h-3.5 w-3.5" />{c.anios_experiencia} años de experiencia</p>}
          </div>

          <div className="surface p-5">
            <p className="text-3xl font-extrabold text-stone-900 dark:text-white">{precio ? fmtMoney(precio.valor) : "—"} <span className="text-base font-medium text-stone-500">/ hectárea</span></p>
            {isProductor && !esPropio ? (
              precio && s.activo ? (
                <Button size="lg" className="mt-4 w-full" icon={<Tractor className="h-4 w-4" />} onClick={() => setWizardOpen(true)}>Solicitar este servicio</Button>
              ) : (
                <Alert kind="info" className="mt-4">Este servicio no se puede solicitar por ahora.</Alert>
              )
            ) : !user ? (
              <>
                <LinkButton to="/ingresar" size="lg" className="mt-4 w-full">Ingresá para solicitarlo</LinkButton>
                <p className="mt-2 text-center text-xs text-stone-500">¿No tenés cuenta? <Link to="/registro" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">Registrate como productor</Link></p>
              </>
            ) : esPropio ? (
              <LinkButton to="/mis-servicios" variant="outline" className="mt-4 w-full">Editar en Mis servicios</LinkButton>
            ) : (
              <p className="mt-4 flex items-start gap-2 text-xs text-stone-500"><Info className="mt-0.5 h-4 w-4 shrink-0" />Solo los productores pueden solicitar servicios.</p>
            )}
            <p className="mt-4 flex items-center gap-1.5 text-xs text-stone-500"><CalendarDays className="h-3.5 w-3.5" />Respuesta del contratista en la plataforma</p>
          </div>
        </aside>
      </div>

      {isProductor && precio && <SolicitarWizard open={wizardOpen} onClose={() => setWizardOpen(false)} servicio={s} />}
    </AnimatedPage>
  );
}
