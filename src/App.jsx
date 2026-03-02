import { useEffect, useState } from "react";
import Login from "./Login";
import Profile from "./Profile";

const TOKEN_KEY = "jwt";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  function handleLogin(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return token ? (
    <Profile token={token} onLogout={handleLogout} />
  ) : (
    <Login onSuccess={handleLogin} />
  );
}