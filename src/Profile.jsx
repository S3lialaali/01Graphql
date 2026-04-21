import YouSection from "./components/YouSection";
import AuditSection from "./components/AuditSection";
import XPStatsSection from "./components/XPSection";
import TopProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import { Section } from "./components/ui/Section";
import ScrollStroke from "./components/ui/ScrollStroke";
import ThemeToggle from "./components/ui/ThemeToggle";
import { ProfileShapes } from "./components/ui/FloatingShapes";

export default function Profile({ token, onLogout }) {
  return (
    <div className="relative bg-canvas text-ink overflow-x-hidden">

      <ProfileShapes />
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
          <h1 className="font-bold leading-[0.92] tracking-tight mb-5"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="rgb(var(--accent))" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 animate-bounce">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </div>

      <Section maxWidth="max-w-4xl">
        {(active) => <YouSection token={token} active={active} />}
      </Section>

      <Section maxWidth="max-w-4xl">
        {(active) => <AuditSection token={token} active={active} />}
      </Section>

      <Section maxWidth="max-w-5xl">
        {(active) => <XPStatsSection token={token} active={active} />}
      </Section>

      <Section maxWidth="max-w-4xl">
        {(active) => <TopProjectsSection token={token} active={active} />}
      </Section>

      <Section maxWidth="max-w-6xl">
        {(active) => <SkillsSection token={token} active={active} />}
      </Section>
    </div>
  );
}
