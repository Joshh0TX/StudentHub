import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";

const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // starts true

  /**
   * tokenRef holds the raw JWT string in memory only.
   * It is populated from localStorage on boot (so the session
   * survives a page refresh), but after that every consumer
   * must call `getToken()` instead of touching localStorage directly.
   * The userId always comes from the server's /api/auth/me response
   * and lives in `user.id` — it is never read from localStorage.
   */
  const tokenRef = useRef(localStorage.getItem("token"));

  /** Returns the current in-memory token — never reads localStorage again. */
  const getToken = () => tokenRef.current;

  useEffect(() => {
    const token = tokenRef.current;

    // ── No token — stop loading immediately, no fetch needed
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check content type before parsing — prevents HTML parse crash
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error("Invalid session");
        }

        const data = await res.json();

        /**
         * `data` must contain at minimum: { id, ... }
         * The `id` here is the database-issued user ID — it was never
         * stored in localStorage; it came straight from the server.
         */
        setUser(data);
      } catch {
        // Token is stale / invalid — purge it and start fresh
        localStorage.removeItem("token");
        tokenRef.current = null;
        setUser(null);
      } finally {
        setLoading(false); // ALWAYS runs — page never stays stuck
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();

    /**
     * Store the token in localStorage ONLY so the session can be
     * restored after a hard refresh (via tokenRef in the effect above).
     * The userId is taken exclusively from `data.user` — the object
     * the server returned — not from anything we wrote to localStorage.
     */
    localStorage.setItem("token", data.token);
    tokenRef.current = data.token;

    // `data.user.id` is the authoritative, database-issued user ID
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    tokenRef.current = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
