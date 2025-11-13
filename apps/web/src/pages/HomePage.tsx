import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-900 text-white">

      <div className="w-full px-6 py-20 flex flex-col lg:flex-row items-center justify-center gap-16">

        {/* Texto principal */}
        <section className="w-full lg:w-1/2 max-w-2xl space-y-6">
          <p className="inline-flex items-center rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-500/40">
            AgroApp · Gestión de servicios agrícolas
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Conectá productores y prestamistas
            <span className="block text-emerald-400">de forma simple y ordenada.</span>
          </h1>

          <p className="text-sm text-slate-200 sm:text-base">
            Administrá provincias, campos, categorías de servicio, insumos y mucho más.
            AgroApp centraliza la información para que clientes y prestamistas trabajen
            con claridad y sin papeles.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/categorias"
              className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Ver categorías de servicio
            </Link>
            <Link
              to="/insumos"
              className="rounded-md border border-emerald-400/70 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/40"
            >
              Gestionar insumos
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-10 text-xs text-slate-300">
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-300">Clientes</span>
              <span>Registran sus campos y solicitan servicios.</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-300">Prestamistas</span>
              <span>Ofrecen servicios y gestionan solicitudes.</span>
            </div>
          </div>
        </section>

        {/* Tarjeta derecha */}
        <section className="w-full lg:w-1/3 max-w-md rounded-2xl bg-slate-900/70 p-6 shadow-xl shadow-black/40 ring-1 ring-emerald-500/20 backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-emerald-100 text-center">
            Vista rápida del sistema
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-slate-800/70 p-3">
              <p className="text-xs text-slate-400">Módulos básicos</p>
              <p className="text-lg font-bold text-emerald-300">
                Provincias,<br />Localidades,<br />Usuarios
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-3">
              <p className="text-xs text-slate-400">Catálogo</p>
              <p className="text-lg font-bold text-emerald-300">
                Categorías,<br />Servicios,<br />Insumos
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-3 col-span-2 text-center">
              <p className="text-xs text-slate-400">Productores</p>
              <p className="text-sm">
                Gestionan <span className="font-semibold text-emerald-300">campos</span> y{" "}
                <span className="font-semibold text-emerald-300">solicitudes</span> de servicio.
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs text-slate-300 text-center">
            Iniciá sesión desde el menú superior para acceder según tu rol:
            <span className="text-emerald-300"> cliente</span> o
            <span className="text-emerald-300"> prestamista</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
