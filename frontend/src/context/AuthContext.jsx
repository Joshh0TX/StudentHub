import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// keep the hook with the context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
