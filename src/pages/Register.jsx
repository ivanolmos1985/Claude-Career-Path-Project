import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error al registrarse");
      setLoading(false);
    }
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
        <h2 style={{ margin: 0, textAlign: "center" }}>Crear Cuenta</h2>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15 }}>
              🎉 Tu cuenta fue creada correctamente.
              <br />
              Revisa tu correo para confirmar tu cuenta.
            </p>

            <Link to="/login">
              <button
                style={{
                  padding: 10,
                  width: "100%",
                  marginTop: 10,
                  border: "none",
                  background: "#007bff",
                  color: "white",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16
                }}
              >
                Ir a Iniciar Sesión
              </button>
            </Link>
          </div>
        ) : (
          <>
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

            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            />

            {error && (
              <div style={{ color: "red", fontSize: 14 }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "none",
                background: "#28a745",
                color: "white",
                cursor: "pointer",
                fontSize: 16
              }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div style={{ textAlign: "center", marginTop: 12 }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login">Iniciar sesión</Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

