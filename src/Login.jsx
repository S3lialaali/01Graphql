import { useState } from "react";
import { motion } from "framer-motion";
import { signin } from "./api/auth";
import ThemeToggle from "./components/ui/ThemeToggle";


function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-ink/10" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={[
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "border border-ink/10",
            "shadow-[0_8px_32px_0_rgba(31,58,75,0.07)]",
          ].join(" ")}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Eye icon (show/hide password) ───────────────────────────────────────── */
function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── Main login page ──────────────────────────────────────────────────────── */
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

      {/* Theme toggle */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>


      {/* Subtle radial tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-ink/5 blur-3xl pointer-events-none" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12}
          gradient="from-accent/25"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />

        <ElegantShape delay={0.5} width={500} height={120} rotate={-15}
          gradient="from-ink/12"
          className="right-[-5%] md:right-[0%] top-[65%] md:top-[70%]" />

        <ElegantShape delay={0.4} width={300} height={80} rotate={-8}
          gradient="from-accent/20"
          className="left-[5%] md:left-[10%] bottom-[8%] md:bottom-[12%]" />

        <ElegantShape delay={0.6} width={200} height={60} rotate={20}
          gradient="from-ink/08"
          className="right-[15%] md:right-[20%] top-[8%] md:top-[12%]" />

        <ElegantShape delay={0.7} width={150} height={40} rotate={-25}
          gradient="from-accent/18"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[8%]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink/15 bg-ink/04 mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-ink/50">
            Reboot01
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="font-bold tracking-tight leading-[0.92] mb-3"
          style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)" }}
        >
          Welcome to<br />
          <span className="font-extralight">Reboot&rsquo;s</span>
        </motion.h1>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="text-lg font-light text-ink/50 mb-12 tracking-wide"
        >
          Interactive Dashboard
        </motion.p>

        {/* Login form */}
        <motion.form
          custom={3} variants={fadeUp} initial="hidden" animate="visible"
          onSubmit={handleSubmit}
          className="space-y-4 text-left"
        >
          {/* Username */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/40 mb-1.5">
              Username or Email
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
              className="w-full px-4 py-3 rounded-xl border border-ink/15 bg-ink/5 text-ink placeholder-ink/30 text-sm font-medium outline-none focus:border-ink/40 focus:bg-ink/10 transition-all duration-200"
              placeholder="your login"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/40 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-ink/15 bg-ink/5 text-ink placeholder-ink/30 text-sm font-medium outline-none focus:border-ink/40 focus:bg-ink/10 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/70 transition-colors cursor-pointer"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-60"
            style={{ background: "rgb(var(--ink))", color: "rgb(var(--canvas))" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgb(var(--accent))"; e.currentTarget.style.color = "rgb(var(--ink))"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgb(var(--ink))"; e.currentTarget.style.color = "rgb(var(--canvas))"; }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </motion.form>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent pointer-events-none" />
    </div>
  );
}
