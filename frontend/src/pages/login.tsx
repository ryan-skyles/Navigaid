import { useState } from "react";

type LoginResponse =
  | { ok: true }
  | { error: string };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE ?? "http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data: LoginResponse | undefined = undefined;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        const message =
          (data as any)?.error ||
          (res.status === 401 ? "Invalid email or password." : "Login failed. Please try again.");
        setError(message);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
            Welcome back
          </h1>
          <p className="text-on-surface-variant font-body">
            Sign in to access your NavigAid dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          noValidate
          className="bg-[var(--surface-container-lowest)] rounded-xl p-8 editorial-shadow space-y-5"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-on-surface font-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-12 rounded-xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 text-on-surface text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-container/40 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-on-surface font-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full h-12 rounded-xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 text-on-surface text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-container/40 transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary text-[var(--on-primary)] font-headline font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <p className="text-sm text-error font-medium text-center" role="alert" aria-live="polite">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
