import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

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
          <NavLink
            to="/auth"
            style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
          >
            Login / Signup
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<div style={{ padding: 24 }}>404 — Página no encontrada</div>} />
      </Routes>
    </div>
  );
}
