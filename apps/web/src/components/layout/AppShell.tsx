import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, ClipboardList, Home, LayoutDashboard, LogOut, MapPin, Menu as MenuIcon, Moon, Package, Search, Settings2, Sprout, Sun, Tractor, User, Users, X, Layers, Map,
} from "lucide-react";
import { Fragment, startTransition, useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { cn } from "../../lib/cn";
import { fullName } from "../../lib/format";
import { useTheme } from "../../lib/theme";
import { useFeedback } from "../feedback";
import { NotificacionesMenu } from "../NotificacionesMenu";
import { Avatar, RoleBadge } from "../ui";

type Item = { to: string; label: string; icon: ReactNode; end?: boolean };

const publicItems: Item[] = [
  { to: "/servicios", label: "Servicios", icon: <Search className="h-4 w-4" /> },
  { to: "/contratistas", label: "Contratistas", icon: <Tractor className="h-4 w-4" /> },
];

function useNavItems(): { primary: Item[]; secondary: Item[] } {
  const { user, isAdmin, isProductor, isContratista } = useAuth();
  if (!user) return { primary: publicItems, secondary: [] };
  const primary: Item[] = [{ to: "/app", label: "Inicio", icon: <LayoutDashboard className="h-4 w-4" />, end: true }, ...publicItems];
  if (isProductor) {
    primary.push({ to: "/campos", label: "Mis campos", icon: <MapPin className="h-4 w-4" /> }, { to: "/solicitudes", label: "Mis solicitudes", icon: <ClipboardList className="h-4 w-4" /> });
  }
  if (isContratista) {
    primary.push({ to: "/mis-servicios", label: "Mis servicios", icon: <Sprout className="h-4 w-4" /> }, { to: "/solicitudes", label: "Solicitudes", icon: <ClipboardList className="h-4 w-4" /> });
  }
  const secondary: Item[] = isAdmin
    ? [
        { to: "/admin/usuarios", label: "Usuarios", icon: <Users className="h-4 w-4" /> },
        { to: "/admin/categorias", label: "Categorías", icon: <Layers className="h-4 w-4" /> },
        { to: "/admin/insumos", label: "Insumos", icon: <Package className="h-4 w-4" /> },
        { to: "/admin/provincias", label: "Provincias", icon: <Map className="h-4 w-4" /> },
        { to: "/admin/localidades", label: "Localidades", icon: <MapPin className="h-4 w-4" /> },
        { to: "/solicitudes", label: "Solicitudes", icon: <ClipboardList className="h-4 w-4" /> },
      ]
    : [];
  // Sin duplicados
  const seen = new Set<string>();
  const dedupe = (items: Item[]) => items.filter((i) => (seen.has(i.to) ? false : (seen.add(i.to), true)));
  return { primary: dedupe(primary), secondary: dedupe(secondary) };
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-brand-600 text-white shadow-sm" : "text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white",
  );

function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} className={cn("rounded-xl p-2 text-stone-600 transition hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800", className)} aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"} title={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <Menu as="div" className="relative">
      <MenuButton aria-label="Abrir menú de usuario" className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-stone-200/70 dark:hover:bg-stone-800">
        <Avatar name={fullName(user)} src={user.foto_url} size="sm" />
        <span className="hidden text-sm font-medium sm:block">{user.nombre}</span>
        <ChevronDown className="hidden h-4 w-4 text-stone-500 sm:block" />
      </MenuButton>
      <Transition as={Fragment} enter="transition ease-out duration-150" enterFrom="opacity-0 scale-95 -translate-y-1" enterTo="opacity-100 scale-100 translate-y-0" leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0 scale-95">
        <MenuItems anchor="bottom end" className="z-50 mt-2 w-60 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-card-hover focus:outline-none dark:border-stone-800 dark:bg-stone-900">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{fullName(user)}</p>
            <p className="truncate text-xs text-stone-500">{user.email}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">{user.roles.map((r) => <RoleBadge key={r} role={r} />)}</div>
          </div>
          <div className="my-1 h-px bg-stone-200 dark:bg-stone-800" />
          <MenuItem>
            <Link to="/perfil" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[focus]:bg-stone-100 dark:data-[focus]:bg-stone-800">
              <User className="h-4 w-4" /> Mi perfil
            </Link>
          </MenuItem>
          <MenuItem>
            <button
              type="button"
              onClick={() => {
                // React Router navega dentro de una transición: el logout va en la misma transición
                // para que no se renderice la ruta protegida sin usuario (redirigiría a /ingresar).
                startTransition(() => {
                  navigate("/");
                  logout();
                });
                toast.info("Sesión cerrada");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 data-[focus]:bg-red-50 dark:text-red-400 dark:data-[focus]:bg-red-950/40"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-stone-900 dark:text-white">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm"><Sprout className="h-4.5 w-4.5" /></span>
      AgroApp
    </Link>
  );
}

/** Layout público: header simple + contenido ancho. */
function PublicShell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-sand-100/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {publicItems.map((i) => (
              <NavLink key={i.to} to={i.to} className={({ isActive }) => cn("rounded-xl px-3 py-2 text-sm font-medium transition", isActive ? "text-brand-700 dark:text-brand-200" : "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white")}>
                {i.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/app" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">Ir a mi panel</Link>
                <UserMenu />
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/ingresar" className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200/70 dark:text-stone-200 dark:hover:bg-stone-800">Ingresar</Link>
                <Link to="/registro" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">Crear cuenta</Link>
              </div>
            )}
            <button type="button" className="rounded-xl p-2 md:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-stone-200/60 md:hidden dark:border-stone-800" aria-label="Principal móvil">
              <div className="flex flex-col gap-1 p-3">
                {publicItems.map((i) => <NavLink key={i.to} to={i.to} className={navLinkClass}>{i.icon}{i.label}</NavLink>)}
                <div className="my-1 h-px bg-stone-200 dark:bg-stone-800" />
                {user ? (
                  <NavLink to="/app" className={navLinkClass}><LayoutDashboard className="h-4 w-4" />Ir a mi panel</NavLink>
                ) : (
                  <>
                    <NavLink to="/ingresar" className={navLinkClass}><User className="h-4 w-4" />Ingresar</NavLink>
                    <NavLink to="/registro" className={navLinkClass}><Sprout className="h-4 w-4" />Crear cuenta</NavLink>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

/** Layout de la aplicación: sidebar por rol en desktop, barra inferior en móvil. */
function AppLayout() {
  const { primary, secondary } = useNavItems();
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [location.pathname]);

  const Sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <nav className="flex flex-col gap-1" aria-label="Aplicación">
        {primary.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end} className={navLinkClass}>{i.icon}{i.label}</NavLink>
        ))}
      </nav>
      {secondary.length > 0 && (
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Administración</p>
          <nav className="flex flex-col gap-1">
            {secondary.map((i) => <NavLink key={i.to} to={i.to} className={navLinkClass}>{i.icon}{i.label}</NavLink>)}
          </nav>
        </div>
      )}
      <div className="mt-auto flex flex-col gap-1">
        <NavLink to="/perfil" className={navLinkClass}><Settings2 className="h-4 w-4" />Mi perfil</NavLink>
        <NavLink to="/" className={navLinkClass}><Home className="h-4 w-4" />Sitio público</NavLink>
      </div>
    </div>
  );

  const bottomItems = primary.slice(0, 4);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-stone-200/70 bg-sand-50 lg:block dark:border-stone-800 dark:bg-stone-950">{Sidebar}</aside>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-stone-900/50" onClick={() => setDrawer(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="absolute inset-y-0 left-0 w-72 bg-sand-50 shadow-2xl dark:bg-stone-950">
              {Sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200/60 bg-sand-100/80 px-4 backdrop-blur-md sm:px-6 dark:border-stone-800 dark:bg-stone-950/80">
          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" className="rounded-xl p-2" aria-label="Abrir menú" onClick={() => setDrawer(true)}><MenuIcon className="h-6 w-6" /></button>
            <Brand />
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-1">
            <NotificacionesMenu />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">
          <div className="mx-auto max-w-7xl"><Outlet /></div>
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-40 grid border-t border-stone-200/70 bg-sand-50/95 backdrop-blur-md lg:hidden dark:border-stone-800 dark:bg-stone-950/95" style={{ gridTemplateColumns: `repeat(${bottomItems.length}, 1fr)` }} aria-label="Navegación inferior">
          {bottomItems.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium", isActive ? "text-brand-700 dark:text-brand-300" : "text-stone-500")}>
              {i.icon}
              <span className="truncate">{i.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200/60 py-8 text-center text-xs text-stone-500 dark:border-stone-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4">
        <p>AgroApp · Trabajo práctico de Desarrollo de Software 2025 · UTN FRRo</p>
        <p>Messina &amp; Costantini</p>
      </div>
    </footer>
  );
}

/** Transición suave entre páginas. */
export function AnimatedPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export { PublicShell, AppLayout };
