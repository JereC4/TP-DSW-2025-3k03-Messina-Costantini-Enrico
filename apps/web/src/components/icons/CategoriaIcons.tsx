import { Tractor } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function SiembraIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <path d="M8.2 4.8h6.1v3.2h-1.6c-.7 0-1.4.2-2 .6l-2.9 2.3a1.2 1.2 0 0 1-1.8-1.5l1.3-3a3 3 0 0 1 2.9-1.6Z" />
      <circle cx="10.1" cy="13" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="11.9" cy="15" r="0.55" fill="currentColor" stroke="none" />
      <path d="M4.7 18c2-1.6 4.1-1.6 6.1 0" />
      <path d="M8.9 19.7c2-2 4.2-2 6.2 0" />
      <path d="M13.3 18c2-1.6 4-1.6 6 0" />
      <path d="M15.4 19.7c1.6-1.8 3.1-1.8 4.6 0" />
    </svg>
  );
}

export function CosechaIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <circle cx="6.2" cy="16.7" r="1.8" />
      <path d="M4.6 14.9v-1.5a1.4 1.4 0 0 1 1.4-1.4h5.1l1.3-3.4h4.2" />
      <path d="M12.4 8.6h4.1l-1.1 4.3H13Z" />
      <path d="M11.1 12h4.2v2.2" />
      <path d="M9.3 18.5h8.1" />
      <path d="M9.2 14.5h6.8a1.8 1.8 0 0 1 1.7 1.2l.6 1.6H9.8a1.6 1.6 0 0 1-1.4-.9l-.4-.8a.7.7 0 0 1 .6-1.1Z" />
      <path d="M10.7 15.1l.7 2.2" />
      <path d="M12.6 15.1l.7 2.2" />
      <path d="M14.5 15.1l.7 2.2" />
      <path d="M16.4 15.1l.7 2.2" />
      <path d="M19.1 18.7v-7.1" />
      <path d="M19.1 10.4c.8.1 1.4.8 1.4 1.6-.8 0-1.4-.8-1.4-1.6Z" />
      <path d="M19.1 12.8c-1 0-1.8-.8-1.8-1.8 1 0 1.8.8 1.8 1.8Z" />
      <path d="M19.1 14.3c1 0 1.8.8 1.8 1.8-1 0-1.8-.8-1.8-1.8Z" />
      <path d="M19.1 16c-1 0-1.8.8-1.8 1.8 1 0 1.8-.8 1.8-1.8Z" />
    </svg>
  );
}

export function PulverizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <path d="M9 8.5h6l.7 3.5v5.1H8.3V12Z" />
      <path d="M10.1 8.5V6.8" />
      <path d="M13.9 8.5V6.8" />
      <rect x="7.1" y="12.5" width="1.7" height="5.1" rx="0.8" />
      <rect x="15.2" y="12.5" width="1.7" height="5.1" rx="0.8" />
      <path d="M7.1 10.1 2.7 11.1" />
      <path d="M16.9 10.1 21.3 11.1" />
      <path d="M2.7 11.1h4.4" />
      <path d="M16.9 11.1h4.4" />
      <path d="M5.1 10.7v1.1" />
      <path d="M18.9 10.7v1.1" />
      <circle cx="3.5" cy="14.4" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="5.1" cy="14.1" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="6.4" cy="14.8" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="2.9" cy="16" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="4.6" cy="16.3" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="6.1" cy="16" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="17.9" cy="14.4" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="19.4" cy="14.1" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="20.8" cy="14.8" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="17.4" cy="16" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="19.1" cy="16.3" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="20.6" cy="16" r="0.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FertilizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <rect x="5.5" y="6.3" width="13" height="2.4" rx="1.1" />
      <path d="M7 8.7h10l-2.4 4.4H9.4Z" />
      <path d="M9.4 13.1 8 15" />
      <path d="M14.6 13.1 16 15" />
      <path d="M8 15h8" />
      <path d="M10 15l1.4 1.3h1.2L14 15" />
      <rect x="6" y="14.4" width="1.9" height="5.2" rx="0.8" />
      <rect x="16.1" y="14.4" width="1.9" height="5.2" rx="0.8" />
      <circle cx="10" cy="4.6" r="0.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="3.9" r="0.3" fill="currentColor" stroke="none" />
      <circle cx="14" cy="4.6" r="0.3" fill="currentColor" stroke="none" />
      <circle cx="11" cy="5.3" r="0.3" fill="currentColor" stroke="none" />
      <circle cx="13" cy="5.3" r="0.3" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="17.3" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="17" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="13.7" cy="17" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="17.3" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="8.1" cy="19" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="10.1" cy="19.4" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19.1" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="13.9" cy="19.4" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="15.9" cy="19" r="0.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LaboreoIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <circle cx="10.8" cy="15.8" r="3" />
      <circle cx="18.2" cy="17.1" r="1.8" />
      <path d="M12.4 8.2h3.7l1 4.6h2.1a2 2 0 0 1 2 2v1.1" />
      <path d="M10.2 9.7a2.4 2.4 0 0 1 2.2-1.5h1.5" />
      <path d="M12.3 8.2v1.5" />
      <path d="M17.1 12.8v3.1h1.5" />
      <path d="M8.1 13.3H4" />
      <path d="M5.3 13.4v1" />
      <path d="M7 13.4v1" />
      <path d="M4.2 14.4c0 .9.6 1.3 1.1 1.7-.5.4-1.1.8-1.1 1.7" />
      <path d="M5.9 14.4c0 .9.6 1.3 1.1 1.7-.5.4-1.1.8-1.1 1.7" />
      <path d="M7.6 14.4c0 .9.6 1.3 1.1 1.7-.5.4-1.1.8-1.1 1.7" />
      <path d="M2.9 19.2c.7-.5 1.3-.8 2-.8s1.3.3 2 .8c.7-.5 1.3-.8 2-.8s1.3.3 2 .8c.7-.5 1.3-.8 2-.8s1.3.3 2 .8c.7-.5 1.3-.8 2-.8s1.3.3 2 .8c.7-.5 1.3-.8 2-.8s1.3.3 2 .8" />
    </svg>
  );
}

export function ForrajeIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...base} {...props}>
      <path d="M3.2 18.9h17.6" />
      <path d="M4.8 18.9l-1-1.8" />
      <path d="M5.8 18.9l-.8-2.4" />
      <path d="M18.2 18.9l1-1.8" />
      <path d="M19.3 18.9l.9-2.2" />
      <path d="M8.5 6.8h7a2.8 2.8 0 0 1 2.8 2.8v6.5a2.8 2.8 0 0 1-2.8 2.8h-7Z" />
      <path d="M8.5 6.8a2.8 2.8 0 0 0-2.8 2.8v6.5a2.8 2.8 0 0 0 2.8 2.8" />
      <path d="M8.6 12.9c0-2.2 1.4-4 3.2-4s3.2 1.8 3.2 4-1.4 4-3.2 4-3.2-1.8-3.2-4Z" />
      <path d="M11.8 10.1c.8.4 1.3 1.4 1.3 2.8s-.5 2.4-1.3 2.8" />
      <path d="M10.8 11.1c.5.3.8.9.8 1.8s-.3 1.5-.8 1.8" />
      <path d="M15.3 9.7h1.6" />
      <path d="M15.3 12.9h1.6" />
      <path d="M15.3 16.1h1.6" />
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
