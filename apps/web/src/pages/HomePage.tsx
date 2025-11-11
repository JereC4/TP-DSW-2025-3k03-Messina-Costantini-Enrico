import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1602524819190-7e1e6eb9342a?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          padding: "48px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#2d6a4f" }}>
          AgroApp 🌾
        </h1>
        <p style={{ marginBottom: "2rem", color: "#333" }}> 
          Un sistema ágil para conectar productores y prestamistas.
        </p>

        <Link
          to="/auth"
          style={{
            backgroundColor: "#2d6a4f",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Iniciar sesión / Registrarse
        </Link>
      </div>
    </div>
  );
}
