import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/teams");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a2540 0%, #1a3a52 50%, #0f2a3f 100%)",
        padding: 20
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "white",
          padding: 40,
          borderRadius: 14,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 400,
          gap: 16,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <img
            src="/arkus-logo.webp"
            alt="Arkusnexus"
            style={{ height: 50, marginBottom: 16 }}
          />
          <h2 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: 700, color: "#003366" }}>
            Career Path System
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            Sign in to access your account
          </p>
        </div>

        <label>Username</label>
        <input
          type="email"
          placeholder="usuario@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#0066ff",
            color: "white",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
            transition: "background 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.background = "#0052cc"}
          onMouseLeave={(e) => e.target.style.background = "#0066ff"}
        >
          {loading ? "Ingresando..." : "→ Sign In"}
        </button>
      </form>
    </div>
  );
}
