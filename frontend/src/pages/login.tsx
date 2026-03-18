import { useState } from "react";

type LoginResponse =
  | { ok: true }
  | { error: string };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>(""); // keep as string for rendering
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE ?? "http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required for HttpOnly cookie
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // Try to parse JSON, but guard against non-JSON responses
      let data: LoginResponse | undefined = undefined;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        const message =
          (data as any)?.error ||
          (res.status === 401 ? "Invalid email or password." : "Login failed. Please try again.");
        setError(message);
        return;
      }

      // success -> redirect
      window.location.href = "/";
    } catch {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form} noValidate>
        <h2>Sign in to Navigaid</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>

        {error && <p style={styles.error} role="alert" aria-live="polite">{error}</p>}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: 16,
  },
  form: {
    width: 320,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  error: {
    color: "#b91c1c",
    marginTop: 8,
  },
};