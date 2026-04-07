import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import YouSection from "./components/YouSection";
import AuditSection from "./components/AuditSection";
import XPStatsSection from "./components/XPSection";
import TopProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ScrollStroke from "./components/ui/ScrollStroke";

/* ─── lazy-load activation ──────────────────────────────────────────────── */
function useSectionActive(ref) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0, rootMargin: "200px 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return active;
}

/* ─── container scroll animation (Aceternity-style) ─────────────────────
   Each section wrapper tracks its own scroll progress.
   The inner card rotates from rotateX(16°) → 0° and scales 0.93 → 1
   as the section enters the viewport.                                      */
function Section({ children, maxWidth = "max-w-3xl" }) {
  const containerRef = useRef(null);
  const active = useSectionActive(containerRef);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  /* strong tilt resolves in the first 35% of the section's scroll range */
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [35, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.35], [0.82, 1]);

  return (
    <div
      ref={containerRef}
      className="min-h-[140vh] flex items-center justify-center px-4 py-32"
      style={{ perspective: "800px" }}
    >
      <motion.div
        className={`relative z-10 bg-[#FAFDEE] w-full ${maxWidth} px-6 lg:px-10 py-20`}
        style={{ rotateX, scale }}
      >
        {children(active)}
      </motion.div>
    </div>
  );
}

export default function Profile({ token, onLogout }) {
  return (
    <div className="relative bg-[#FAFDEE] text-[#1F3A4B] overflow-x-hidden">

      {/* ── Full-page decorative stroke ───────────────────────────────── */}
      <ScrollStroke />

      {/* ── Logout ────────────────────────────────────────────────────── */}
      <button
        onClick={onLogout}
        className="fixed top-5 right-5 z-50 px-5 py-2 text-sm font-bold border-2 border-[#1F3A4B] rounded-full hover:bg-[#1F3A4B] hover:text-[#FAFDEE] transition-all duration-200 cursor-pointer"
      >
        Logout
      </button>

      {/* ── Welcome ───────────────────────────────────────────────────── */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 relative">
        <div className="relative z-10">
          <h1
            className="font-bold leading-[0.92] tracking-tight mb-5"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            Welcome to<br />
            <span className="font-extralight">Reboot&rsquo;s</span>
          </h1>
          <h2 className="text-2xl lg:text-3xl font-light text-[#1F3A4B]/55 mb-20">
            Interactive Dashboard
          </h2>
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#1F3A4B]/30">
              Scroll to explore
            </p>
            <svg
              viewBox="0 0 24 24" fill="none" stroke="#C2F84F" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="w-5 h-5 animate-bounce"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── You ───────────────────────────────────────────────────────── */}
      <Section maxWidth="max-w-4xl">
        {(active) => <YouSection token={token} active={active} />}
      </Section>

      {/* ── Audit ─────────────────────────────────────────────────────── */}
      <Section maxWidth="max-w-4xl">
        {(active) => <AuditSection token={token} active={active} />}
      </Section>

      {/* ── XP ────────────────────────────────────────────────────────── */}
      <Section maxWidth="max-w-5xl">
        {(active) => <XPStatsSection token={token} active={active} />}
      </Section>

      {/* ── Projects ──────────────────────────────────────────────────── */}
      <Section maxWidth="max-w-4xl">
        {(active) => <TopProjectsSection token={token} active={active} />}
      </Section>

      {/* ── Skills – wider for two radar charts ───────────────────────── */}
      <Section maxWidth="max-w-6xl">
        {(active) => <SkillsSection token={token} active={active} />}
      </Section>
    </div>
  );
}
