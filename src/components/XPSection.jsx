import { useEffect, useState, useMemo } from "react";
import { graphqlFetch } from "../api/graphql";

const XP_QUERY = `
query XP {
  transaction(
    where: { type: { _eq: "xp" } }
  ) {
    amount
  }
}
`;

export default function XPStatsSection({ token, active }) {
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
        const data = await graphqlFetch({ query: XP_QUERY, token });
        if (!cancelled) setRows(data.transaction ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load XP");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, token, rows]);

  const totalXP = useMemo(() => {
    if (!rows) return 0;
    return rows.reduce((sum, r) => sum + (r.amount || 0), 0);
  }, [rows]);

  if (loading && !rows) {
    return <div className="p-4">Loading XP...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">{error}</div>;
  }

  if (!rows) {
    return <div className="p-4">Scroll to load...</div>;
  }

  return (
    <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
      <p className="text-sm text-zinc-400">Total XP</p>

      <p className="mt-1 text-3xl font-semibold">
        {totalXP.toLocaleString()}
      </p>

      <p className="mt-2 text-sm text-zinc-400">
        Transactions: {rows.length}
      </p>
    </div>
  );
}