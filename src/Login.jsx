import { useState } from "react";
import { signin } from "./api/auth";

export default function Login({ onSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await signin(identifier.trim(), password);
      onSuccess(token);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-6 shadow">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Use your username or email + password.
        </p>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-zinc-300">Username or Email</label>
            <input
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-white/20"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/20">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}