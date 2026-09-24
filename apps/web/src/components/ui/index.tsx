import { forwardRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Loader2, Star } from "lucide-react";
import { cn } from "../../lib/cn";
import type { SolicitudEstado } from "../../api/types";
import { ESTADO_LABELS } from "../../api/types";
import { Lightbox } from "./Lightbox";

/* ───────────────────────── Botones ───────────────────────── */

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 disabled:hover:bg-brand-600",
  secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-100 dark:hover:bg-brand-900/60",
  outline: "border border-stone-300 bg-white text-stone-800 hover:border-brand-400 hover:text-brand-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-brand-500",
  ghost: "text-stone-700 hover:bg-stone-200/70 dark:text-stone-200 dark:hover:bg-stone-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};
const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean; icon?: ReactNode };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = "primary", size = "md", loading, icon, className, children, disabled, ...props }, ref) {
  return (
    <button ref={ref} {...props} disabled={disabled || loading} className={cn(base, variantClass[variant], sizeClass[size], className)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

export function LinkButton({ to, variant = "primary", size = "md", className, icon, children }: { to: string; variant?: Variant; size?: Size; className?: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <Link to={to} className={cn(base, variantClass[variant], sizeClass[size], className)}>
      {icon}
      {children}
    </Link>
  );
}

/* ───────────────────────── Inputs ───────────────────────── */

const control =
  "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 shadow-sm transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 disabled:bg-stone-100 disabled:opacity-70 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500 dark:disabled:bg-stone-800";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} {...props} className={cn(control, className)} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} {...props} className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2378716c%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[position:right_0.75rem_center] bg-no-repeat pr-9", className)}>
      {children}
    </select>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} {...props} className={cn(control, "min-h-[96px] resize-y", className)} />;
});

export function Field({ label, hint, error, children, className, required }: { label: string; hint?: string; error?: string | null; children: ReactNode; className?: string; required?: boolean }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-red-600 dark:text-red-400">{error}</span> : hint ? <span className="mt-1.5 block text-xs text-stone-500">{hint}</span> : null}
    </label>
  );
}

/* ───────────────────────── Superficies ───────────────────────── */

export function Card({ children, className, title, subtitle, actions, padded = true }: { children: ReactNode; className?: string; title?: string; subtitle?: string; actions?: ReactNode; padded?: boolean }) {
  return (
    <section className={cn("surface", padded && "p-5 sm:p-6", className)}>
      {(title || actions) && (
        <header className={cn("mb-4 flex flex-wrap items-start justify-between gap-3", !padded && "px-5 pt-5")}>
          <div>
            {title && <h2 className="text-lg font-bold text-stone-900 dark:text-white">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">{eyebrow}</p>}
        <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-stone-500 dark:text-stone-400 sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Alert({ kind = "info", children, className }: { kind?: "info" | "error" | "success" | "warning"; children: ReactNode; className?: string }) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100",
    error: "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
    success: "border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900/60 dark:bg-brand-950/40 dark:text-brand-100",
    warning: "border-harvest-300 bg-harvest-100 text-earth-800 dark:border-harvest-700/60 dark:bg-harvest-700/20 dark:text-harvest-100",
  };
  return (
    <div role="alert" className={cn("rounded-xl border px-4 py-3 text-sm", styles[kind], className)}>
      {children}
    </div>
  );
}

/* ───────────────────────── Estados ───────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full", className)} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="surface space-y-3 p-5">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="mt-4 h-6 w-1/2" />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-brand-600", className)} aria-label="Cargando" />;
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 px-6 py-12 text-center dark:border-stone-700">
      {icon && <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">{icon}</div>}
      <p className="font-semibold text-stone-800 dark:text-stone-100">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ───────────────────────── Badges ───────────────────────── */

const estadoStyles: Record<SolicitudEstado, string> = {
  pendiente: "bg-harvest-100 text-harvest-700 ring-harvest-300 dark:bg-harvest-700/20 dark:text-harvest-300 dark:ring-harvest-700/50",
  aceptada: "bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-800",
  completada: "bg-brand-100 text-brand-800 ring-brand-300 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-800",
  rechazada: "bg-red-100 text-red-800 ring-red-300 dark:bg-red-900/40 dark:text-red-200 dark:ring-red-800",
  cancelada: "bg-stone-200 text-stone-700 ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700",
};

export function EstadoBadge({ estado, className }: { estado: SolicitudEstado; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", estadoStyles[estado], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {ESTADO_LABELS[estado]}
    </span>
  );
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "brand" | "amber" | "purple" | "sky"; className?: string }) {
  const tones = {
    neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    brand: "bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-100",
    amber: "bg-harvest-100 text-harvest-700 dark:bg-harvest-700/20 dark:text-harvest-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
    sky: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

/**
 * Insignia de contratista verificado por la administración. No se muestra nada
 * cuando no está verificado: la ausencia no es una acusación.
 */
export function VerificadoBadge({ verificado, className, size = "md" }: { verificado?: boolean; className?: string; size?: "sm" | "md" }) {
  if (!verificado) return null;
  return (
    <span
      title="Identidad y datos fiscales verificados por AgroApp"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-sky-100 font-semibold text-sky-800 ring-1 ring-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-800",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        className,
      )}
    >
      <BadgeCheck className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      Verificado
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const tone = role === "ADMIN" ? "purple" : role === "PRODUCTOR" ? "brand" : "sky";
  const label = role === "ADMIN" ? "Admin" : role === "PRODUCTOR" ? "Productor" : "Contratista";
  return <Badge tone={tone}>{label}</Badge>;
}

/* ───────────────────────── Estrellas ───────────────────────── */

export function Stars({ value, count, size = "sm", onChange, className }: { value: number | null; count?: number; size?: "sm" | "md" | "lg"; onChange?: (v: number) => void; className?: string }) {
  const px = size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  const v = value ?? 0;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label={value ? `${value} de 5` : "Sin valoraciones"}>
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = v >= n - 0.25;
          const el = <Star key={n} className={cn(px, filled ? "fill-harvest-500 text-harvest-500" : "text-stone-300 dark:text-stone-600", onChange && "cursor-pointer transition hover:scale-110")} />;
          return onChange ? (
            <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} estrellas`} className="rounded-sm">
              {el}
            </button>
          ) : (
            el
          );
        })}
      </span>
      {value !== null && value !== undefined && <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-stone-500">({count})</span>}
    </span>
  );
}

/* ───────────────────────── Datos ───────────────────────── */

export function Stat({ label, value, hint, icon, tone = "brand" }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode; tone?: "brand" | "amber" | "sky" | "neutral" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
    amber: "bg-harvest-100 text-harvest-700 dark:bg-harvest-700/20 dark:text-harvest-300",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
    neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="surface flex items-center gap-4 p-4">
      {icon && <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}>{icon}</div>}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
        <p className="truncate text-2xl font-extrabold text-stone-900 dark:text-white">{value}</p>
        {hint && <p className="text-xs text-stone-500">{hint}</p>}
      </div>
    </motion.div>
  );
}

export function DetailItem({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-stone-900 dark:text-stone-100">{children}</dd>
    </div>
  );
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("scrollbar-thin -mx-5 overflow-x-auto sm:-mx-6", className)}>
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("whitespace-nowrap border-b border-stone-200 px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 first:pl-5 sm:first:pl-6 dark:border-stone-800", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-b border-stone-100 px-5 py-3 align-middle text-stone-800 first:pl-5 sm:first:pl-6 dark:border-stone-800/70 dark:text-stone-200", className)}>{children}</td>;
}

export function Pagination({ page, totalPages, onChange, total }: { page: number; totalPages: number; onChange: (p: number) => void; total?: number }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-6 flex items-center justify-between gap-3 text-sm" aria-label="Paginación">
      <span className="text-stone-500">{total !== undefined ? `${total} resultados · ` : ""}Página {page} de {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onChange(page - 1)} disabled={page <= 1}>Anterior</Button>
        <Button variant="outline" size="sm" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>Siguiente</Button>
      </div>
    </nav>
  );
}

export function Avatar({ name, src, className, size = "md", zoomable = false }: { name: string; src?: string | null; className?: string; size?: "sm" | "md" | "lg"; zoomable?: boolean }) {
  const sz = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  const [open, setOpen] = useState(false);
  if (src) {
    if (!zoomable) return <img src={src} alt={name} className={cn("shrink-0 rounded-full object-cover", sz, className)} />;
    return (
      <>
        <button type="button" onClick={() => setOpen(true)} className={cn("shrink-0 cursor-zoom-in rounded-full", sz, className)} aria-label={`Ver foto de ${name} en grande`}>
          <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
        </button>
        <Lightbox src={src} alt={name} open={open} onClose={() => setOpen(false)} />
      </>
    );
  }
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  return <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-bold text-white", sz, className)}>{initials || "?"}</span>;
}

export { BarChart, type Punto } from "./Charts";
