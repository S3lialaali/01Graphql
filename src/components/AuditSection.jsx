import { useEffect, useState } from "react";
import { graphqlFetch } from "../api/graphql";
import { AuditSkeleton } from "./ui/Skeletons";
import { AuditBar } from "./ui/Widgets";

const AUDIT_QUERY = `
query Audit {
  user {
    auditRatio
    totalUp
    totalDown
  }
}
`;

export default function AuditSection({ token, active }) {
  const [audit,   setAudit]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!active || audit) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await graphqlFetch({ query: AUDIT_QUERY, token });
        const u = data.user?.[0] ?? null;
        if (!cancelled)
          setAudit(u ? { ratio: u.auditRatio, up: u.totalUp, down: u.totalDown } : null);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active, token, audit]);

  if (!active || loading) return <AuditSkeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!audit) return null;

  const total   = (audit.up || 0) + (audit.down || 0);
  const upPct   = total ? Math.round((audit.up   / total) * 100) : 50;
  const downPct = 100 - upPct;
  const good    = audit.ratio >= 1;

  return (
    <div className="w-full text-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink/35 mb-2">Audit</p>
      <h2 className="font-bold tracking-tight leading-none mb-14" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
        Your Audit Ratio
      </h2>

      <div className="mb-3">
        <span className="font-bold leading-none tracking-tighter" style={{ fontSize: "clamp(4.5rem, 16vw, 7rem)" }}>
          {audit.ratio.toFixed(2)}
        </span>
      </div>

      <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide mb-12"
        style={{ background: good ? "rgb(var(--accent))" : "#FFE4E4", color: good ? "rgb(var(--ink))" : "#B91C1C" }}>
        {good ? "On track" : "Needs work"}
      </span>

      <div className="space-y-7 text-left">
        <AuditBar label="Audits Done"     value={audit.up}   pct={upPct}   accent />
        <AuditBar label="Audits Received" value={audit.down} pct={downPct} />

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/35 mb-2 text-center">Balance</p>
          <div className="h-6 rounded-full overflow-hidden bg-ink/10">
            <div className="h-full rounded-full" style={{ width: upPct + "%", background: "rgb(var(--accent))" }} />
          </div>
          <div className="flex justify-between mt-2 text-[9px] font-semibold text-ink/35">
            <span>Done {upPct}%</span>
            <span>{downPct}% Received</span>
          </div>
        </div>
      </div>

      <div className="mt-12 h-0.5 w-20 bg-accent rounded-full mx-auto" />
    </div>
  );
}
