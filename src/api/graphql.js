// src/api/graphql.js
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const GRAPHQL_PATH = import.meta.env.VITE_GRAPHQL_PATH ?? "/api/graphql-engine/v1/graphql";

export async function graphqlFetch({ query, variables = {}, token }) {
  const res = await fetch(`${API_BASE}${GRAPHQL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP error (${res.status})`);
  }

  const data = await res.json();

  if (data.errors?.length) {
    
    throw new Error(data.errors[0].message || "GraphQL error");
  }

  return data.data;
}