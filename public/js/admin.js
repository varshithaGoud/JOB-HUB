/**
 * JobHub - Admin Console Module
 * Handles platform management, user directory, job listings, and aggregated analytics
 */

const Admin = {
    async init() {
        const user = Auth.getUser();
        if (!user || user.role !== "ADMIN") {
            alert("Admin authentication required.");
            window.location.href = "login.html";
            return;
        }

        // 1. Immediately render local/fallback state so UI is instant (0ms delay)
        this.computeLocalStats();
        this.renderUserTable(this.getLocalUsers());
        this.renderJobTable(this.getLocalJobs());

        // 2. Concurrently attempt background synchronization with backend (1.5s timeout)
        await Promise.allSettled([
            this.loadStats(),
            this.loadUsers(),
            this.loadJobs()
        ]);
    },

    switchTab(tab) {
        const usersSec = document.getElementById("usersSection");
        const jobsSec = document.getElementById("jobsSection");
        const tabUsersBtn = document.getElementById("tabUsersBtn");
        const tabJobsBtn = document.getElementById("tabJobsBtn");

        if (tab === 'users') {
            if (usersSec) usersSec.classList.remove("hidden");
            if (jobsSec) jobsSec.classList.add("hidden");
            if (tabUsersBtn) tabUsersBtn.className = "px-4 py-2 rounded-lg text-xs font-bold transition bg-rose-500/20 text-rose-300 border border-rose-500/30";
            if (tabJobsBtn) tabJobsBtn.className = "px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white";
        } else {
            if (usersSec) usersSec.classList.add("hidden");
            if (jobsSec) jobsSec.classList.remove("hidden");
            if (tabJobsBtn) tabJobsBtn.className = "px-4 py-2 rounded-lg text-xs font-bold transition bg-rose-500/20 text-rose-300 border border-rose-500/30";
            if (tabUsersBtn) tabUsersBtn.className = "px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white";
        }
    },

    computeLocalStats() {
        const deletedUsers = JSON.parse(localStorage.getItem("deleted_user_ids") || "[]");
        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const baseUsers = typeof DEFAULT_USERS !== 'undefined' ? [...DEFAULT_USERS] : [];
        const userList = baseUsers.filter(u => !deletedUsers.includes(u.id));

        Object.values(localUsers).forEach(u => {
            if (!deletedUsers.includes(u.id) && !userList.some(existing => existing.email === u.email)) {
                userList.push(u);
            }
        });

        const seekers = userList.filter(u => u.role === "JOB_SEEKER").length;
        const recruiters = userList.filter(u => u.role === "RECRUITER").length;

        const deletedJobs = JSON.parse(localStorage.getItem("deleted_job_ids") || "[]");
        const baseJobs = (typeof FALLBACK_JOBS !== 'undefined' ? FALLBACK_JOBS : []).filter(j => !deletedJobs.includes(j.id));
        const localJobs = (JSON.parse(localStorage.getItem("local_jobs") || "[]")).filter(j => !deletedJobs.includes(j.id));
        const totalJobs = baseJobs.length + localJobs.length;

        const cntUsers = document.getElementById("cntUsers");
        const cntSeekers = document.getElementById("cntSeekers");
        const cntRecruiters = document.getElementById("cntRecruiters");
        const cntJobs = document.getElementById("cntJobs");

        if (cntUsers) cntUsers.innerText = userList.length;
        if (cntSeekers) cntSeekers.innerText = seekers;
        if (cntRecruiters) cntRecruiters.innerText = recruiters;
        if (cntJobs) cntJobs.innerText = totalJobs;
    },

    async loadStats() {
        this.computeLocalStats();

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), 1500) : null;
            const res = await fetch(`${API_BASE}/stats`, controller ? { signal: controller.signal } : {});
            if (timeoutId) clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && typeof data.totalUsers !== 'undefined') {
                    const cntUsers = document.getElementById("cntUsers");
                    const cntSeekers = document.getElementById("cntSeekers");
                    const cntRecruiters = document.getElementById("cntRecruiters");
                    const cntJobs = document.getElementById("cntJobs");

                    if (cntUsers) cntUsers.innerText = data.totalUsers || 0;
                    if (cntSeekers) cntSeekers.innerText = data.totalJobSeekers || 0;
                    if (cntRecruiters) cntRecruiters.innerText = data.totalRecruiters || 0;
                    if (cntJobs) cntJobs.innerText = data.totalJobs || 0;
                }
            }
        } catch (e) {
            // Keep the already computed local stats
        }
    },

    getLocalUsers() {
        const deletedUsers = JSON.parse(localStorage.getItem("deleted_user_ids") || "[]");
        const baseUsers = typeof DEFAULT_USERS !== 'undefined' ? [...DEFAULT_USERS] : [];
        const userList = baseUsers.filter(u => !deletedUsers.includes(u.id));

        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        Object.values(localUsers).forEach(u => {
            if (!deletedUsers.includes(u.id) && !userList.some(existing => existing.email === u.email)) {
                userList.push(u);
            }
        });
        return userList;
    },

    renderUserTable(users) {
        const tbody = document.getElementById("usersTableBody");
        if (!tbody) return;

        if (!users || users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-500 text-xs">No registered users found.</td></tr>`;
            return;
        }

        let html = "";
        users.forEach(u => {
            let roleBadge = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
            if (u.role === 'ADMIN') roleBadge = "bg-rose-500/20 text-rose-300 border-rose-500/30";
            else if (u.role === 'RECRUITER') roleBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30";

            const safeName = typeof escapeHTML === 'function' ? escapeHTML(u.name || 'User') : (u.name || 'User');
            const safeEmail = typeof escapeHTML === 'function' ? escapeHTML(u.email || 'N/A') : (u.email || 'N/A');
            const safeTitle = typeof escapeHTML === 'function' ? escapeHTML(u.title || u.role || 'Platform User') : (u.title || u.role || 'Platform User');

            html += `
                <tr class="hover:bg-slate-900/50 transition">
                    <td class="px-4 py-3 text-xs text-slate-500 font-mono">#${u.id || 1}</td>
                    <td class="px-4 py-3 font-bold text-white text-sm">${safeName}</td>
                    <td class="px-4 py-3 text-xs text-slate-400">${safeEmail}</td>
                    <td class="px-4 py-3">
                        <span class="inline-block text-[10px] px-2 py-0.5 rounded border ${roleBadge} font-semibold">${u.role || 'JOB_SEEKER'}</span>
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-400">${safeTitle}</td>
                    <td class="px-4 py-3 text-right">
                        ${u.role !== 'ADMIN' ? `
                            <button onclick="Admin.deleteUser(${u.id})" class="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition">
                                <i class="fas fa-trash-alt text-[10px] mr-1"></i> Delete
                            </button>
                        ` : '<span class="text-slate-600 text-xs italic">Protected</span>'}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    async loadUsers() {
        this.renderUserTable(this.getLocalUsers());

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), 1500) : null;
            const res = await fetch(`${API_BASE}/users`, controller ? { signal: controller.signal } : {});
            if (timeoutId) clearTimeout(timeoutId);

            if (res.ok) {
                const remoteUsers = await res.json();
                if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
                    const deletedUsers = JSON.parse(localStorage.getItem("deleted_user_ids") || "[]");
                    const merged = [...remoteUsers.filter(u => !deletedUsers.includes(u.id))];
                    const localRegistered = JSON.parse(localStorage.getItem("registered_users") || "{}");
                    Object.values(localRegistered).forEach(u => {
                        if (!deletedUsers.includes(u.id) && !merged.some(m => m.email === u.email)) {
                            merged.push(u);
                        }
                    });
                    this.renderUserTable(merged);
                }
            }
        } catch (e) {
            // Keep local table
        }
    },

    getLocalJobs() {
        const deletedJobs = JSON.parse(localStorage.getItem("deleted_job_ids") || "[]");
        const baseJobs = (typeof FALLBACK_JOBS !== 'undefined' ? FALLBACK_JOBS : []).filter(j => !deletedJobs.includes(j.id));
        const localJobs = (JSON.parse(localStorage.getItem("local_jobs") || "[]")).filter(j => !deletedJobs.includes(j.id));
        return [...baseJobs, ...localJobs];
    },

    renderJobTable(jobs) {
        const tbody = document.getElementById("jobsTableBody");
        if (!tbody) return;

        if (!jobs || jobs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-500 text-xs">No active job listings found.</td></tr>`;
            return;
        }

        let html = "";
        jobs.forEach(j => {
            const safeTitle = typeof escapeHTML === 'function' ? escapeHTML(j.title) : j.title;
            const safeCompany = typeof escapeHTML === 'function' ? escapeHTML(j.company) : j.company;
            const safeCategory = typeof escapeHTML === 'function' ? escapeHTML(j.category || 'Tech') : (j.category || 'Tech');
            const safeLocation = typeof escapeHTML === 'function' ? escapeHTML(j.location) : j.location;
            const safeSalary = typeof escapeHTML === 'function' ? escapeHTML(j.salary) : j.salary;

            html += `
                <tr class="hover:bg-slate-900/50 transition">
                    <td class="px-4 py-3 text-xs text-slate-500 font-mono">#${j.id}</td>
                    <td class="px-4 py-3 font-bold text-white text-sm">${safeTitle}</td>
                    <td class="px-4 py-3 text-xs text-indigo-400 font-semibold">${safeCompany}</td>
                    <td class="px-4 py-3 text-xs text-slate-300">${safeCategory}</td>
                    <td class="px-4 py-3 text-xs text-slate-400">${safeLocation}</td>
                    <td class="px-4 py-3 text-xs text-emerald-400 font-semibold">${safeSalary}</td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="Admin.deleteJob(${j.id})" class="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition">
                            <i class="fas fa-trash-alt text-[10px] mr-1"></i> Remove
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    async loadJobs() {
        this.renderJobTable(this.getLocalJobs());

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), 1500) : null;
            const res = await fetch(`${API_BASE}/jobs`, controller ? { signal: controller.signal } : {});
            if (timeoutId) clearTimeout(timeoutId);

            if (res.ok) {
                const remoteJobs = await res.json();
                if (Array.isArray(remoteJobs) && remoteJobs.length > 0) {
                    const deletedJobs = JSON.parse(localStorage.getItem("deleted_job_ids") || "[]");
                    const localJobs = (JSON.parse(localStorage.getItem("local_jobs") || "[]")).filter(j => !deletedJobs.includes(j.id));
                    const combined = [...remoteJobs.filter(j => !deletedJobs.includes(j.id)), ...localJobs];
                    this.renderJobTable(combined);
                }
            }
        } catch (e) {
            // Keep local table
        }
    },

    async deleteUser(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        delete localUsers[id];
        localStorage.setItem("registered_users", JSON.stringify(localUsers));

        let deletedUsers = JSON.parse(localStorage.getItem("deleted_user_ids") || "[]");
        if (!deletedUsers.includes(id)) {
            deletedUsers.push(id);
            localStorage.setItem("deleted_user_ids", JSON.stringify(deletedUsers));
        }

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), 1500) : null;
            await fetch(`${API_BASE}/users/${id}`, { method: "DELETE", signal: controller ? controller.signal : undefined });
            if (timeoutId) clearTimeout(timeoutId);
        } catch (e) {}

        alert("User account removed.");
        this.computeLocalStats();
        this.renderUserTable(this.getLocalUsers());
    },

    async deleteJob(id) {
        if (!confirm("Are you sure you want to delete this job listing?")) return;

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const updated = localJobs.filter(j => j.id != id);
        localStorage.setItem("local_jobs", JSON.stringify(updated));

        let deletedJobs = JSON.parse(localStorage.getItem("deleted_job_ids") || "[]");
        if (!deletedJobs.includes(id)) {
            deletedJobs.push(id);
            localStorage.setItem("deleted_job_ids", JSON.stringify(deletedJobs));
        }

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), 1500) : null;
            await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE", signal: controller ? controller.signal : undefined });
            if (timeoutId) clearTimeout(timeoutId);
        } catch (e) {}

        alert("Job opening removed.");
        this.computeLocalStats();
        this.renderJobTable(this.getLocalJobs());
    }
};

// Global bridging
function switchAdminTab(t) { Admin.switchTab(t); }
function loadAdminStats() { Admin.loadStats(); }
function loadUsers() { Admin.loadUsers(); }
function loadJobs() { Admin.loadJobs(); }
function deleteUser(id) { Admin.deleteUser(id); }
function deleteJob(id) { Admin.deleteJob(id); }
