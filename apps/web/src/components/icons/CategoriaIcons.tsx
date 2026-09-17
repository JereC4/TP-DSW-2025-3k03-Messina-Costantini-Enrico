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
