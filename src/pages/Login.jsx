import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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
        background: "#0a2540",
        padding: 20
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 14,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 360,
          gap: 12
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>Iniciar sesión</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="correo@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="********"
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
            background: "#007bff",
            color: "white",
            cursor: "pointer",
            fontSize: 16
          }}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register">Crear una cuenta</Link>
        </div>
      </form>
    </div>
  );
}
