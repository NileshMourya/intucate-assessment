import { useState } from "react";
import { validateLogin, setSession } from "../utils/auth";
import type { Session } from "../types/index";

interface Props {
  onLogin: (session: Session) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const err = validateLogin(email, password);
    if (err) return setError(err);

    setLoading(true);
    setTimeout(() => {
      const session: Session = {
        email,
        token: `intucate-mock-jwt-${Date.now()}`,
        loginAt: new Date().toISOString(),
      };
      setSession(session);
      onLogin(session);
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute w-[600px] h-[600px] bg-ember/20 blur-[120px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-cobalt/20 blur-[120px] rounded-full bottom-[-200px] right-[-200px]" />

      {/* Card */}
      <div className="relative w-full max-w-md px-6">
        <div className="rounded-2xl border border-white/10 bg-white/90 backdrop-blur-xl shadow-2xl px-10 py-12 animate-fade-in">
          {/* Logo / Heading */}
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl text-ink tracking-tight">
              Intu<span className="text-ember">cate</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-100 mt-2">
              Diagnostic Agent Console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="relative">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="
                  peer w-full px-4 pt-5 pb-2 rounded-lg border border-ink-100/40
                  bg-white text-sm outline-none transition
                  focus:border-cobalt focus:ring-2 focus:ring-cobalt/10
                "
              />
              <label
                className="
                absolute left-4 top-2 text-[11px] text-ink-100
                transition-all peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-sm
                peer-focus:top-2 peer-focus:text-[11px]
              "
              >
                Email address
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  peer w-full px-4 pt-5 pb-2 rounded-lg border border-ink-100/40
                  bg-white text-sm outline-none transition
                  focus:border-cobalt focus:ring-2 focus:ring-cobalt/10
                "
              />
              <label
                className="
                absolute left-4 top-2 text-[11px] text-ink-100
                transition-all peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-sm
                peer-focus:top-2 peer-focus:text-[11px]
              "
              >
                Password
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2 text-ember text-sm bg-ember/10 border border-ember/20 rounded-lg px-4 py-2">
                <span>⚠</span>
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-lg text-white text-sm font-semibold
                bg-gradient-to-r from-ember to-orange-500
                shadow-lg shadow-ember/30
                hover:shadow-xl hover:scale-[1.01]
                active:scale-[0.98]
                transition-all
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="white"
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Authenticating…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-ink-100 mt-8">
            Access restricted to{" "}
            <span className="font-mono-dm">@intucate.com</span> accounts
          </p>
        </div>
      </div>
    </div>
  );
}
