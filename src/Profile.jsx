import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import YouSection from "./components/YouSection";
import AuditSection from "./components/AuditSection";
import XPStatsSection from "./components/XPSection";
import TopProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";

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
        className={`relative z-10 bg-[#FAFDEE] w-full ${maxWidth} px-12 lg:px-24 py-28`}
        style={{ rotateX, scale }}
      >
        {children(active)}
      </motion.div>
    </div>
  );
}

/*
 * ONE continuous path — flower (y 0-50) + winding trail (y 50-600)
 * viewBox "0 0 100 600" + preserveAspectRatio="none"
 */
const PATH =
  "M 50,28 " +
  "C 56,22 56,10 50,10 C 44,10 44,22 50,28 " +
  "C 57,24 66,14 66,19 C 66,24 57,30 50,28 " +
  "C 58,33 67,41 64,44 C 61,47 53,37 50,28 " +
  "C 56,34 56,46 50,46 C 44,46 44,34 50,28 " +
  "C 42,33 33,41 36,44 C 39,47 47,37 50,28 " +
  "C 43,24 34,14 34,19 C 34,24 43,30 50,28 " +
  "C 53,26 57,29 54,32 C 51,35 47,32 50,28 " +
  "C 50,37 51,45 53,52 " +
  "C 63,62 84,74 88,88 " +
  "C 92,100 86,113 75,119 " +
  "C 60,126 30,134 14,147 " +
  "C 4,158 6,174 20,183 " +
  "C 40,193 74,196 88,208 " +
  "C 97,218 96,234 83,242 " +
  "C 66,250 28,256 13,268 " +
  "C 3,278 7,295 23,303 " +
  "C 48,312 80,314 92,326 " +
  "C 99,337 96,354 80,361 " +
  "C 60,369 24,376 11,389 " +
  "C 2,402 8,419 26,427 " +
  "C 52,435 84,437 94,449 " +
  "C 99,460 95,477 78,484 " +
  "C 58,492 20,498 9,511 " +
  "C 2,524 9,542 29,550 " +
  "C 57,558 87,559 95,571 " +
  "C 99,583 94,599 75,605 " +
  "C 54,612 20,618 9,630 " +
  "C 2,642 10,659 32,667 " +
  "C 60,675 90,675 97,688";

export default function Profile({ token, onLogout }) {
  const { scrollYProgress } = useScroll();

  const pathLength = useTransform(scrollYProgress, [0, 1], [0.17, 1]);

  return (
    <div className="relative bg-[#FAFDEE] text-[#1F3A4B] overflow-x-hidden">

      {/* ── Full-page decorative stroke ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg
          viewBox="0 0 100 600"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={PATH} stroke="#C2F84F" strokeWidth="0.8" opacity="0.18"
            strokeLinecap="round" />
          <motion.path
            d={PATH}
            stroke="#C2F84F"
            strokeWidth="0.8"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
      </div>

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
      <Section>
        {(active) => <YouSection token={token} active={active} />}
      </Section>

      {/* ── Audit ─────────────────────────────────────────────────────── */}
      <Section>
        {(active) => <AuditSection token={token} active={active} />}
      </Section>

      {/* ── XP ────────────────────────────────────────────────────────── */}
      <Section>
        {(active) => <XPStatsSection token={token} active={active} />}
      </Section>

      {/* ── Projects ──────────────────────────────────────────────────── */}
      <Section>
        {(active) => <TopProjectsSection token={token} active={active} />}
      </Section>

      {/* ── Skills – wider for two radar charts ───────────────────────── */}
      <Section maxWidth="max-w-4xl">
        {(active) => <SkillsSection token={token} active={active} />}
      </Section>
    </div>
  );
}
