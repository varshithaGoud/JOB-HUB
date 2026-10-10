/**
 * JobHub - Recruiter Console Module
 * Handles job postings, metrics, applicant review, and status transitions
 */

const Recruiter = {
    async init() {
        const user = Auth.getUser();
        if (!user) {
            alert("Please sign in first.");
            window.location.href = "login.html";
            return;
        }

        if (user.role !== "RECRUITER" && user.role !== "ADMIN") {
            alert("Access restricted to Recruiter accounts.");
            window.location.href = "index.html";
            return;
        }

        const nameEl = document.getElementById("recruiterName");
        const emailEl = document.getElementById("recruiterEmail");
        const avatarEl = document.getElementById("recruiterAvatar");

        if (nameEl) nameEl.innerText = `${user.name} Console`;
        if (emailEl) emailEl.innerText = user.email;
        if (avatarEl) avatarEl.innerText = user.name.charAt(0).toUpperCase();

        await this.loadData();
    },

    async loadData() {
        const user = Auth.getUser();
        let jobs = [];

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = setTimeout(() => controller && controller.abort(), 2500);

            const res = await fetch(`${API_BASE}/jobs`, controller ? { signal: controller.signal } : {});
            clearTimeout(timeoutId);

            if (res.ok) jobs = await res.json();
        } catch (e) {
            console.log("Using cached/fallback jobs for recruiter:", e.message);
        }

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const combinedJobs = [...jobs, ...localJobs];
        
        // Filter jobs by current recruiter if not admin
        const recruiterJobs = user.role === "ADMIN" 
            ? combinedJobs 
            : combinedJobs.filter(j => !j.recruiterId || j.recruiterId === user.id);

        // Fetch applications
        let remoteApps = [];
        try {
            const appsRes = await fetch(`${API_BASE}/applications`);
            if (appsRes.ok) remoteApps = await appsRes.json();
        } catch (e) {}

        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const appMap = {};
        localApps.forEach(a => { appMap[a.id || (a.jobId + '-' + a.userId)] = a; });
        remoteApps.forEach(a => { appMap[a.id || (a.jobId + '-' + a.userId)] = a; });
        const allApps = Object.values(appMap);

        const recruiterJobIds = new Set(recruiterJobs.map(j => j.id));
        const relevantApps = allApps.filter(a => recruiterJobIds.has(a.jobId));

        // Update stats
        const cntListings = document.getElementById("cntListings");
        const cntTotalApps = document.getElementById("cntTotalApps");
        const cntPendingApps = document.getElementById("cntPendingApps");

        if (cntListings) cntListings.innerText = recruiterJobs.length;
        if (cntTotalApps) cntTotalApps.innerText = relevantApps.length;
        if (cntPendingApps) cntPendingApps.innerText = relevantApps.filter(a => (a.status || 'PENDING').toUpperCase() === 'PENDING').length;

        this.renderJobs(recruiterJobs, relevantApps);
    },

    renderJobs(jobs, allApps) {
        const container = document.getElementById("jobsList");
        if (!container) return;

        if (jobs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-briefcase text-slate-500 text-3xl mb-3"></i>
                    <h4 class="text-white font-bold">No Openings Posted Yet</h4>
                    <p class="text-slate-400 text-xs mt-1">Click "Post New Job Opening" to publish your first position.</p>
                </div>
            `;
            return;
        }

        let html = "";
        jobs.forEach(job => {
            const jobApps = allApps.filter(a => a.jobId === job.id);
            const pendingCount = jobApps.filter(a => (a.status || 'PENDING').toUpperCase() === 'PENDING').length;
            const initial = job.company ? job.company.charAt(0).toUpperCase() : 'C';

            html += `
                <div class="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                ${initial}
                            </div>
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-white mb-0.5">${escapeHTML(job.title)}</h3>
                                <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                    <span class="text-amber-400 font-semibold">${escapeHTML(job.company)}</span>
                                    <span>&bull;</span>
                                    <span><i class="fas fa-map-marker-alt text-rose-400 text-[10px] mr-1"></i>${escapeHTML(job.location)}</span>
                                    <span>&bull;</span>
                                    <span class="text-emerald-400"><i class="fas fa-dollar-sign text-[10px]"></i>${escapeHTML(job.salary)}</span>
                                </div>
                                <div class="flex flex-wrap gap-1.5 mt-2">
                                    <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">${escapeHTML(job.category || 'Engineering')}</span>
                                    <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">${escapeHTML(job.jobType || 'Full Time')}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                            <button onclick="Recruiter.openApplicants(${job.id}, '${escapeHTML(job.title).replace(/'/g, "\\'")}')" class="btn-amber-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-amber-500/20 transition flex items-center gap-1.5">
                                <i class="fas fa-users"></i> Review Candidates (${jobApps.length})
                                ${pendingCount > 0 ? `<span class="bg-white text-amber-600 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-1">${pendingCount} new</span>` : ''}
                            </button>
                            <button onclick="Recruiter.deleteJob(${job.id})" class="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition flex items-center gap-1">
                                <i class="fas fa-trash-alt text-[10px]"></i> Delete Opening
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Post Job Form Handler
    async publishJob(e) {
        if (e) e.preventDefault();
        const user = Auth.getUser();

        const job = {
            id: Date.now(),
            title: document.getElementById("jobTitle").value.trim(),
            company: document.getElementById("jobCompany").value.trim(),
            location: document.getElementById("jobLocation").value.trim(),
            salary: document.getElementById("jobSalary").value.trim(),
            jobType: document.getElementById("jobType").value,
            category: document.getElementById("jobCategory").value,
            description: document.getElementById("jobDescription").value.trim(),
            recruiterId: user ? user.id : 2
        };

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        localJobs.push(job);
        localStorage.setItem("local_jobs", JSON.stringify(localJobs));

        // Sync with Express backend
        try {
            await fetch(`${API_BASE}/jobs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job)
            });
        } catch (e) {}

        alert("Opening successfully published!");
        this.closeAddModal();
        this.loadData();
    },

    openAddModal() {
        const modal = document.getElementById("addJobModal");
        if (modal) modal.classList.remove("hidden");
    },

    closeAddModal() {
        const modal = document.getElementById("addJobModal");
        if (modal) modal.classList.add("hidden");
    },

    // Review Applicants Modal
    async openApplicants(jobId, jobTitle) {
        const titleEl = document.getElementById("applicantsModalTitle");
        const bodyEl = document.getElementById("applicantsModalBody");
        const modal = document.getElementById("applicantsModal");

        if (titleEl) titleEl.innerText = `Applicants for: ${jobTitle}`;
        if (bodyEl) bodyEl.innerHTML = `<div class="text-center py-8"><div class="inline-block animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-3"></div></div>`;
        if (modal) modal.classList.remove("hidden");

        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const localMatches = localApps.filter(a => a.jobId == jobId);

        let remoteApps = [];
        let users = [];

        try {
            const [appsRes, usersRes] = await Promise.all([
                fetch(`${API_BASE}/applications/job/${jobId}`).catch(() => null),
                fetch(`${API_BASE}/users`).catch(() => null)
            ]);
            if (appsRes && appsRes.ok) remoteApps = await appsRes.json();
            if (usersRes && usersRes.ok) users = await usersRes.json();
        } catch (e) {}

        const userMap = {};
        users.forEach(u => userMap[u.id] = u);

        const appMap = {};
        localMatches.forEach(a => { appMap[a.id || (a.jobId + '-' + a.userId)] = a; });
        remoteApps.forEach(a => { appMap[a.id || (a.jobId + '-' + a.userId)] = a; });
        const apps = Object.values(appMap);

        if (apps.length === 0) {
            bodyEl.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-inbox text-slate-500 text-3xl mb-2"></i>
                    <h4 class="text-white font-bold">No applications submitted yet</h4>
                    <p class="text-slate-400 text-xs">Candidates will appear here once they apply.</p>
                </div>
            `;
            return;
        }

        let html = `<div class="space-y-3">`;
        apps.forEach(app => {
            const applicant = userMap[app.userId] || {
                name: app.applicantName || "Candidate #" + (app.userId || "101"),
                email: app.applicantEmail || "applicant@jobhub.com"
            };
            const status = (app.status || "PENDING").toUpperCase();

            let badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/20";
            if (status === "ACCEPTED") badgeColor = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
            else if (status === "REJECTED") badgeColor = "bg-rose-500/10 text-rose-300 border-rose-500/20";
            else if (status === "UNDER_REVIEW") badgeColor = "bg-blue-500/10 text-blue-300 border-blue-500/20";

            html += `
                <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="text-white font-bold text-sm">${escapeHTML(applicant.name)}</h4>
                            <span class="text-xs text-slate-400">${escapeHTML(applicant.email)}</span>
                        </div>
                        <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeColor} font-semibold">${status}</span>
                    </div>

                    ${app.coverLetter ? `
                        <div class="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 italic mb-3">
                            "${escapeHTML(app.coverLetter)}"
                        </div>
                    ` : ''}

                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                        <div>
                            ${app.resumeUrl ? `
                                <a href="${escapeHTML(app.resumeUrl)}" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
                                    <i class="fas fa-external-link-alt text-[10px]"></i> View Resume / Portfolio
                                </a>
                            ` : '<span class="text-slate-500 text-[11px]">No link provided</span>'}
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button onclick="Recruiter.updateStatus(${app.id}, 'UNDER_REVIEW', ${jobId}, '${escapeHTML(jobTitle).replace(/'/g, "\\'")}')" class="text-[11px] px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 font-medium">
                                Review
                            </button>
                            <button onclick="Recruiter.updateStatus(${app.id}, 'ACCEPTED', ${jobId}, '${escapeHTML(jobTitle).replace(/'/g, "\\'")}')" class="text-[11px] px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 font-medium">
                                Accept
                            </button>
                            <button onclick="Recruiter.updateStatus(${app.id}, 'REJECTED', ${jobId}, '${escapeHTML(jobTitle).replace(/'/g, "\\'")}')" class="text-[11px] px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 font-medium">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        bodyEl.innerHTML = html;
    },

    closeApplicants() {
        const modal = document.getElementById("applicantsModal");
        if (modal) modal.classList.add("hidden");
    },

    async updateStatus(appId, newStatus, jobId, jobTitle) {
        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const idx = localApps.findIndex(a => a.id == appId);
        if (idx >= 0) {
            localApps[idx].status = newStatus;
            localStorage.setItem("local_applications", JSON.stringify(localApps));
        }

        try {
            await fetch(`${API_BASE}/applications/${appId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {}

        this.openApplicants(jobId, jobTitle);
        this.loadData();
    },

    async deleteJob(id) {
        if (!confirm("Are you sure you want to delete this job listing?")) return;

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const updated = localJobs.filter(j => j.id != id);
        localStorage.setItem("local_jobs", JSON.stringify(updated));

        try {
            await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
        } catch (e) {}

        alert("Job removed.");
        this.loadData();
    }
};

// Global bridging
function loadRecruiterData() { Recruiter.loadData(); }
function handleAddJob(e) { Recruiter.publishJob(e); }
function openAddJobModal() { Recruiter.openAddModal(); }
function closeAddJobModal() { Recruiter.closeAddModal(); }
function openApplicantsModal(id, title) { Recruiter.openApplicants(id, title); }
function closeApplicantsModal() { Recruiter.closeApplicants(); }
function updateAppStatus(appId, st, jId, jTitle) { Recruiter.updateStatus(appId, st, jId, jTitle); }
function deleteJob(id) { Recruiter.deleteJob(id); }
