import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";

const XP_PROJECTS_QUERY = `
query XPProjects {
  transaction(
    where: { type: { _eq: "xp" } }
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

export default function TopProjectsSection({ token, active }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!active) return;
    if (rows) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await graphqlFetch({ query: XP_PROJECTS_QUERY, token });
        if (!cancelled) setRows(data.transaction ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
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
      .slice(0, 8)
      .map(([path, amount]) => ({ path, amount }));
  }, [rows]);

  if (loading && !rows) {
    return <div className="p-4">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">{error}</div>;
  }

  if (!rows) {
    return <div className="p-4">Scroll to load...</div>;
  }

  return (
    <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
      <p className="text-sm text-zinc-400">Top Projects</p>

      <div className="mt-3 space-y-2">
        {topProjects.map((p) => (
          <div
            key={p.path}
            className="flex justify-between bg-zinc-950/40 px-3 py-2 rounded-lg"
          >
            <span>{shortPath(p.path)}</span>
            <span>{p.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}