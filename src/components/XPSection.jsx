import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";

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

function Skeleton() {
  return (
    <div className="w-full animate-pulse text-center">
      <div className="h-5 bg-[#1F3A4B]/10 rounded-full w-28 mb-3 mx-auto" />
      <div className="h-10 bg-[#1F3A4B]/10 rounded-full w-52 mb-14 mx-auto" />
      <div className="h-24 bg-[#1F3A4B]/10 rounded-2xl w-64 mb-4 mx-auto" />
      <div className="h-4 bg-[#1F3A4B]/10 rounded-full w-40 mb-16 mx-auto" />
      <div className="h-44 bg-[#1F3A4B]/10 rounded-2xl" />
    </div>
  );
}

function XPChart({ data }) {
  const W = 560, H = 180, PX = 6, PY = 14;

  const t0  = data[0].date;
  const t1  = data[data.length - 1].date;
  const max = data[data.length - 1].total;
  const dt  = t1 - t0 || 1;

  const toX = (t) => PX + ((t - t0) / dt)  * (W - 2 * PX);
  const toY = (v) => PY + (1 - v / max)    * (H - 2 * PY);

  const step    = Math.max(1, Math.floor(data.length / 250));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);
  const pts     = sampled.map((p) => `${toX(p.date).toFixed(1)},${toY(p.total).toFixed(1)}`);

  const base     = H - PY;
  const areaPts  = [
    `${toX(sampled[0].date).toFixed(1)},${base}`,
    ...pts,
    `${toX(sampled[sampled.length - 1].date).toFixed(1)},${base}`,
  ].join(" ");

  const lastX = toX(data[data.length - 1].date);
  const lastY = toY(data[data.length - 1].total);

  const ticks = [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]];

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 24}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {[0.33, 0.66, 1].map((s) => (
        <line key={s}
          x1={PX} y1={toY(max * s)} x2={W - PX} y2={toY(max * s)}
          stroke="#1F3A4B" strokeWidth="0.4" opacity="0.12" strokeDasharray="5 4"
        />
      ))}
      <polygon points={areaPts} fill="#C2F84F" fillOpacity="0.14" />
      <polyline points={pts.join(" ")} fill="none" stroke="#C2F84F"
        strokeWidth="2" strokeLinejoin="round" />
      <circle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r="4.5" fill="#C2F84F" />
      <line x1={PX} y1={base} x2={W - PX} y2={base}
        stroke="#1F3A4B" strokeWidth="0.4" opacity="0.18" />
      {ticks.map((p, i) => {
        const x = toX(p.date);
        const label = new Date(p.date).toLocaleDateString("en", { month: "short", year: "2-digit" });
        const anchor = i === 0 ? "start" : i === 2 ? "end" : "middle";
        return (
          <text key={i} x={x.toFixed(1)} y={H + 18} textAnchor={anchor}
            fontSize="9.5" fill="#1F3A4B" fillOpacity="0.38"
            fontFamily="system-ui, sans-serif" fontWeight="600">
            {label}
          </text>
        );
      })}
    </svg>
  );
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
    return rows
      .map((r) => { cum += r.amount; return { date: new Date(r.createdAt).getTime(), total: cum }; });
  }, [rows]);

  if (!active || loading) return <Skeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!rows)  return null;

  const [xpVal, xpUnit] = fmtXP(totalXP);

  return (
    <div className="w-full text-center">
      {/* Section title */}
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#1F3A4B]/35 mb-2">
        Experience
      </p>
      <h2
        className="font-bold tracking-tight leading-none mb-14"
        style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}
      >
        Your Journey
      </h2>

      {/* Total XP */}
      <div className="mb-2">
        <span
          className="font-bold leading-none tracking-tighter"
          style={{ fontSize: "clamp(3.5rem, 13vw, 6rem)" }}
        >
          {xpVal}
        </span>
        <span className="text-2xl font-light text-[#1F3A4B]/45 ml-3">{xpUnit}</span>
      </div>
      <p className="text-xs text-[#1F3A4B]/35 font-semibold uppercase tracking-widest mb-12">
        {rows.length.toLocaleString()} transactions
      </p>

      {/* Chart */}
      {xpOverTime.length > 1 && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1F3A4B]/30 mb-5">
            Progress Over Time
          </p>
          <XPChart data={xpOverTime} />
        </div>
      )}

      <div className="mt-12 h-0.5 w-20 bg-[#C2F84F] rounded-full mx-auto" />
    </div>
  );
}
