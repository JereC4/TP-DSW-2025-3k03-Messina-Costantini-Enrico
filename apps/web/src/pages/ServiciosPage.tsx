import { motion } from "framer-motion";
import { SearchX, Tractor } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categorias as categoriasApi, provincias as provinciasApi, servicios as serviciosApi } from "../api";
import type { Servicio } from "../api/types";
import { AnimatedPage } from "../components/layout/AppShell";
import { Alert, EmptyState, Field, Input, PageHeader, Pagination, Select, SkeletonCard, Stars } from "../components/ui";
import { fmtMoney, fullName, pluralize, ubicacion } from "../lib/format";
import { useDebounce } from "../lib/useDebounce";
import { useQuery } from "../lib/useQuery";

export function ServicioCard({ s, index = 0 }: { s: Servicio; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 8) * 0.04 }}>
      <Link to={`/servicios/${s.id_servicio}`} className="surface surface-hover flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-100">{s.categoria?.nombre ?? "Sin categoría"}</span>
          {typeof s.trabajos_completados === "number" && s.trabajos_completados > 0 && <span className="text-xs text-stone-500">{pluralize(s.trabajos_completados, "trabajo", "trabajos")}</span>}
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-stone-900 dark:text-white">{s.nombre}</h3>
        {s.descripcion && <p className="mt-1 line-clamp-2 text-sm text-stone-600 dark:text-stone-400">{s.descripcion}</p>}
        <div className="mt-auto pt-4">
          <p className="text-sm text-stone-600 dark:text-stone-300">{fullName(s.contratista_profile?.users)}</p>
          <p className="text-xs text-stone-500">{ubicacion(s.contratista_profile?.users.localidad)}</p>
          <p className="mt-2 text-xl font-extrabold text-brand-700 dark:text-brand-300">
            {s.precio_vigente ? <>{fmtMoney(s.precio_vigente.valor)} <span className="text-sm font-medium text-stone-500">/ ha</span></> : <span className="text-sm font-medium text-harvest-700">Sin precio publicado</span>}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/** Catálogo público con filtros por categoría, provincia y texto. */
export default function ServiciosPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const dq = useDebounce(q);
  const categoria = params.get("categoria") ?? "";
  const provincia = params.get("provincia") ?? "";
  const page = Number(params.get("page") ?? 1);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    if (k !== "page") next.delete("page");
    setParams(next, { replace: true });
  };

  const categorias = useQuery(() => categoriasApi.list(), []);
  const provincias = useQuery(() => provinciasApi.list(), []);
  const servicios = useQuery(
    () => serviciosApi.list({ q: dq || undefined, id_categoria: categoria ? Number(categoria) : undefined, id_provincia: provincia ? Number(provincia) : undefined, page, pageSize: 12 }),
    [dq, categoria, provincia, page],
  );

  return (
    <AnimatedPage className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader eyebrow="Catálogo" title="Servicios rurales" subtitle="Compará precios por hectárea y elegí al contratista que mejor se adapte a tu campo." />

      <div className="surface mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <Field label="Buscar"><Input placeholder="Siembra, cosecha, pulverización…" value={q} onChange={(e) => { setQ(e.target.value); setParam("page", ""); }} /></Field>
        <Field label="Categoría">
          <Select value={categoria} onChange={(e) => setParam("categoria", e.target.value)}>
            <option value="">Todas</option>
            {categorias.data?.map((c) => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </Select>
        </Field>
        <Field label="Provincia del contratista">
          <Select value={provincia} onChange={(e) => setParam("provincia", e.target.value)}>
            <option value="">Todas</option>
            {provincias.data?.map((p) => <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>)}
          </Select>
        </Field>
      </div>

      {servicios.error && <Alert kind="error" className="mb-4">{servicios.error}</Alert>}
      {servicios.loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : !servicios.data?.items.length ? (
        <EmptyState icon={<SearchX className="h-6 w-6" />} title="No encontramos servicios con esos filtros">Probá con otra categoría o ampliá la zona.</EmptyState>
      ) : (
        <>
          <p className="mb-3 text-sm text-stone-500">{servicios.data.total} servicios</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.data.items.map((s, i) => <ServicioCard key={s.id_servicio} s={s} index={i} />)}
          </div>
          <Pagination page={servicios.data.page} totalPages={servicios.data.totalPages} total={servicios.data.total} onChange={(p) => setParam("page", String(p))} />
        </>
      )}

      <div className="mt-10 flex items-center gap-3 rounded-2xl border border-dashed border-stone-300 p-4 text-sm text-stone-600 dark:border-stone-700 dark:text-stone-400">
        <Tractor className="h-5 w-5 shrink-0 text-brand-600" />
        <span>¿Preferís elegir por persona? <Link to="/contratistas" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">Buscá contratistas cerca de tu campo</Link> y mirá sus valoraciones <Stars value={null} className="ml-1" />.</span>
      </div>
    </AnimatedPage>
  );
}
