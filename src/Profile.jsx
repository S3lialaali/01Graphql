import { useEffect, useState } from "react";
import { graphqlFetch } from "./api/graphql";

const USER_QUERY = `
{
  user {
    id
    login
  }
}
`;

export default function Profile({token, onLogout}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");
        const data = await graphqlFetch({query: USER_QUERY, token});
        if (!cancelled) setUser(data.user?.[0] ?? null);
      }catch (err) {
        if (!cancelled) setError(err.message || "Failed to load profile");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  },[token]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-zinc-900 p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button
            className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/20">
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-xl bg-zinc-950/40 p-4 ring-1 ring-white/10">
          <p className="text-sm text-zinc-400">User</p>
          <p className="mt-1 text-lg">
            {user ? `${user.login} (id: ${user.id})` : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}
