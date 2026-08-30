import { apiFetch } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { normalizeUser } from "@/models/userModel";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refresh = async () => {
        try {
            const res = await apiFetch("/api/auth/me", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(normalizeUser(data.user));
            }
            else {
                setUser(null);
            }
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        refresh();
    }, []);
    const login = async (email, password, role) => {
        const res = await apiFetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
            credentials: "include",
        });
        const data = await res.json();
        if (!res.ok)
            throw new Error(data.error || "Login failed");
        setUser(normalizeUser(data.user));
    };
    const register = async (name, email, password, confirmPassword) => {
        const res = await apiFetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, confirmPassword }),
            credentials: "include",
        });
        const data = await res.json();
        if (!res.ok)
            throw new Error(data.error || "Registration failed");
        setUser(normalizeUser(data.user));
    };
    const googleLogin = async (payload) => {
        const res = await apiFetch("/api/auth/google", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok)
            throw new Error(data.error || "Google login failed");
        setUser(normalizeUser(data.user));
    };
    const logout = async () => {
        await apiFetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
    };
    return (<AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, refresh }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
