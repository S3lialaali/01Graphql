import { useState } from "react";
import Section from "./components/Section";
import YouSection from "./components/YouSection";
import AuditSection from "./components/AuditSection";
import XPStatsSection from "./components/XPSection";
import TopProjectsSection from "./components/ProjectsSection";

export default function Profile({ token, onLogout }) {
  const [youActive, setYouActive] = useState(false);
  const [auditActive, setAuditActive] = useState(false);
  const [xpStatsActive, setXpStatsActive] = useState(false);
  const [topProjectsActive, setTopPojectsActive] = useState(false);


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button
            className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <Section
        id="you"
        title="You"
        subtitle="Basic identity + account overview"
        onEnter={() => setYouActive(true)}
      >
        <YouSection token={token} active={youActive} />
      </Section>

      {/* keep your other placeholder sections for now */}
     <Section
  id="audit"
  title="Audit"
  subtitle="Ratio + up/down breakdown"
  onEnter={() => setAuditActive(true)}
>
  <AuditSection token={token} active={auditActive} />
</Section>

      <Section
  id="xp-stats"
  title="XP"
  subtitle="Total XP overview"
  onEnter={() => setXpStatsActive(true)}
>
  <XPStatsSection token={token} active={xpStatsActive} />
</Section>

<Section
  id="top-projects"
  title="Top Projects"
  subtitle="Projects ranked by XP"
  onEnter={() => setTopProjectsActive(true)}
>
  <TopProjectsSection token={token} active={topProjectsActive} />
</Section>

      <div className="h-24" />
    </div>
  );
}
