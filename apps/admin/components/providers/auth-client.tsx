"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Session } from "@void/auth";

const AuthContext = createContext<{ session: Session; user: Session["user"] } | null>(null);

// تأكد من وجود كلمة export هنا
export function AuthContextClient({ 
  children, 
  initialSession 
}: { 
  children: ReactNode; 
  initialSession: Session; 
}) {
  return (
    <AuthContext.Provider value={{ session: initialSession, user: initialSession.user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthGuard");
  return context;
};