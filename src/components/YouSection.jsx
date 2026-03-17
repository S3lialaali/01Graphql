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

export default function YouSection({ token, active }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only fetch when the section becomes active (in view)
    if (!active) return;
    if (!token) return;

    // Don’t refetch if we already have data
    if (me) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await graphqlFetch({ query: YOU_QUERY, token });
        const user = data.user?.[0] ?? null;
        if (!cancelled) setMe(user);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [active, token, me]);

  if (loading && !me) {
    return (
      <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
        Loading user…
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

  if (!me) {
    return (
      <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
        Scroll to load…
      </div>
    );
  }

  const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ");

  return (
    <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10 flex items-center gap-4">
      <div className="h-14 w-14 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
        {me.avatarUrl ? (
          <img src={me.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="text-lg font-semibold truncate">
          {fullName || me.login}
        </div>
        <div className="text-sm text-zinc-400 truncate">
          @{me.login} • id {me.id}
        </div>
        <div className="text-sm text-zinc-400 truncate">
          {me.campus ? `Campus: ${me.campus}` : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
  {(me.labels ?? []).map((l) => (
    <span
      key={l.id}
      className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-200 ring-1 ring-white/10"
    >
      {l.label?.name ?? "Unknown"}
    </span>
  ))}
</div>
      </div>
    </div>
  );
}
