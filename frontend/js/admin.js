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

        await this.loadStats();
        await this.loadUsers();
        await this.loadJobs();
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

    async loadStats() {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            if (res.ok) {
                const data = await res.json();
                document.getElementById("cntUsers").innerText = data.totalUsers || 0;
                document.getElementById("cntSeekers").innerText = data.totalJobSeekers || 0;
                document.getElementById("cntRecruiters").innerText = data.totalRecruiters || 0;
                document.getElementById("cntJobs").innerText = data.totalJobs || 0;
                return;
            }
        } catch (e) {}

        // Fallback computation
        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const userList = [...DEFAULT_USERS];
        Object.values(localUsers).forEach(u => {
            if (!userList.some(existing => existing.email === u.email)) {
                userList.push(u);
            }
        });

        const seekers = userList.filter(u => u.role === "JOB_SEEKER").length;
        const recruiters = userList.filter(u => u.role === "RECRUITER").length;
        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const totalJobs = FALLBACK_JOBS.length + localJobs.length;

        document.getElementById("cntUsers").innerText = userList.length;
        document.getElementById("cntSeekers").innerText = seekers;
        document.getElementById("cntRecruiters").innerText = recruiters;
        document.getElementById("cntJobs").innerText = totalJobs;
    },

    async loadUsers() {
        let users = [];
        try {
            const res = await fetch(`${API_BASE}/users`);
            if (res.ok) users = await res.json();
        } catch (e) {}

        if (!Array.isArray(users) || users.length === 0) {
            const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
            users = [...DEFAULT_USERS];
            Object.values(localUsers).forEach(u => {
                if (!users.some(existing => existing.email === u.email)) users.push(u);
            });
        }

        const tbody = document.getElementById("usersTableBody");
        if (!tbody) return;

        let html = "";
        users.forEach(u => {
            let roleBadge = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
            if (u.role === 'ADMIN') roleBadge = "bg-rose-500/20 text-rose-300 border-rose-500/30";
            else if (u.role === 'RECRUITER') roleBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30";

            html += `
                <tr class="hover:bg-slate-900/50 transition">
                    <td class="px-4 py-3 text-xs text-slate-500 font-mono">#${u.id || 1}</td>
                    <td class="px-4 py-3 font-bold text-white text-sm">${escapeHTML(u.name || 'User')}</td>
                    <td class="px-4 py-3 text-xs text-slate-400">${escapeHTML(u.email || 'N/A')}</td>
                    <td class="px-4 py-3">
                        <span class="inline-block text-[10px] px-2 py-0.5 rounded border ${roleBadge} font-semibold">${u.role || 'JOB_SEEKER'}</span>
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-400">${escapeHTML(u.title || u.role || 'Platform User')}</td>
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

    async loadJobs() {
        let jobs = [];
        try {
            const res = await fetch(`${API_BASE}/jobs`);
            if (res.ok) jobs = await res.json();
        } catch (e) {}

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const combined = (Array.isArray(jobs) && jobs.length > 0) ? [...jobs, ...localJobs] : [...FALLBACK_JOBS, ...localJobs];

        const tbody = document.getElementById("jobsTableBody");
        if (!tbody) return;

        let html = "";
        combined.forEach(j => {
            html += `
                <tr class="hover:bg-slate-900/50 transition">
                    <td class="px-4 py-3 text-xs text-slate-500 font-mono">#${j.id}</td>
                    <td class="px-4 py-3 font-bold text-white text-sm">${escapeHTML(j.title)}</td>
                    <td class="px-4 py-3 text-xs text-indigo-400 font-semibold">${escapeHTML(j.company)}</td>
                    <td class="px-4 py-3 text-xs text-slate-300">${escapeHTML(j.category || 'Tech')}</td>
                    <td class="px-4 py-3 text-xs text-slate-400">${escapeHTML(j.location)}</td>
                    <td class="px-4 py-3 text-xs text-emerald-400 font-semibold">${escapeHTML(j.salary)}</td>
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

    async deleteUser(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        delete localUsers[id];
        localStorage.setItem("registered_users", JSON.stringify(localUsers));

        try {
            await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
        } catch (e) {}

        alert("User account removed.");
        this.loadStats();
        this.loadUsers();
    },

    async deleteJob(id) {
        if (!confirm("Are you sure you want to delete this job listing?")) return;

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const updated = localJobs.filter(j => j.id != id);
        localStorage.setItem("local_jobs", JSON.stringify(updated));

        try {
            await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
        } catch (e) {}

        alert("Job opening removed.");
        this.loadStats();
        this.loadJobs();
    }
};

// Global bridging
function switchAdminTab(t) { Admin.switchTab(t); }
function loadAdminStats() { Admin.loadStats(); }
function loadUsers() { Admin.loadUsers(); }
function loadJobs() { Admin.loadJobs(); }
function deleteUser(id) { Admin.deleteUser(id); }
function deleteJob(id) { Admin.deleteJob(id); }
