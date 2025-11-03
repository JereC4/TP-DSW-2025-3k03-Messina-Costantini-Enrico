import { useEffect, useState } from 'react';
import { getProvincias, createProvincia, deleteProvincia } from '../api/provincias';

export default function ProvinciasPage() {
  const [items, setItems] = useState<{ id_provincia: number; nombre: string }[]>([]);
  const [nombre, setNombre] = useState('');

  const load = async () => setItems(await getProvincias());

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Provincias</h1>
      <form
        onSubmit={async e => {
          e.preventDefault();
          if (!nombre.trim()) return;
          await createProvincia(nombre.trim());
          setNombre('');
          await load();
        }}
      >
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
        <button type="submit">Crear</button>
      </form>

      <ul>
        {items.map(p => (
          <li key={p.id_provincia}>
            {p.nombre}{' '}
            <button
              onClick={async () => {
                await deleteProvincia(p.id_provincia);
                await load();
              }}
            >
              borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
