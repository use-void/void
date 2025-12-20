"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Session, User } from "@void/auth";

interface AuthContextType {
  user: User;
  session: Session;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextClient({ 
  children, 
  initialSession 
}: { 
  children: ReactNode; 
  initialSession: Session; 
}) {
  return (
    <AuthContext.Provider value={{ user: initialSession.user, session: initialSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};