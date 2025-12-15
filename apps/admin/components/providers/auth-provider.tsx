"use client";

import React, { createContext, useContext } from "react";
import { type Session, type User, can as checkPermission, type role, type entity, type action } from "@void/auth";

// تعريف شكل الـ Context
interface AuthContextType {
    session: Session | null;
    user: User | null;
    isAuthenticated: boolean;
    // دالة مساعدة للتحقق من الصلاحيات داخل الكومبوننت
    can: (resource: entity, action: action) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    initialSession: Session | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {

    // دالة التحقق من الصلاحيات بناءً على دور المستخدم الحالي
    const can = (resource: entity, action: action) => {
        if (!initialSession?.user) return false;
        // نفترض أن الدور مخزن في الـ user (يأتي من admin plugin)
        const userRole = (initialSession.user as any).role as role;
        return checkPermission(userRole || "user", resource, action);
    };

    return (
        <AuthContext.Provider
            value={{
                session: initialSession,
                user: initialSession?.user || null,
                isAuthenticated: !!initialSession,
                can,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook مخصص لسهولة الاستخدام
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}