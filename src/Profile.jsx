import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import YouSection from "./components/YouSection";
import AuditSection from "./components/AuditSection";
import XPStatsSection from "./components/XPSection";
import TopProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";

/* ─── lazy-load hook ────────────────────────────────────────────────────── */
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

/*
 * ONE continuous path:
 *   • y 0-50  : 6-petal flower centered at (50, 28)
 *   • y 50-600: winding S-curve trail that zigzags through
 *               left margin (x ≈ 5-18) and right margin (x ≈ 82-95),
 *               passing through center (x ≈ 40-60) where it is hidden
 *               behind the opaque content boxes.
 *
 * viewBox "0 0 100 600"  +  preserveAspectRatio="none"
 * → x maps 0-100 → 0-100% of page width
 * → y maps 0-600 → 0-100% of page height (≈ 6 × 100vh)
 */
const PATH =
  /* center (50,28) */
  "M 50,28 " +
  /* petal 1 – up */
  "C 56,22 56,10 50,10 C 44,10 44,22 50,28 " +
  /* petal 2 – upper-right */
  "C 57,24 66,14 66,19 C 66,24 57,30 50,28 " +
  /* petal 3 – lower-right */
  "C 58,33 67,41 64,44 C 61,47 53,37 50,28 " +
  /* petal 4 – down */
  "C 56,34 56,46 50,46 C 44,46 44,34 50,28 " +
  /* petal 5 – lower-left */
  "C 42,33 33,41 36,44 C 39,47 47,37 50,28 " +
  /* petal 6 – upper-left */
  "C 43,24 34,14 34,19 C 34,24 43,30 50,28 " +
  /* inner accent loop */
  "C 53,26 57,29 54,32 C 51,35 47,32 50,28 " +
  /* exit toward trail */
  "C 50,37 51,45 53,52 " +

  /* ── welcome exit (y 52-100) ── */
  "C 63,62 84,74 88,88 " +
  "C 92,100 86,113 75,119 " +

  /* ── section 1 – You (y 100-200) ── */
  "C 60,126 30,134 14,147 " +
  "C 4,158 6,174 20,183 " +
  "C 40,193 74,196 88,208 " +
  "C 97,218 96,234 83,242 " +

  /* ── section 2 – Audit (y 200-300) ── */
  "C 66,250 28,256 13,268 " +
  "C 3,278 7,295 23,303 " +
  "C 48,312 80,314 92,326 " +
  "C 99,337 96,354 80,361 " +

  /* ── section 3 – XP (y 300-400) ── */
  "C 60,369 24,376 11,389 " +
  "C 2,402 8,419 26,427 " +
  "C 52,435 84,437 94,449 " +
  "C 99,460 95,477 78,484 " +

  /* ── section 4 – Projects (y 400-500) ── */
  "C 58,492 20,498 9,511 " +
  "C 2,524 9,542 29,550 " +
  "C 57,558 87,559 95,571 " +
  "C 99,583 94,599 75,605 " +

  /* ── section 5 – Skills (y 500-600) ── */
  "C 54,612 20,618 9,630 " +
  "C 2,642 10,659 32,667 " +
  "C 60,675 90,675 97,688";

export default function Profile({ token, onLogout }) {
  const { scrollYProgress } = useScroll();

  /*
   * Flower occupies roughly 22% of total path length.
   * Map:  scroll 0%→17%  →  pathLength 3%→25%   (fast flower draw)
   * Flower (first ~25% of path) is pre-filled at load.
   * Trail draws from scroll 0% → 100%.
   */
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.17, 1]);

  const youRef      = useRef(null);
  const auditRef    = useRef(null);
  const xpRef       = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef   = useRef(null);

  const youActive      = useSectionActive(youRef);
  const auditActive    = useSectionActive(auditRef);
  const xpActive       = useSectionActive(xpRef);
  const projectsActive = useSectionActive(projectsRef);
  const skillsActive   = useSectionActive(skillsRef);

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
          {/* faint ghost trace */}
          <path d={PATH} stroke="#C2F84F" strokeWidth="0.8" opacity="0.18"
            strokeLinecap="round" />
          {/* animated reveal */}
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
      {/* No background — flower SVG shows through */}
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
            {/* animated arrow */}
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

      {/* ── Section wrapper helper ─────────────────────────────────────
          The content box has bg-[#FAFDEE] z-10 so it hides the stroke
          behind it; the stroke is visible in the left/right margins.   */}

      {/* You */}
      <div
        ref={youRef}
        className="min-h-screen flex items-center justify-center px-4 py-24"
      >
        <div className="relative z-10 bg-[#FAFDEE] w-full max-w-2xl px-8 lg:px-12 py-14">
          <YouSection token={token} active={youActive} />
        </div>
      </div>

      {/* Audit */}
      <div
        ref={auditRef}
        className="min-h-screen flex items-center justify-center px-4 py-24"
      >
        <div className="relative z-10 bg-[#FAFDEE] w-full max-w-2xl px-8 lg:px-12 py-14">
          <AuditSection token={token} active={auditActive} />
        </div>
      </div>

      {/* XP */}
      <div
        ref={xpRef}
        className="min-h-screen flex items-center justify-center px-4 py-24"
      >
        <div className="relative z-10 bg-[#FAFDEE] w-full max-w-2xl px-8 lg:px-12 py-14">
          <XPStatsSection token={token} active={xpActive} />
        </div>
      </div>

      {/* Projects */}
      <div
        ref={projectsRef}
        className="min-h-screen flex items-center justify-center px-4 py-24"
      >
        <div className="relative z-10 bg-[#FAFDEE] w-full max-w-2xl px-8 lg:px-12 py-14">
          <TopProjectsSection token={token} active={projectsActive} />
        </div>
      </div>

      {/* Skills – wider to fit two radar charts */}
      <div
        ref={skillsRef}
        className="min-h-screen flex items-center justify-center px-4 py-24"
      >
        <div className="relative z-10 bg-[#FAFDEE] w-full max-w-3xl px-8 lg:px-12 py-14">
          <SkillsSection token={token} active={skillsActive} />
        </div>
      </div>
    </div>
  );
}
