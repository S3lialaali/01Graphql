import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";

const XP_PROJECTS_QUERY = `
query XPProjects {
  transaction(
    where: {
      type: { _eq: "xp" }
      path: { _like: "%-module/%" }
      _and: [
        { path: { _nlike: "%/checkpoint%" } },
        { path: { _nlike: "%/piscine%/%" } }
      ]
    }
  ) {
    amount
    path
  }
}
`;

function shortPath(path) {
  const parts = (path || "").split("/").filter(Boolean);
  return parts[parts.length - 1] || "unknown";
}

function fmtXP(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + " MB";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + " kB";
  return n + " XP";
}

function humanName(raw) {
  return raw.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Skeleton() {
  const ws = [88, 72, 60, 50, 40];
  return (
    <div className="w-full animate-pulse text-center">
      <div className="h-5 bg-[#1F3A4B]/10 rounded-full w-32 mb-3 mx-auto" />
      <div className="h-10 bg-[#1F3A4B]/10 rounded-full w-52 mb-14 mx-auto" />
      <div className="space-y-7">
        {ws.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2.5 bg-[#1F3A4B]/10 rounded-full w-24 shrink-0" />
            <div className="h-2 bg-[#1F3A4B]/10 rounded-full flex-1" style={{ maxWidth: w + "%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopProjectsSection({ token, active }) {
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
        const data = await graphqlFetch({ query: XP_PROJECTS_QUERY, token });
        if (!cancelled) setRows(data.transaction ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active, token, rows]);

  const topProjects = useMemo(() => {
    if (!rows) return [];
    const map = new Map();
    for (const r of rows) {
      const p = r.path || "unknown";
      map.set(p, (map.get(p) || 0) + (r.amount || 0));
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, amount]) => ({ path, name: shortPath(path), amount }));
  }, [rows]);

  if (!active || loading) return <Skeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!rows)  return null;

  const maxXP = topProjects[0]?.amount || 1;

  const barColor = (i) => {
    if (i === 0) return "#C2F84F";
    const a = Math.max(0.12, 0.40 - i * 0.07);
    return `rgba(31,58,75,${a})`;
  };

  return (
    <div className="w-full text-center">
      {/* Section title */}
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#1F3A4B]/35 mb-2">
        Projects
      </p>
      <h2
        className="font-bold tracking-tight leading-none mb-14"
        style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}
      >
        Your Best Work
      </h2>

      {/* Horizontal bar chart */}
      <div className="space-y-8 text-left">
        {topProjects.map((p, i) => (
          <div key={p.path}>
            <div className="flex items-baseline justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#1F3A4B]/22 w-5 tabular-nums select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold">{humanName(p.name)}</span>
              </div>
              <span className="text-xs font-semibold text-[#1F3A4B]/45 tabular-nums ml-4">
                {fmtXP(p.amount)}
              </span>
            </div>
            <div
              className="ml-8 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(31,58,75,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: ((p.amount / maxXP) * 100).toFixed(1) + "%",
                  background: barColor(i),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 h-0.5 w-20 bg-[#C2F84F] rounded-full mx-auto" />
    </div>
  );
}
