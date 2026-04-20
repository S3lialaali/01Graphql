// src/api/graphql.js
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const GRAPHQL_PATH = import.meta.env.VITE_GRAPHQL_PATH ?? "/api/graphql-engine/v1/graphql";

let _onUnauthenticated = null;
export function setUnauthenticatedHandler(cb) { _onUnauthenticated = cb; }

export async function graphqlFetch({ query, variables = {}, token }) {
  const res = await fetch(`${API_BASE}${GRAPHQL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 401) {
    _onUnauthenticated?.();
    throw new Error("Session expired");
  }

  if (!res.ok) {
    throw new Error(`GraphQL HTTP error (${res.status})`);
  }

  const data = await res.json();

  if (data.errors?.length) {
    const msg = data.errors[0].message || "GraphQL error";
    if (msg.includes("Could not verify JWT") || msg.includes("JWTExpired") || msg.includes("invalid")) {
      _onUnauthenticated?.();
    }
    throw new Error(msg);
  }

  return data.data;
}