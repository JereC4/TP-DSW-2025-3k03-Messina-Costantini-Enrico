import { useEffect, useState } from 'react';
import { getProvincias } from '../api/provincias';
import {
  createLocalidad, deleteLocalidad, getLocalidades, updateLocalidad,
  type Localidad
} from '../api/localidades';

export default function LocalidadesPage() {
  const [items, setItems] = useState<Localidad[]>([]);
  const [provincias, setProvincias] = useState<{ id_provincia: number; nombre: string }[]>([]);
  const [idProvincia, setIdProvincia] = useState<number | ''>('');
  const [nombre, setNombre] = useState('');
  const [cp, setCp] = useState('');

  const load = async () => {
    const [prov, locs] = await Promise.all([getProvincias(), getLocalidades(undefined, idProvincia || undefined)]);
    setProvincias(prov.map(p => ({ id_provincia: Number(p.id_provincia), nombre: p.nombre })));
    setItems(locs);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [idProvincia]);

  const handleCreate = async () => {
    if (!idProvincia || !nombre.trim()) return;
    await createLocalidad({ id_provincia: idProvincia, nombre: nombre.trim(), codigo_postal: cp || undefined });
    setNombre(''); setCp('');
    await load();
  };

  return (
    <div style={{ maxWidth: 720, margin: '24px auto' }}>
      <h1>Localidades</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={idProvincia} onChange={(e) => setIdProvincia(Number(e.target.value) || '')}>
          <option value="">(todas las provincias)</option>
          {provincias.map(p => (
            <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
          ))}
        </select>

        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Código Postal" value={cp} onChange={(e) => setCp(e.target.value)} />
        <button onClick={handleCreate}>Crear</button>
      </div>

      <ul style={{ display: 'grid', gap: 8 }}>
        {items.map(l => (
          <li key={l.id_localidad}>
            <strong>{l.nombre}</strong> — Prov #{l.id_provincia} {l.codigo_postal ? `(CP: ${l.codigo_postal})` : ''}
            <button style={{ marginLeft: 8 }} onClick={async () => { await deleteLocalidad(l.id_localidad); await load(); }}>
              borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
