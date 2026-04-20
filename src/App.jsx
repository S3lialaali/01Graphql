import { useEffect, useState } from "react";
import Login from "./Login";
import Profile from "./Profile";
import { setUnauthenticatedHandler } from "./api/graphql";

const TOKEN_KEY = "jwt";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setUnauthenticatedHandler(handleLogout);
      setToken(saved);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  function handleLogin(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setUnauthenticatedHandler(handleLogout);
    setToken(newToken);
  }

  return token ? (
    <Profile token={token} onLogout={handleLogout} />
  ) : (
    <Login onSuccess={handleLogin} />
  );
}