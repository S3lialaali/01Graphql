
const API_BASE = import.meta.env.VITE_API_BASE;


function makeBasicAuth(identifier, password) {
  return "Basic " + btoa(`${identifier}:${password}`);
}

export async function signin(identifier, password) {
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: "POST",
    headers: {
      Authorization: makeBasicAuth(identifier, password),
    },
  });

  if (!res.ok) {
    const msg = res.status === 401 ? "Invalid credentials" : `Signin failed (${res.status})`;
    throw new Error(msg);
  }

 return await res.json();


}