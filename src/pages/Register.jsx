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
            Delivery Manager Dashboard
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            Create your account
          </p>
        </div>

        {success ? (
          <div style={{
            textAlign: "center",
            background: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)",
            border: "2px solid #10b981",
            borderRadius: 12,
            padding: 32,
            margin: "0 -40px -40px -40px"
          }}>
            <div style={{
              fontSize: 56,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "50%",
              width: 80,
              height: 80,
              margin: "0 auto 16px auto"
            }}>
              ✅
            </div>

            <p style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#047857",
              margin: "0 0 8px 0"
            }}>
              ¡Cuenta creada exitosamente!
            </p>

            <p style={{
              fontSize: 14,
              color: "#059669",
              margin: "0 0 24px 0",
              lineHeight: 1.6
            }}>
              Se envió un correo de confirmación a tu bandeja de entrada.
              <br />
              <strong>Verifica tu email para confirmar la cuenta</strong> y poder acceder al sistema.
            </p>

            <div style={{
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              fontSize: 13,
              color: "#047857",
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}>
              💡 <strong>Tip:</strong> Si no ves el email, revisa la carpeta de Spam
            </div>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: 14,
                  width: "100%",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                }}
              >
                ✨ Ir a Iniciar Sesión
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
                background: "#6366F1",
                color: "white",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                transition: "background 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#4F46E5"}
              onMouseLeave={(e) => e.target.style.background = "#6366F1"}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div style={{ textAlign: "center", marginTop: 12, fontSize: 14 }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" style={{ color: "#6366F1", textDecoration: "none", fontWeight: 600 }}>
                Iniciar sesión
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

