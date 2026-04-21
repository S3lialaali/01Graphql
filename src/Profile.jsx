import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import YouSection from "./components/YouSection";
import AuditSection from "./components/AuditSection";
import XPStatsSection from "./components/XPSection";
import TopProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ScrollStroke from "./components/ui/ScrollStroke";
import ThemeToggle from "./components/ui/ThemeToggle";
import ElegantShape from "./components/ui/ElegantShape";

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
        className={`relative z-10 bg-canvas/50 backdrop-blur-md w-full ${maxWidth} px-6 lg:px-10 py-20`}
        style={{ rotateX, scale }}
      >
        {children(active)}
      </motion.div>
    </div>
  );
}

export default function Profile({ token, onLogout }) {
  return (
    <div className="relative bg-canvas text-ink overflow-x-hidden">

      {/* ── Full-page floating shapes ─────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12}
          gradient="from-accent/25"
          className="left-[-10%] md:left-[-5%] top-[4%]" />
        <ElegantShape delay={0.5} width={280} height={70} rotate={-20}
          gradient="from-ink/12"
          className="right-[10%] md:right-[15%] top-[9%]" />
        <ElegantShape delay={0.4} width={180} height={50} rotate={25}
          gradient="from-accent/18"
          className="left-[30%] md:left-[35%] top-[14%]" />
        <ElegantShape delay={0.6} width={500} height={120} rotate={-15}
          gradient="from-ink/12"
          className="right-[-5%] md:right-[0%] top-[19%]" />
        <ElegantShape delay={0.4} width={220} height={60} rotate={10}
          gradient="from-accent/20"
          className="left-[8%] md:left-[12%] top-[25%]" />
        <ElegantShape delay={0.5} width={320} height={85} rotate={-22}
          gradient="from-ink/10"
          className="right-[20%] md:right-[25%] top-[31%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8}
          gradient="from-accent/22"
          className="left-[5%] md:left-[10%] top-[37%]" />
        <ElegantShape delay={0.3} width={160} height={45} rotate={18}
          gradient="from-ink/08"
          className="left-[45%] md:left-[50%] top-[42%]" />
        <ElegantShape delay={0.6} width={400} height={100} rotate={14}
          gradient="from-accent/18"
          className="right-[-6%] md:right-[-2%] top-[47%]" />
        <ElegantShape delay={0.5} width={240} height={65} rotate={-12}
          gradient="from-ink/12"
          className="left-[20%] md:left-[25%] top-[54%]" />
        <ElegantShape delay={0.7} width={450} height={110} rotate={8}
          gradient="from-accent/22"
          className="right-[-8%] md:right-[-4%] top-[60%]" />
        <ElegantShape delay={0.4} width={200} height={55} rotate={-18}
          gradient="from-ink/10"
          className="right-[25%] md:right-[30%] top-[66%]" />
        <ElegantShape delay={0.4} width={350} height={90} rotate={-18}
          gradient="from-ink/10"
          className="left-[-5%] md:left-[0%] top-[72%]" />
        <ElegantShape delay={0.5} width={260} height={70} rotate={22}
          gradient="from-accent/20"
          className="left-[35%] md:left-[40%] top-[78%]" />
        <ElegantShape delay={0.6} width={250} height={70} rotate={15}
          gradient="from-accent/18"
          className="right-[10%] md:right-[15%] top-[83%]" />
        <ElegantShape delay={0.4} width={380} height={95} rotate={-10}
          gradient="from-ink/12"
          className="left-[-4%] md:left-[0%] top-[89%]" />
        <ElegantShape delay={0.5} width={180} height={50} rotate={-22}
          gradient="from-ink/08"
          className="left-[25%] md:left-[30%] top-[94%]" />
        <ElegantShape delay={0.6} width={220} height={60} rotate={16}
          gradient="from-accent/22"
          className="right-[5%] md:right-[10%] top-[97%]" />
      </div>

      {/* ── Full-page decorative stroke ───────────────────────────────── */}
      <ScrollStroke />

      {/* ── Top-right controls ────────────────────────────────────────── */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="px-5 py-2 text-sm font-bold border-2 border-ink rounded-full hover:bg-ink hover:text-canvas transition-all duration-200 cursor-pointer"
        >
          Logout
        </button>
      </div>

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
          <h2 className="text-2xl lg:text-3xl font-light text-ink/55 mb-20">
            Interactive Dashboard
          </h2>
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink/30">
              Scroll to explore
            </p>
            <svg
              viewBox="0 0 24 24" fill="none" stroke="rgb(var(--accent))" strokeWidth="2"
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
