import { useEffect, useState } from "react";
import { graphqlFetch } from "../api/graphql";
import AuditDonut from "./charts/AuditDonut";

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
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!active) return;
    if (audit) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await graphqlFetch({ query: AUDIT_QUERY, token });
        const u = data.user?.[0] ?? null;
        if (!cancelled) {
          setAudit(
            u
              ? {
                  ratio: u.auditRatio,
                  up: u.totalUp,
                  down: u.totalDown,
                }
              : null
          );
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load audit");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, token, audit]);

  if (loading && !audit) {
    return (
      <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
        Loading audit…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-200 ring-1 ring-red-500/20">
        {error}
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
        Scroll to load…
      </div>
    );
  }

  return (
  <div className="grid gap-4 md:grid-cols-[220px_1fr]">
    <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10 flex items-center justify-center">
      <AuditDonut up={audit.up} down={audit.down} />
    </div>

    <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10 flex flex-col justify-center">
      <p className="text-sm text-zinc-400">Audit Ratio</p>
      <p className="mt-1 text-3xl font-semibold">{audit.ratio.toFixed(2)}</p>
      <p className="mt-2 text-sm text-zinc-400">
        Up vs Down totals shown in the chart
      </p>
    </div>
  </div>
);
}