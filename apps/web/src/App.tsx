import { Link, NavLink, Route, Routes } from 'react-router-dom'
import ProvinciasPage from './pages/ProvinciasPage'
import LocalidadesPage from './pages/LocalidadesPage'
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Link to="/" style={{ fontWeight: 700 }}>Agro App</Link>
        <nav style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/provincias">Provincias</NavLink>
          <NavLink to="/localidades">Localidades</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<div>Bienvenido 👋 Elegí una sección.</div>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/provincias" element={<ProvinciasPage />} />
        <Route path="/localidades" element={<LocalidadesPage />} />
        <Route path="*" element={<div>404 — Página no encontrada</div>} />
      </Routes>
    </div>
  )
}
