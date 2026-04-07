import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";

const SKILLS_QUERY = `
query Skills {
  transaction(where: { type: { _like: "skill_%" } }) {
    type
    amount
  }
}
`;

const TECH_NAMES = new Set([
  "go", "js", "javascript", "html", "css", "sql", "python", "rust", "c",
  "php", "ruby", "bash", "ts", "typescript", "react", "docker", "git",
  "svelte", "vue", "angular", "java", "swift", "kotlin", "scala",
]);

function Skeleton() {
  return (
    <div className="w-full animate-pulse text-center">
      <div className="h-5 bg-[#1F3A4B]/10 rounded-full w-28 mb-3 mx-auto" />
      <div className="h-10 bg-[#1F3A4B]/10 rounded-full w-72 mb-14 mx-auto" />
      <div className="grid grid-cols-2 gap-8">
        <div className="h-64 bg-[#1F3A4B]/10 rounded-3xl" />
        <div className="h-64 bg-[#1F3A4B]/10 rounded-3xl" />
      </div>
    </div>
  );
}

/* ── Radar / spider chart ──────────────────────────────────────────────── */
function RadarChart({ skills, size = 240, label }) {
  if (!skills || skills.length < 3) return null;

  const pad    = 30;
  const cx     = size / 2 + pad;
  const cy     = size / 2 + pad;
  const r      = size * 0.38;
  const n      = skills.length;
  const maxVal = 100; // skill amounts are percentages (0-100)
  const svgW   = size + pad * 2;
  const svgH   = size + pad * 2 + 20; // extra 20 for chart label

  const angle = (i) => (2 * Math.PI * i) / n - Math.PI / 2;

  const pt = (i, val) => {
    const a  = angle(i);
    const rv = (val / maxVal) * r;
    return { x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) };
  };

  const toPoly = (pts) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const outerPts = skills.map((_, i) => pt(i, maxVal));
  const valuePts = skills.map((s, i) => pt(i, s.amount));

  return (
    <div className="flex flex-col items-center">
      {label && (
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1F3A4B]/35 mb-4">
          {label}
        </p>
      )}
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Guide circles */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={cx.toFixed(1)}
            cy={cy.toFixed(1)}
            r={(r * scale).toFixed(1)}
            fill="none"
            stroke="#1F3A4B"
            strokeWidth={scale === 1 ? 0.8 : 0.4}
            opacity={scale === 1 ? 0.18 : 0.09}
          />
        ))}

        {/* Spokes */}
        {outerPts.map((p, i) => (
          <line
            key={i}
            x1={cx.toFixed(1)} y1={cy.toFixed(1)}
            x2={p.x.toFixed(1)} y2={p.y.toFixed(1)}
            stroke="#1F3A4B" strokeWidth="0.5" opacity="0.13"
          />
        ))}

        {/* Value polygon */}
        <polygon
          points={toPoly(valuePts)}
          fill="#C2F84F"
          fillOpacity="0.22"
          stroke="#C2F84F"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Value dots */}
        {valuePts.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill="#C2F84F" />
        ))}

        {/* Labels */}
        {outerPts.map((_p, i) => {
          const a    = angle(i);
          const lx   = cx + (r + 20) * Math.cos(a);
          const ly   = cy + (r + 20) * Math.sin(a);
          const diff = lx - cx;
          const anchor =
            Math.abs(diff) < 6 ? "middle" : diff < 0 ? "end" : "start";
          return (
            <text
              key={i}
              x={lx.toFixed(1)}
              y={(ly + 1).toFixed(1)}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="9.5"
              fill="#1F3A4B"
              fillOpacity="0.62"
              fontFamily="system-ui, sans-serif"
              fontWeight="700"
            >
              {skills[i].name.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function SkillsSection({ token, active }) {
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
        const data = await graphqlFetch({ query: SKILLS_QUERY, token });
        if (!cancelled) setRows(data.transaction ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active, token, rows]);

  const { technologies, technical } = useMemo(() => {
    if (!rows) return { technologies: [], technical: [] };
    const map = new Map();
    for (const r of rows) {
      if ((r.amount ?? 0) > (map.get(r.type) ?? 0)) map.set(r.type, r.amount);
    }
    const all = [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([type, amount]) => ({ type, name: type.replace(/^skill_/, ""), amount }));

    return {
      technologies: all.filter((s) =>  TECH_NAMES.has(s.name.toLowerCase())).slice(0, 8),
      technical:    all.filter((s) => !TECH_NAMES.has(s.name.toLowerCase())).slice(0, 8),
    };
  }, [rows]);

  if (!active || loading) return <Skeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!rows)  return null;

  const hasTech     = technologies.length >= 3;
  const hasConcepts = technical.length    >= 3;
  const showBoth    = hasTech && hasConcepts;
  const fallback    = [...technologies, ...technical].slice(0, 8);

  return (
    <div className="w-full text-center">
      {/* Section title */}
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#1F3A4B]/35 mb-2">
        Skills
      </p>
      <h2
        className="font-bold tracking-tight leading-none mb-14"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
      >
        Your Technical Profile
      </h2>

      {showBoth ? (
        <div className="grid grid-cols-2 gap-8">
          <RadarChart skills={technologies} label="Technologies" size={340} />
          <RadarChart skills={technical}    label="Concepts"     size={340} />
        </div>
      ) : hasTech ? (
        <div className="flex justify-center">
          <RadarChart skills={technologies} label="Technologies" size={400} />
        </div>
      ) : hasConcepts ? (
        <div className="flex justify-center">
          <RadarChart skills={technical} label="Technical Concepts" size={400} />
        </div>
      ) : fallback.length >= 3 ? (
        <div className="flex justify-center">
          <RadarChart skills={fallback} label="Skills" size={400} />
        </div>
      ) : (
        <p className="text-[#1F3A4B]/35 text-sm">No skill data available yet.</p>
      )}

      <div className="mt-14 h-0.5 w-20 bg-[#C2F84F] rounded-full mx-auto" />
    </div>
  );
}
