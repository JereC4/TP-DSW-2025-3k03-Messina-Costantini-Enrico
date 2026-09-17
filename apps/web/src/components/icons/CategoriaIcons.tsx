import { Tractor } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function SiembraIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <path d="M4 16h5c1.1 0 2.1.6 2.6 1.6l.8 1.5c.4.8 1.2 1.3 2.1 1.3h.1c.9 0 1.7-.5 2.1-1.3l.8-1.5c.5-1 1.5-1.6 2.6-1.6h3" />
      <circle cx="12" cy="12.8" r="0.7" fill="currentColor" stroke="none" />
      <path d="M12.9 7.3c0 1.2-.8 2.2-1.8 2.7-.7-.3-1.2-1.1-1.2-2 0-1.4 1.1-2.5 3-2.9Z" />
    </svg>
  );
}

export function CosechaIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="14" cy="17.5" r="2.4" />
      <path d="M4.6 16.5H3.8a1.8 1.8 0 0 1-1.8-1.8v-4.1c0-.8.7-1.5 1.5-1.5h2.8l4.4 1.3" />
      <path d="M10.7 10.4h4.5l1.5 3.6v2.9" />
      <path d="M14.1 10.4l0.8-2.4h3.3" />
      <path d="M16.9 13.7h2.5" />
      <path d="M16.8 16.5h3.5l1.7 1.5H17" />
      <path d="M18.4 10.4l-1.2 4.8" />
    </svg>
  );
}

export function PulverizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <path d="M2.5 6.5h19" />
      <path d="M6 6.5v2.5" />
      <path d="M12 6.5v2.5" />
      <path d="M18 6.5V9" />
      <path d="M5.2 9h1.6l-0.8 1.2Z" />
      <path d="M11.2 9h1.6l-0.8 1.2Z" />
      <path d="M17.2 9h1.6l-0.8 1.2Z" />
      <path d="M6 11.4v1.8" />
      <path d="M4.7 11.8 3.6 13" />
      <path d="M7.3 11.8 8.4 13" />
      <path d="M12 11.4v1.8" />
      <path d="M10.7 11.8 9.6 13" />
      <path d="M13.3 11.8 14.4 13" />
      <path d="M18 11.4v1.8" />
      <path d="M16.7 11.8 15.6 13" />
      <path d="M19.3 11.8 20.4 13" />
    </svg>
  );
}

export function FertilizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
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
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <circle cx="12" cy="14.5" r="2.5" />
      <circle cx="18.5" cy="16.2" r="1.7" />
      <path d="M9 11h7.2c2.1 0 3.8 1.7 3.8 3.8v0.6" />
      <path d="M12 11V7.8h3.4l1.3 3.2" />
      <path d="M8.2 11H3.2" />
      <path d="M4 11v1.1" />
      <path d="M5.6 11v1.1" />
      <path d="M7.2 11v1.1" />
      <path d="M3.3 12.1c0 0.9 0.7 1.3 1.4 1.8-0.7 0.5-1.4 0.9-1.4 1.8" />
      <path d="M4.9 12.1c0 0.9 0.7 1.3 1.4 1.8-0.7 0.5-1.4 0.9-1.4 1.8" />
      <path d="M6.5 12.1c0 0.9 0.7 1.3 1.4 1.8-0.7 0.5-1.4 0.9-1.4 1.8" />
      <path d="M2.2 20h19.6" />
    </svg>
  );
}

export function ForrajeIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
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
