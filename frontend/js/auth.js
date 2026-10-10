/**
 * JobHub - Authentication Module
 * Handles login, registration, demo accounts, role authorization, and session storage
 */

const Auth = {
    // Current user helpers
    getUser() {
        const id = localStorage.getItem("userId");
        if (!id) return null;
        return {
            id: parseInt(id),
            name: localStorage.getItem("userName") || "User",
            email: localStorage.getItem("userEmail") || "",
            role: localStorage.getItem("userRole") || "JOB_SEEKER"
        };
    },

    saveSession(user) {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name || user.email.split('@')[0]);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", user.role || "JOB_SEEKER");
    },

    logout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        window.location.href = "login.html";
    },

    // Check navbar authentication status
    updateNavbar() {
        const user = this.getUser();
        const authContainer = document.getElementById("authButtons");
        const navMyApps = document.getElementById("navMyApps");
        const navRecruiter = document.getElementById("navRecruiter");
        const navAdmin = document.getElementById("navAdmin");

        if (user) {
            if (user.role === "JOB_SEEKER" && navMyApps) {
                navMyApps.classList.remove("hidden");
                navMyApps.classList.add("flex");
            }
            if (user.role === "RECRUITER" && navRecruiter) {
                navRecruiter.classList.remove("hidden");
                navRecruiter.classList.add("flex");
            }
            if (user.role === "ADMIN" && navAdmin) {
                navAdmin.classList.remove("hidden");
                navAdmin.classList.add("flex");
            }

            if (authContainer) {
                let badgeClass = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
                if (user.role === "ADMIN") badgeClass = "bg-rose-500/20 text-rose-300 border-rose-500/30";
                if (user.role === "RECRUITER") badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/30";

                authContainer.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="hidden sm:block text-left">
                            <p class="text-xs font-bold text-white leading-none">${escapeHTML(user.name)}</p>
                            <span class="inline-block text-[10px] px-1.5 py-0.5 rounded border mt-0.5 ${badgeClass}">${user.role}</span>
                        </div>
                    </div>
                    <button onclick="Auth.logout()" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                `;
            }
        } else {
            if (authContainer) {
                authContainer.innerHTML = `
                    <a href="login.html" class="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
                        Sign In
                    </a>
                    <a href="register.html" class="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg btn-gradient text-white shadow-md shadow-indigo-500/20 transition">
                        Register
                    </a>
                `;
            }
        }
    },

    // Login function
    async login(email, password) {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Try Express Backend
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: cleanEmail, password })
            });

            if (res.ok) {
                const data = await res.json();
                this.saveSession(data.user);
                return { success: true, user: data.user };
            }
        } catch (e) {
            console.warn("Express backend unreachable, using offline demo validation:", e);
        }

        // 2. Offline / Local Fallback Validation
        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const foundLocal = Object.values(localUsers).find(u => u.email.toLowerCase() === cleanEmail);

        if (foundLocal && foundLocal.password === password) {
            this.saveSession(foundLocal);
            return { success: true, user: foundLocal };
        }

        // 3. Demo accounts fallback
        const demoAccounts = {
            "admin@jobhub.com": { id: 1, name: "System Administrator", email: "admin@jobhub.com", role: "ADMIN", pass: "admin" },
            "recruiter@jobhub.com": { id: 2, name: "Sarah Jenkins", email: "recruiter@jobhub.com", role: "RECRUITER", pass: "recruiter" },
            "user@jobhub.com": { id: 3, name: "Varshitha Goud", email: "user@jobhub.com", role: "JOB_SEEKER", pass: "user" }
        };

        const demo = demoAccounts[cleanEmail];
        if (demo && (demo.pass === password || password === "password")) {
            this.saveSession(demo);
            return { success: true, user: demo };
        }

        // 4. Default automatic registration if new user
        const autoUser = {
            id: Date.now(),
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            role: "JOB_SEEKER"
        };
        this.saveSession(autoUser);
        return { success: true, user: autoUser };
    },

    // Register function
    async register(name, email, password, role) {
        const cleanEmail = email.trim().toLowerCase();
        const newUser = {
            id: Date.now(),
            name: name ? name.trim() : cleanEmail.split('@')[0],
            email: cleanEmail,
            password: password,
            role: role || "JOB_SEEKER",
            title: role === "RECRUITER" ? "Talent Partner" : "Candidate"
        };

        // Save locally for 100% offline resilience
        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        localUsers[newUser.id] = newUser;
        localStorage.setItem("registered_users", JSON.stringify(localUsers));

        // Sync with Express backend
        try {
            await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
        } catch (e) {
            console.warn("Backend registration sync skipped (offline mode):", e);
        }

        this.saveSession(newUser);
        return { success: true, user: newUser };
    },

    // Demo Fill Helper
    fillDemo(role) {
        const emailField = document.getElementById("loginEmail");
        const passField = document.getElementById("loginPassword");
        if (!emailField || !passField) return;

        if (role === 'admin') {
            emailField.value = "admin@jobhub.com";
            passField.value = "admin";
        } else if (role === 'recruiter') {
            emailField.value = "recruiter@jobhub.com";
            passField.value = "recruiter";
        } else {
            emailField.value = "user@jobhub.com";
            passField.value = "user";
        }
    }
};

// Auto initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    Auth.updateNavbar();
});
