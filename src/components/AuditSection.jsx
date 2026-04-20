import { useEffect, useState } from "react";
import { graphqlFetch } from "../api/graphql";

const AUDIT_QUERY = `
query Audit {
  user {
    auditRatio
    totalUp
    totalDown
  }
}
`;

function formatBytes(b) {
  if (!b) return "0 B";
  if (b >= 1_000_000) return (b / 1_000_000).toFixed(2) + " MB";
  if (b >= 1_000)     return (b / 1_000).toFixed(1) + " kB";
  return b + " B";
}

function Skeleton() {
  return (
    <div className="w-full animate-pulse text-center">
      <div className="h-5 bg-ink/10 rounded-full w-36 mb-3 mx-auto" />
      <div className="h-10 bg-ink/10 rounded-full w-56 mb-14 mx-auto" />
      <div className="h-28 bg-ink/10 rounded-2xl mb-10 mx-auto w-40" />
      <div className="space-y-6">
        <div className="h-8 bg-ink/10 rounded-xl" />
        <div className="h-8 bg-ink/10 rounded-xl" />
      </div>
    </div>
  );
}

function AuditBar({ label, value, pct, accent }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/40">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">{formatBytes(value)}</span>
      </div>
      <div className="h-5 rounded-full overflow-hidden" style={{ background: "rgba(31,58,75,0.09)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: pct + "%",
            background: accent ? "rgb(var(--accent))" : "rgba(31,58,75,0.4)",
          }}
        />
      </div>
    </div>
  );
}

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

  if (!active || loading) return <Skeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!audit) return null;

  const total   = (audit.up || 0) + (audit.down || 0);
  const upPct   = total ? Math.round((audit.up   / total) * 100) : 50;
  const downPct = 100 - upPct;
  const good    = audit.ratio >= 1;

  return (
    <div className="w-full text-center">
      {/* Section title */}
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink/35 mb-2">
        Audit
      </p>
      <h2
        className="font-bold tracking-tight leading-none mb-14"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
      >
        Your Audit Ratio
      </h2>

      {/* Big ratio number */}
      <div className="mb-3">
        <span
          className="font-bold leading-none tracking-tighter"
          style={{ fontSize: "clamp(4.5rem, 16vw, 7rem)" }}
        >
          {audit.ratio.toFixed(2)}
        </span>
      </div>

      {/* Badge */}
      <span
        className="inline-block text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide mb-12"
        style={{
          background: good ? "rgb(var(--accent))" : "#FFE4E4",
          color:      good ? "rgb(var(--ink))" : "#B91C1C",
        }}
      >
        {good ? "On track" : "Needs work"}
      </span>

      {/* Bars */}
      <div className="space-y-7 text-left">
        <AuditBar label="Audits Done"     value={audit.up}   pct={upPct}   accent />
        <AuditBar label="Audits Received" value={audit.down} pct={downPct} />

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/35 mb-2 text-center">
            Balance
          </p>
          <div className="h-6 rounded-full overflow-hidden" style={{ background: "rgba(31,58,75,0.09)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: upPct + "%", background: "rgb(var(--accent))" }}
            />
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
