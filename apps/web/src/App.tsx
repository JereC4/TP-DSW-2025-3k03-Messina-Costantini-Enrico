import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CategoriasServicioPage from "./pages/CategoriasServicioPage";
import InsumosPage from "./pages/InsumosPage";
import ServiciosPage from "./pages/ServiciosPage";
import PreciosPage from "./pages/PreciosPage";

export default function App() {
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          backgroundColor: "#2d6a4f",
          color: "white",
        }}
      >
        <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
          <h2>AgroApp 🌾</h2>
        </NavLink>

        <nav style={{ display: "flex", gap: "16px" }}>
          <NavLink to="/categorias" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>
            Categorías
          </NavLink>
          <NavLink to="/insumos" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>
            Insumos
          </NavLink>
          <NavLink to="/auth" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>
            Login / Signup
          </NavLink>
          <NavLink to="/servicios" className="text-white font-semibold">
            Servicios
          </NavLink>
          <NavLink to="/precios" className="text-white font-semibold hover:underline">
            Precios
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/categorias" element={<CategoriasServicioPage />} />
        <Route path="/insumos" element={<InsumosPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="*" element={<div style={{ padding: 24 }}>404 — Página no encontrada</div>} />
        <Route path="/precios" element={<PreciosPage />} />
      </Routes>
    </div>
  );
}


