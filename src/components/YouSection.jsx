import { useEffect, useState } from "react";
import { graphqlFetch } from "../api/graphql";
import { YouSkeleton } from "./ui/Skeletons";
import { Stat } from "./ui/Widgets";

const YOU_QUERY = `
query You {
  user {
    id
    login
    firstName
    lastName
    avatarUrl
    campus
    createdAt
    labels {
      id
      label { name }
    }
  }
}
`;

export default function YouSection({ token, active }) {
  const [me,      setMe]      = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!active || !token || me) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await graphqlFetch({ query: YOU_QUERY, token });
        if (!cancelled) setMe(data.user?.[0] ?? null);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active, token, me]);

  if (!active || loading) return <YouSkeleton />;
  if (error) return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!me) return null;

  const labels   = (me.labels ?? []).map((l) => l.label?.name).filter(Boolean);
  const since    = new Date(me.createdAt).toLocaleDateString("en", { month: "long", year: "numeric" });
  const initials = `${me.firstName?.[0] ?? ""}${me.lastName?.[0] ?? ""}`.toUpperCase()
                   || me.login?.[0]?.toUpperCase() || "?";

  return (
    <div className="w-full text-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink/35 mb-2">Identity</p>
      <h2 className="font-bold tracking-tight leading-none mb-14" style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}>
        You Are
      </h2>

      <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-canvas mx-auto mb-5 select-none"
        style={{ background: "rgb(var(--ink))" }}>
        {initials}
      </div>

      <p className="font-bold tracking-tight leading-none mb-2" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
        {me.login}
      </p>
      <p className="text-lg font-light text-ink/55 mb-12">{me.firstName} {me.lastName}</p>

      <div className="grid grid-cols-2 gap-3">
        {me.campus && <Stat label="Campus"       value={me.campus} />}
        <Stat label="Member Since" value={since} />
        <Stat label="Student ID"   value={`#${me.id}`} />
        {labels.length > 0 && <Stat label="Tags" value={labels.join(", ")} />}
      </div>

      <div className="mt-12 h-0.5 w-20 bg-accent rounded-full mx-auto" />
    </div>
  );
}
