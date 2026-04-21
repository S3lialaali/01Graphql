import { useState } from "react";
import { motion } from "framer-motion";
import { signin } from "./api/auth";
import ThemeToggle from "./components/ui/ThemeToggle";
import { EyeIcon } from "./components/ui/Icons";
import { LoginShapes } from "./components/ui/FloatingShapes";

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function Login({ onSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await signin(identifier.trim(), password);
      onSuccess(token);
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-canvas text-ink">

      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-ink/5 blur-3xl pointer-events-none" />
      <LoginShapes />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center">

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink/15 bg-ink/5 mb-10">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-ink/50">Reboot01</span>
        </motion.div>

        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="font-bold tracking-tight leading-[0.92] mb-3"
          style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)" }}>
          Welcome to<br />
          <span className="font-extralight">Reboot&rsquo;s</span>
        </motion.h1>

        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="text-lg font-light text-ink/50 mb-12 tracking-wide">
          Interactive Dashboard
        </motion.p>

        <motion.form custom={3} variants={fadeUp} initial="hidden" animate="visible"
          onSubmit={handleSubmit} className="space-y-4 text-left">

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/40 mb-1.5">
              Username or Email
            </label>
            <input
              value={identifier} onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username" required
              className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-ink/5 text-ink placeholder-ink/30 text-sm font-medium outline-none focus:border-ink/40 focus:bg-ink/10 transition-all duration-200"
              placeholder="your login"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/40 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-ink/15 bg-ink/5 text-ink placeholder-ink/30 text-sm font-medium outline-none focus:border-ink/40 focus:bg-ink/10 transition-all duration-200"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/70 transition-colors cursor-pointer"
                aria-label={showPw ? "Hide password" : "Show password"}>
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-60"
            style={{ background: "rgb(var(--ink))", color: "rgb(var(--canvas))" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgb(var(--accent))"; e.currentTarget.style.color = "rgb(var(--ink))"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgb(var(--ink))"; e.currentTarget.style.color = "rgb(var(--canvas))"; }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </motion.form>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent pointer-events-none" />
    </div>
  );
}
