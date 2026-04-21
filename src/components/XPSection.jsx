import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";
import { XPSkeleton } from "./ui/Skeletons";
import { XPChart } from "./charts/Charts";

const XP_QUERY = `
query XP {
  transaction(
    where: {
      type: { _eq: "xp" }
      path: { _like: "%-module/%" }
      _and: [
        { path: { _nlike: "%/piscine%/%" } }
      ]
    }
    order_by: { createdAt: asc }
  ) {
    amount
    createdAt
  }
}
`;

function fmtXP(n) {
  if (n >= 1_000_000) return [(n / 1_000_000).toFixed(2), "MB"];
  if (n >= 1_000)     return [(n / 1_000).toFixed(1),      "kB"];
  return [n.toString(), "XP"];
}

export default function XPStatsSection({ token, active }) {
  const [rows,    setRows]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!active || rows) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await graphqlFetch({ query: XP_QUERY, token });
        if (!cancelled) setRows(data.transaction ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active, token, rows]);

  const totalXP = useMemo(
    () => (rows ?? []).reduce((s, r) => s + (r.amount || 0), 0),
    [rows]
  );

  const xpOverTime = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    let cum = 0;
    return rows.map((r) => ({ date: new Date(r.createdAt).getTime(), total: (cum += r.amount) }));
  }, [rows]);

  if (!active || loading) return <XPSkeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!rows)  return null;

  const [xpVal, xpUnit] = fmtXP(totalXP);

  return (
    <div className="w-full text-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink/35 mb-2">Experience</p>
      <h2 className="font-bold tracking-tight leading-none mb-14" style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}>
        Your Journey
      </h2>

      <div className="mb-2">
        <span className="font-bold leading-none tracking-tighter" style={{ fontSize: "clamp(3.5rem, 13vw, 6rem)" }}>
          {xpVal}
        </span>
        <span className="text-2xl font-light text-ink/45 ml-3">{xpUnit}</span>
      </div>
      <p className="text-xs text-ink/35 font-semibold uppercase tracking-widest mb-12">
        {rows.length.toLocaleString()} transactions
      </p>

      {xpOverTime.length > 1 && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/30 mb-5">Progress Over Time</p>
          <XPChart data={xpOverTime} />
        </div>
      )}

      <div className="mt-12 h-0.5 w-20 bg-accent rounded-full mx-auto" />
    </div>
  );
}
