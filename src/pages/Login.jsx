import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Stack, Card, Alert, Spinner, colors, spacing, typography } from "../components/ui";

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
        background: `linear-gradient(135deg, ${colors.gray[900]} 0%, ${colors.gray[800]} 50%, ${colors.gray[900]} 100%)`,
        padding: spacing.base,
      }}
    >
      <Card
        padding="xl"
        elevated={true}
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Stack gap="lg">
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: spacing.lg }}>🎯</div>
            <h1 style={{
              margin: 0,
              fontSize: typography.h1.fontSize,
              fontWeight: typography.h1.fontWeight,
              color: colors.primary,
              marginBottom: spacing.sm,
            }}>
              Career Path System
            </h1>
            <p style={{
              margin: 0,
              fontSize: typography.bodySmall.fontSize,
              color: colors.text.secondary,
            }}>
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              title="Error de autenticación"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.base }}>
            <TextField
              label="Email"
              type="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <TextField
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <Spinner size="small" color="white" />
                  Ingresando...
                </div>
              ) : (
                '→ Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            fontSize: typography.caption.fontSize,
            color: colors.text.secondary,
          }}>
            ¿Necesitas ayuda? Contacta a tu administrador
          </div>
        </Stack>
      </Card>
    </div>
  );
}
