import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";
import { SkillsSkeleton } from "./ui/Skeletons";
import { RadarChart } from "./charts/Charts";

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

  if (!active || loading) return <SkillsSkeleton />;
  if (error)  return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!rows)  return null;

  const hasTech     = technologies.length >= 3;
  const hasConcepts = technical.length    >= 3;
  const fallback    = [...technologies, ...technical].slice(0, 8);

  return (
    <div className="w-full text-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink/35 mb-2">Skills</p>
      <h2 className="font-bold tracking-tight leading-none mb-14" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
        Your Technical Profile
      </h2>

      {hasTech && hasConcepts ? (
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
        <p className="text-ink/35 text-sm">No skill data available yet.</p>
      )}

      <div className="mt-14 h-0.5 w-20 bg-accent rounded-full mx-auto" />
    </div>
  );
}
