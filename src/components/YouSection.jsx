import { useEffect, useState } from "react";
import { graphqlFetch } from "../api/graphql";

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

function Skeleton() {
  return (
    <div className="w-full animate-pulse text-center">
      <div className="h-10 bg-ink/10 rounded-full w-48 mb-4 mx-auto" />
      <div className="h-5 bg-ink/10 rounded-full w-32 mb-16 mx-auto" />
      <div className="h-20 bg-ink/10 rounded-2xl w-52 mb-4 mx-auto" />
      <div className="h-5 bg-ink/10 rounded-full w-40 mb-16 mx-auto" />
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-ink/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center py-4 border border-ink/10 rounded-xl">
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/35 mb-1.5">
        {label}
      </p>
      <p className="text-base font-semibold leading-tight">{value}</p>
    </div>
  );
}

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

  if (!active || loading) return <Skeleton />;
  if (error) return <p className="text-red-400 text-sm text-center">{error}</p>;
  if (!me) return null;

  const labels     = (me.labels ?? []).map((l) => l.label?.name).filter(Boolean);
  const since      = new Date(me.createdAt).toLocaleDateString("en", { month: "long", year: "numeric" });
  const initials   = `${me.firstName?.[0] ?? ""}${me.lastName?.[0] ?? ""}`.toUpperCase()
                     || me.login?.[0]?.toUpperCase() || "?";

  return (
    <div className="w-full text-center">
      {/* Section title */}
      <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink/35 mb-2">
        Identity
      </p>
      <h2
        className="font-bold tracking-tight leading-none mb-14"
        style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}
      >
        You Are
      </h2>

      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-canvas mx-auto mb-5 select-none"
        style={{ background: "rgb(var(--ink))" }}
      >
        {initials}
      </div>

      {/* Name */}
      <p
        className="font-bold tracking-tight leading-none mb-2"
        style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}
      >
        {me.login}
      </p>
      <p className="text-lg font-light text-ink/55 mb-12">
        {me.firstName} {me.lastName}
      </p>

      {/* Stat grid */}
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
