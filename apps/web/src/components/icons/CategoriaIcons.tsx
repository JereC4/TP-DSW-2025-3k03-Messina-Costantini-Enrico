import { Tractor } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function SiembraIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.45} {...props}>
      <path d="M13.8 5.1c-.2 2-1.3 3.5-3.2 4.1-1-.8-1.4-2-1-3.1.5-1.5 2.1-2.3 4.2-2.4Z" />
      <path d="M10.4 8.3 12.5 6" />
      <circle cx="12" cy="11.2" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15.7" r="0.55" fill="currentColor" stroke="none" />
      <path d="M3.5 19c2.6-2 5.2-2 7.7 0" />
      <path d="M12.8 19c2.5-2 5.1-2 7.7 0" />
      <path d="M10.7 18.3 12 20l1.3-1.7" />
    </svg>
  );
}

export function CosechaIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.35} {...props}>
      <path d="M10.4 9.7 7.3 8.4 5.1 7.1H2.9" />
      <path d="M2.9 7.1v1.2" />
      <path d="M8.4 6.7h6.8l-1.2 2.4H9.5Z" />
      <path d="M5.1 15.7c-.8 0-1.5-.4-1.9-1-.4-.7-.4-1.5 0-2.2l1.4-2.8c.4-.7 1.1-1.1 1.9-1.1h4" />
      <circle cx="6.2" cy="17.1" r="1.4" />
      <circle cx="12.6" cy="16.7" r="2.6" />
      <path d="M7.6 17.1h2.4" />
      <path d="M14.8 9.3h2.9l-.4 4.6H16a1.2 1.2 0 0 1-1.2-1.2Z" />
      <path d="M16 13.9v1.2l1.5 1.3" />
      <path d="M17.2 15.6h3.4l1.4 1.5h-4.1l-1.5-1.2" />
      <path d="M17.7 16.8h3.7" />
    </svg>
  );
}

export function PulverizacionIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.3} {...props}>
      <path d="M2 6.2h20" />
      <path d="M6 6.2v0.8" />
      <path d="M12 6.2v0.8" />
      <path d="M18 6.2v0.8" />
      <path d="M4.2 7h3.6v1.6l-1.8 1.4-1.8-1.4Z" />
      <path d="M10.2 7h3.6v1.6l-1.8 1.4-1.8-1.4Z" />
      <path d="M16.2 7h3.6v1.6l-1.8 1.4-1.8-1.4Z" />
      <path d="M6 10v4" />
      <path d="M6 10 3.5 13.5" />
      <path d="M6 10 8.5 13.5" />
      <path d="M12 10v4" />
      <path d="M12 10 9.5 13.5" />
      <path d="M12 10 14.5 13.5" />
      <path d="M18 10v4" />
      <path d="M18 10 15.5 13.5" />
      <path d="M18 10 20.5 13.5" />
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 8 21 12" {...base} strokeWidth={1.4} {...props}>
      <circle cx="13" cy="16" r="2.6" />
      <circle cx="19.2" cy="17.05" r="1.55" />
      <path d="M10.5 13.6h6.2" />
      <path d="M12.2 13.6V9h3.3l1.4 4.6" />
      <path d="M13.2 10h1.8" />
      <path d="M16.9 13.6h2.6c.7 0 1.2.4 1.4 1l.3.9" />
      <path d="M17.3 15.4h.7" />
      <path d="M20.9 14.6h.7v1.1" />
      <path d="M10.5 14.5 8.2 15.4" />
      <path d="M3.1 15.4h5.1" />
      <path d="M4 15.4v.9" />
      <path d="M5.7 15.4v.9" />
      <path d="M7.4 15.4v.9" />
      <g strokeWidth={0.9}>
        <path d="M4 16.3 3.6 18.4" />
        <path d="M5.7 16.3 5.4 18.6" />
        <path d="M7.4 16.3 7.2 18.4" />
      </g>
    </svg>
  );
}

export function ForrajeIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...base} strokeWidth={1.45} {...props}>
      <path d="M9 6.5h6.2c2.2 0 4 1.8 4 4v3c0 2.2-1.8 4-4 4H9" />
      <circle cx="9" cy="12" r="5.5" />
      <path d="M9 8.5c2 0 3.5 1.5 3.5 3.5S11 15.5 9 15.5 5.5 14 5.5 12 7 8.5 9 8.5Z" />
      <path d="M9 10.3c1 0 1.7.7 1.7 1.7S10 13.7 9 13.7 7.3 13 7.3 12 8 10.3 9 10.3Z" />
      <path d="M14.7 9.3h2.6" />
      <path d="M15.2 12h3" />
      <path d="M14.7 14.7h2.6" />
      <path d="M6.5 8.2 5.6 7.4" />
      <path d="M5.3 13.8 4.3 14.3" />
      <path d="M11.3 16.3 12 17.1" />
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
