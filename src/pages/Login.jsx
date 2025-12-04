import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../components/ui";

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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "var(--spacing-lg)",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          noPadding: true,
        }}
      >
        <form
          onSubmit={submit}
          style={{
            padding: "var(--spacing-xxl)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "var(--spacing-md)" }}>
            <img
              src="/arkus-logo.webp"
              alt="Arkusnexus"
              style={{
                height: 50,
                marginBottom: "var(--spacing-lg)",
                objectFit: "contain",
              }}
            />
            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--color-neutral-900)",
              }}
            >
              Career Path System
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "var(--color-neutral-600)",
              }}
            >
              Sign in to access your account
            </p>
          </div>

          {/* Email Input */}
          <Input
            type="email"
            label="Username"
            placeholder="usuario@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: "var(--color-error-500)",
                fontSize: 13,
                fontWeight: 500,
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "var(--color-error-50)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-error-200)",
              }}
            >
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            loading={loading}
            fullWidth
          >
            {loading ? "Ingresando..." : "→ Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
