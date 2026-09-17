import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardCheck, MapPin, ShieldCheck, Sprout, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { categorias as categoriasApi, contratistas as contratistasApi, servicios as serviciosApi } from "../api";
import { useAuth } from "../auth/AuthContext";
import { AnimatedPage } from "../components/layout/AppShell";
import { CategoriaIcon } from "../components/icons/CategoriaIcons";
import { Avatar, LinkButton, Stars } from "../components/ui";
import { fmtMoney, fullName, pluralize, ubicacion } from "../lib/format";
import { useQuery } from "../lib/useQuery";

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const { user, isProductor, isContratista } = useAuth();
  const categorias = useQuery(() => categoriasApi.list(), []);
  const destacados = useQuery(() => serviciosApi.list({ pageSize: 6 }), []);
  const top = useQuery(() => contratistasApi.list({ pageSize: 3 }), []);

  return (
    <AnimatedPage>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-20">
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.08 }} className="min-w-0 space-y-6">
            <motion.p variants={fade} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-800 backdrop-blur dark:border-brand-800 dark:bg-stone-900/60 dark:text-brand-200">
              <Sprout className="h-3.5 w-3.5" /> Servicios rurales con precio por hectárea
            </motion.p>
            <motion.h1 variants={fade} className="text-4xl font-extrabold leading-[1.05] text-stone-900 sm:text-5xl lg:text-6xl dark:text-white">
              El contratista que tu campo necesita, <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">a un click.</span>
            </motion.h1>
            <motion.p variants={fade} className="max-w-xl text-base text-stone-600 sm:text-lg dark:text-stone-300">
              Los contratistas publican siembra, cosecha, pulverización y más con su precio por hectárea. Los productores registran sus campos, comparan y solicitan. El seguimiento del trabajo, en un solo lugar.
            </motion.p>
            <motion.div variants={fade} className="flex flex-wrap gap-3">
              {user ? (
                <LinkButton to="/app" size="lg" icon={<ArrowRight className="h-4 w-4" />}>Ir a mi panel</LinkButton>
              ) : (
                <>
                  <LinkButton to="/registro" size="lg">Crear cuenta gratis</LinkButton>
                  <LinkButton to="/servicios" size="lg" variant="outline">Explorar servicios</LinkButton>
                </>
              )}
            </motion.div>
            <motion.ul variants={fade} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
              {["Precios transparentes", "Contratistas valorados", "Cerca de tu campo"].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-600" />{t}</li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="relative min-w-0">
            <div className="surface space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-500">Servicios destacados</p>
                <Link to="/servicios" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">Ver todos</Link>
              </div>
              <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                {(destacados.data?.items ?? []).slice(0, 4).map((s) => (
                  <li key={s.id_servicio}>
                    <Link to={`/servicios/${s.id_servicio}`} className="flex items-center gap-3 py-3 transition hover:opacity-80">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"><CategoriaIcon categoria={s.categoria?.nombre} className="h-7 w-7" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{s.nombre}</span>
                        <span className="block truncate text-xs text-stone-500">{fullName(s.contratista_profile?.users)} · {ubicacion(s.contratista_profile?.users.localidad)}</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-brand-700 dark:text-brand-300">{s.precio_vigente ? `${fmtMoney(s.precio_vigente.valor)}/ha` : "—"}</span>
                    </Link>
                  </li>
                ))}
                {destacados.loading && [1, 2, 3, 4].map((i) => <li key={i} className="py-3"><div className="skeleton h-10" /></li>)}
              </ul>
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-card-hover sm:block dark:bg-stone-900">
              <p className="text-xs text-stone-500">Valoración promedio</p>
              <Stars value={4.7} size="md" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Cómo funciona</p>
          <h2 className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-white">Tres pasos, sin papeles</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { Icon: Sprout, title: "El contratista publica", text: "Elige la categoría, describe el servicio y fija su precio por hectárea. Puede actualizarlo cuando quiera: el historial se conserva." },
            { Icon: MapPin, title: "El productor solicita", text: "Registra sus campos con ubicación, busca contratistas cercanos y pide el servicio con hectáreas, fechas e insumos." },
            { Icon: ClipboardCheck, title: "Se gestiona el trabajo", text: "Aceptación, ejecución y cierre con importes calculados automáticamente. Al terminar, el productor valora al contratista." },
          ].map(({ Icon, title, text }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.1 }} className="surface surface-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm"><Icon className="h-5 w-5" /></span>
              <p className="mt-4 text-lg font-bold">{title}</p>
              <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-sand-200/60 py-16 dark:bg-stone-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Categorías</p>
              <h2 className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-white">Todo lo que se hace en el campo</h2>
            </div>
            <Link to="/servicios" className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block dark:text-brand-300">Ver catálogo</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(categorias.data ?? []).map((c, i) => (
              <motion.div key={c.id_categoria} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link to={`/servicios?categoria=${c.id_categoria}`} className="surface surface-hover block p-4 text-center">
                  <p className="font-semibold">{c.nombre}</p>
                  <p className="mt-1 text-xs text-stone-500">{pluralize(c._count?.servicio ?? 0, "servicio", "servicios")}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contratistas */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Contratistas</p>
          <h2 className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-white">Gente que ya está trabajando</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {(top.data?.items ?? []).map((c) => (
            <Link key={c.id_user} to={`/contratistas/${c.id_user}`} className="surface surface-hover flex flex-col p-5">
              <div className="flex items-center gap-3">
                <Avatar name={fullName(c.users)} />
                <div className="min-w-0">
                  <p className="truncate font-bold">{fullName(c.users)}</p>
                  <p className="truncate text-xs text-stone-500">{ubicacion(c.users.localidad)}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-stone-600 dark:text-stone-400">{c.descripcion || "Sin descripción"}</p>
              <div className="mt-4 flex items-center justify-between">
                <Stars value={c.valoracion.promedio} count={c.valoracion.cantidad} />
                <span className="text-xs text-stone-500">{pluralize(c.trabajos_completados, "trabajo", "trabajos")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-12 text-center text-white sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_0%,rgba(255,255,255,0.18),transparent)]" />
            <div className="relative">
              <ShieldCheck className="mx-auto h-10 w-10 text-brand-200" />
              <h2 className="mt-4 text-3xl font-extrabold">Sumate como productor o contratista</h2>
              <p className="mx-auto mt-2 max-w-xl text-brand-100">Es gratis. En dos minutos publicás tu primer servicio o registrás tu primer campo.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/registro" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-800 shadow-sm transition hover:bg-brand-50">Crear cuenta</Link>
                <Link to="/ingresar" className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Ya tengo cuenta</Link>
              </div>
            </div>
          </div>
        </section>
      )}
      {user && (isProductor || isContratista) && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="surface flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
            <Star className="h-8 w-8 shrink-0 text-harvest-500" />
            <div className="flex-1">
              <p className="font-bold">Hola, {user.nombre}. Tu panel te espera.</p>
              <p className="text-sm text-stone-500">{isProductor ? "Revisá tus solicitudes y registrá nuevos campos." : "Mirá las solicitudes recibidas y mantené tus precios al día."}</p>
            </div>
            <LinkButton to="/app" icon={<ArrowRight className="h-4 w-4" />}>Ir al panel</LinkButton>
          </div>
        </section>
      )}
    </AnimatedPage>
  );
}
