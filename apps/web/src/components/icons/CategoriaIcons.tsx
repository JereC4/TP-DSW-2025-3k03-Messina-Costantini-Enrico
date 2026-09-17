import { Tractor } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function SiembraIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.5} {...props}>
      <path d="M4 16h5c1.1 0 2.1.6 2.6 1.6l.8 1.5c.4.8 1.2 1.3 2.1 1.3h.1c.9 0 1.7-.5 2.1-1.3l.8-1.5c.5-1 1.5-1.6 2.6-1.6h3" />
      <circle cx="12" cy="11.4" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.6" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15.8" r="0.55" fill="currentColor" stroke="none" />
      <path d="M12.9 7.1c0 1.1-.8 2.1-1.8 2.5-.7-.3-1.2-1-1.2-1.8 0-1.3 1.1-2.3 3-2.7Z" />
    </svg>
  );
}

export function CosechaIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.5} {...props}>
      <circle cx="6.4" cy="17.5" r="1.6" />
      <circle cx="14.2" cy="16.8" r="2.5" />
      <path d="M3.2 15.9v-4.6c0-1 .8-1.8 1.8-1.8h2.6l3.4 1h5.2l1.3 3.1v2.3" />
      <path d="M11 10.5l1.1-2.5h3.8" />
      <path d="M15.9 10.5l-1 4.2" />
      <path d="M17.7 13.6h2.2" />
      <path d="M17.2 15.9h3.1l1.5 1.3h-4.1" />
      <path d="M2.8 15.9H5" />
      <path d="M17 17l2.8 1.5h-2.6l-2.2-1.2" />
    </svg>
  );
}

export function PulverizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.3} {...props}>
      <path d="M2 6.5h20" />
      <path d="M6 6.5v2.2" />
      <path d="M12 6.5v2.2" />
      <path d="M18 6.5v2.2" />
      <path d="M5.4 8.8h1.2l-0.6 1Z" />
      <path d="M11.4 8.8h1.2l-0.6 1Z" />
      <path d="M17.4 8.8h1.2l-0.6 1Z" />
      <path d="M6 10.5v1.4" />
      <path d="M5.2 10.8 4.7 11.4" />
      <path d="M6.8 10.8 7.3 11.4" />
      <path d="M12 10.5v1.4" />
      <path d="M11.2 10.8 10.7 11.4" />
      <path d="M12.8 10.8 13.3 11.4" />
      <path d="M18 10.5v1.4" />
      <path d="M17.2 10.8 16.7 11.4" />
      <path d="M18.8 10.8 19.3 11.4" />
    </svg>
  );
}

export function FertilizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 5.5h14v2H5Z" />
      <path d="M6.8 7.5h10.4l-2.8 4.3H9.6Z" />
      <path d="M10.4 11.8v2.1" />
      <path d="M13.6 11.8v2.1" />
      <path d="M7 14h10" />
      <rect x="4" y="13.6" width="2" height="5.2" rx="0.9" />
      <rect x="18" y="13.6" width="2" height="5.2" rx="0.9" />
      <circle cx="9" cy="18.2" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18.2" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LaboreoIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.5} {...props}>
      <circle cx="12.2" cy="14.6" r="2.6" />
      <circle cx="18.3" cy="16.3" r="1.7" />
      <path d="M8.8 11.4H16c2.2 0 4 1.8 4 4v0.3" />
      <path d="M12 11.4V8.2h3.3l1.1 3.2" />
      <path d="M8.1 11.4H3.7" />
      <path d="M3.7 11.4v1" />
      <path d="M5.2 11.4v1" />
      <path d="M6.7 11.4v1" />
      <path d="M3.5 12.4c0 .8.6 1.2 1.2 1.6-.6.4-1.2.8-1.2 1.6" />
      <path d="M5 12.4c0 .8.6 1.2 1.2 1.6-.6.4-1.2.8-1.2 1.6" />
      <path d="M6.5 12.4c0 .8.6 1.2 1.2 1.6-.6.4-1.2.8-1.2 1.6" />
      <path d="M2.5 19.2h19" />
    </svg>
  );
}

export function ForrajeIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3.5c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5S3.5 16.7 3.5 12 7.3 3.5 12 3.5Z" />
      <path d="M12 6.2c3.2 0 5.8 2.6 5.8 5.8s-2.6 5.8-5.8 5.8S6.2 15.2 6.2 12 8.8 6.2 12 6.2Z" />
      <path d="M12 8.8c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.2-1.4-3.2-3.2S10.2 8.8 12 8.8Z" />
      <path d="M12 10.4c0.9 0 1.6 0.7 1.6 1.6s-0.7 1.6-1.6 1.6-1.6-0.7-1.6-1.6 0.7-1.6 1.6-1.6Z" />
    </svg>
  );
}

const CATEGORIA_ICONS: Record<string, ComponentType<IconProps>> = {
  Siembra: SiembraIcon,
  Cosecha: CosechaIcon,
  "Pulverización": PulverizacionIcon,
  "Fertilización": FertilizacionIcon,
  Laboreo: LaboreoIcon,
  "Confección de forraje": ForrajeIcon,
};

/** Ícono de línea para la categoría del servicio; recae en el tractor genérico si no hay match. */
export function CategoriaIcon({ categoria, ...props }: IconProps & { categoria?: string | null }) {
  const Icon = (categoria && CATEGORIA_ICONS[categoria]) || Tractor;
  return <Icon {...props} />;
}
