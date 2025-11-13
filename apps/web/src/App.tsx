import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CategoriasServicioPage from "./pages/CategoriasServicioPage";
import InsumosPage from "./pages/InsumosPage";
import CamposPage from "./pages/CamposPage";

export default function App() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-900">
      
      {/* HEADER */}
      <header className="w-full bg-green-800 text-white px-8 py-3 flex justify-between items-center shadow-lg">
  <NavLink
    to="/"
    className="text-white font-bold text-xl hover:opacity-90 transition"
  >
    AgroApp 🌾
  </NavLink>

  <nav className="flex gap-6 text-white font-medium">
    <NavLink
      to="/categorias"
      className={({ isActive }) =>
        `relative transition pb-1 hover:text-green-200 ${
          isActive ? "text-green-200 after:w-full" : "after:w-0"
        } 
        after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-green-300 after:transition-all after:duration-300`
      }
    >
      Categorías
    </NavLink>

    <NavLink
      to="/insumos"
      className={({ isActive }) =>
        `relative transition pb-1 hover:text-green-200 ${
          isActive ? "text-green-200 after:w-full" : "after:w-0"
        } 
        after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-green-300 after:transition-all after:duration-300`
      }
    >
      Insumos
    </NavLink>

    <NavLink
      to="/campos"
      className={({ isActive }) =>
        `relative transition pb-1 hover:text-green-200 ${
          isActive ? "text-green-200 after:w-full" : "after:w-0"
        } 
        after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-green-300 after:transition-all after:duration-300`
      }
    >
      Campos
    </NavLink>

    <NavLink
      to="/auth"
      className="bg-white text-green-800 font-semibold px-4 py-1.5 rounded-md hover:bg-green-100 transition shadow-sm"
    >
      Login / Signup
    </NavLink>
  </nav>
</header>

      {/* CONTENIDO DE LAS PÁGINAS */}
      <div className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/categorias" element={<CategoriasServicioPage />} />
          <Route path="/insumos" element={<InsumosPage />} />
          <Route path="/campos" element={<CamposPage />} />
          <Route path="*" element={<div className="p-6 text-white">404 — Página no encontrada</div>} />
        </Routes>
      </div>
    </div>
  );
}
