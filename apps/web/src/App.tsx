import { NavLink, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuthUser } from "./api/auth";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CategoriasServicioPage from "./pages/CategoriasServicioPage";
import InsumosPage from "./pages/InsumosPage";
import ServiciosPage from "./pages/ServiciosPage";
import PreciosPage from "./pages/PreciosPage";
import CamposPage from "./pages/CamposPage";
import LocalidadesPage from "./pages/LocalidadesPage";
import ProvinciasPage from "./pages/ProvinciasPage";
import SolicitudesPage from "./pages/SolicitudesPage";
import ProfilePage from "./pages/ProfilePage";


export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Leer usuario logueado desde localStorage al montar
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setAuthUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("auth:user");
      }
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-900 text-white">
      {/* HEADER */}
      <header className="w-full bg-green-800 px-8 py-3 flex justify-between items-center shadow-lg">
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
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Categorías
          </NavLink>

          <NavLink
            to="/insumos"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Insumos
          </NavLink>

          <NavLink
            to="/servicios"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Servicios
          </NavLink>

          <NavLink
            to="/solicitudes"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Solicitudes
          </NavLink>

          <NavLink
            to="/precios"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Precios
          </NavLink>

          <NavLink
            to="/campos"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Campos
          </NavLink>

          <NavLink
            to="/provincias"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Provincias
          </NavLink>

          <NavLink
            to="/localidades"
            className={({ isActive }) =>
              `relative transition pb-1 hover:text-green-200 ${
                isActive ? "text-green-200 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                after:bg-green-300 after:transition-all after:duration-300`
            }
          >
            Localidades
          </NavLink>

          {/* Botón login / perfil según estado */}
          {authUser ? (
            <NavLink
              to="/perfil"
              className="bg-white text-green-800 font-semibold px-4 py-1.5 rounded-md hover:bg-green-100 transition shadow-sm"
            >
              Mi Perfil
            </NavLink>
          ) : (
            <NavLink
              to="/auth"
              className="bg-white text-green-800 font-semibold px-4 py-1.5 rounded-md hover:bg-green-100 transition shadow-sm"
            >
              Login / Signup
            </NavLink>
          )}
        </nav>
      </header>

      {/* CONTENIDO */}
      <div className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth"
            element={<AuthPage onAuthChange={setAuthUser} />}
          />
          <Route path="/categorias" element={<CategoriasServicioPage />} />
          <Route path="/insumos" element={<InsumosPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/precios" element={<PreciosPage />} />
          <Route path="/campos" element={<CamposPage />} />
          <Route path="/provincias" element={<ProvinciasPage />} />
          <Route path="/localidades" element={<LocalidadesPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          <Route
            path="*"
            element={
              <div className="p-6 text-white">404 – Página no encontrada</div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
