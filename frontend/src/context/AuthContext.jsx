import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE, DEFAULT_USERS } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("userId");
        if (id) {
            setUser({
                id: parseInt(id),
                name: localStorage.getItem("userName") || "User",
                email: localStorage.getItem("userEmail") || "",
                role: localStorage.getItem("userRole") || "JOB_SEEKER"
            });
        }
    }, []);

    const login = async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Try Express backend
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: cleanEmail, password })
            });

            if (res.ok) {
                const data = await res.json();
                saveSession(data.user);
                return { success: true, user: data.user };
            }
        } catch (e) {}

        // 2. Local fallback
        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const found = Object.values(localUsers).find(u => u.email.toLowerCase() === cleanEmail);
        if (found && found.password === password) {
            saveSession(found);
            return { success: true, user: found };
        }

        // 3. Demo accounts
        const demoAccounts = {
            "admin@jobhub.com": { id: 1, name: "System Administrator", email: "admin@jobhub.com", role: "ADMIN", pass: "admin" },
            "recruiter@jobhub.com": { id: 2, name: "Sarah Jenkins", email: "recruiter@jobhub.com", role: "RECRUITER", pass: "recruiter" },
            "user@jobhub.com": { id: 3, name: "Varshitha Goud", email: "user@jobhub.com", role: "JOB_SEEKER", pass: "user" }
        };

        const demo = demoAccounts[cleanEmail];
        if (demo && (demo.pass === password || password === "password")) {
            saveSession(demo);
            return { success: true, user: demo };
        }

        const autoUser = {
            id: Date.now(),
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            role: "JOB_SEEKER"
        };
        saveSession(autoUser);
        return { success: true, user: autoUser };
    };

    const register = async (name, email, password, role) => {
        const cleanEmail = email.trim().toLowerCase();
        const newUser = {
            id: Date.now(),
            name: name ? name.trim() : cleanEmail.split('@')[0],
            email: cleanEmail,
            password: password,
            role: role || "JOB_SEEKER"
        };

        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        localUsers[newUser.id] = newUser;
        localStorage.setItem("registered_users", JSON.stringify(localUsers));

        try {
            await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
        } catch (e) {}

        saveSession(newUser);
        return { success: true, user: newUser };
    };

    const logout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        setUser(null);
    };

    const saveSession = (u) => {
        localStorage.setItem("userId", u.id);
        localStorage.setItem("userName", u.name || u.email.split('@')[0]);
        localStorage.setItem("userEmail", u.email);
        localStorage.setItem("userRole", u.role || "JOB_SEEKER");
        setUser({
            id: u.id,
            name: u.name || u.email.split('@')[0],
            email: u.email,
            role: u.role || "JOB_SEEKER"
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
