import cosecha from "../assets/servicios/cosecha.jpg";
import fertilizacion from "../assets/servicios/fertilizacion.jpg";
import forraje from "../assets/servicios/forraje.jpg";
import laboreo from "../assets/servicios/laboreo.jpg";
import pulverizacion from "../assets/servicios/pulverizacion.jpg";
import siembra from "../assets/servicios/siembra.jpg";

const CATEGORIA_FOTOS: Record<string, string> = {
  Siembra: siembra,
  Cosecha: cosecha,
  "Pulverización": pulverizacion,
  "Fertilización": fertilizacion,
  Laboreo: laboreo,
  "Confección de forraje": forraje,
};

/** Foto de fondo para la tarjeta de servicio según su categoría; recae en la de cosecha si no hay match. */
export function categoriaFoto(categoria?: string | null): string {
  return (categoria && CATEGORIA_FOTOS[categoria]) || cosecha;
}
