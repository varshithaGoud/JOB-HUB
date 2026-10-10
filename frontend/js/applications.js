/**
 * JobHub - Applications Module
 * Handles candidate dashboard, tracking application status, and cancellations
 */

const Applications = {
    async init() {
        const user = Auth.getUser();
        if (!user) {
            alert("Please log in to view your application dashboard.");
            window.location.href = "login.html";
            return;
        }

        const candidateName = document.getElementById("candidateName");
        const candidateEmail = document.getElementById("candidateEmail");
        const candidateAvatar = document.getElementById("candidateAvatar");

        if (candidateName) candidateName.innerText = `${user.name}'s Dashboard`;
        if (candidateEmail) candidateEmail.innerText = user.email;
        if (candidateAvatar) candidateAvatar.innerText = user.name.charAt(0).toUpperCase();

        await this.loadApplications(user.id);
    },

    async loadApplications(userId) {
        let remoteApps = [];

        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = setTimeout(() => controller && controller.abort(), 2500);

            const res = await fetch(`${API_BASE}/applications/user/${userId}`, controller ? { signal: controller.signal } : {});
            clearTimeout(timeoutId);

            if (res.ok) {
                remoteApps = await res.json();
            }
        } catch (e) {
            console.log("Using local application storage:", e.message);
        }

        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const userLocalApps = localApps.filter(a => String(a.userId) === String(userId));

        // Deduplicate
        const appMap = {};
        userLocalApps.forEach(a => { appMap[a.jobId] = a; });
        if (Array.isArray(remoteApps)) {
            remoteApps.forEach(a => { appMap[a.jobId] = a; });
        }

        const combined = Object.values(appMap);
        this.updateCounts(combined);
        this.render(combined);
    },

    updateCounts(apps) {
        const cntTotal = document.getElementById("cntTotal");
        const cntPending = document.getElementById("cntPending");
        const cntAccepted = document.getElementById("cntAccepted");
        const cntRejected = document.getElementById("cntRejected");

        let pending = 0, accepted = 0, rejected = 0;
        apps.forEach(a => {
            const st = (a.status || "PENDING").toUpperCase();
            if (st === "ACCEPTED") accepted++;
            else if (st === "REJECTED") rejected++;
            else pending++;
        });

        if (cntTotal) cntTotal.innerText = apps.length;
        if (cntPending) cntPending.innerText = pending;
        if (cntAccepted) cntAccepted.innerText = accepted;
        if (cntRejected) cntRejected.innerText = rejected;
    },

    render(apps) {
        const container = document.getElementById("applicationsContainer");
        if (!container) return;

        if (apps.length === 0) {
            container.innerHTML = `
                <div class="glass-panel p-8 sm:p-12 text-center rounded-2xl border border-slate-800">
                    <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl mx-auto mb-4">
                        <i class="fas fa-file-invoice"></i>
                    </div>
                    <h3 class="text-white font-bold text-lg mb-1">No Applications Submitted Yet</h3>
                    <p class="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                        Explore verified openings today to track your hiring status right here.
                    </p>
                    <a href="jobs.html" class="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition">
                        <i class="fas fa-search"></i> Browse All Openings
                    </a>
                </div>
            `;
            return;
        }

        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        const allAvailableJobs = [...FALLBACK_JOBS, ...localJobs];

        let html = "";
        apps.forEach(app => {
            const job = allAvailableJobs.find(j => j.id == app.jobId) || {
                title: "Job Position #" + app.jobId,
                company: "Tech Enterprise",
                location: "Remote",
                salary: "Competitive"
            };

            let badgeClass = "bg-amber-500/10 text-amber-300 border-amber-500/20";
            let badgeText = "Pending Review";
            let iconClass = "fa-hourglass-half";

            const st = (app.status || "PENDING").toUpperCase();
            if (st === "ACCEPTED") {
                badgeClass = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
                badgeText = "Accepted / Offer Extended";
                iconClass = "fa-check-circle";
            } else if (st === "REJECTED") {
                badgeClass = "bg-rose-500/10 text-rose-300 border-rose-500/20";
                badgeText = "Declined";
                iconClass = "fa-times-circle";
            } else if (st === "UNDER_REVIEW") {
                badgeClass = "bg-blue-500/10 text-blue-300 border-blue-500/20";
                badgeText = "Under Review";
                iconClass = "fa-search";
            }

            const initial = job.company ? job.company.charAt(0).toUpperCase() : 'J';

            html += `
                <div class="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                ${initial}
                            </div>
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-white mb-0.5">${escapeHTML(job.title)}</h3>
                                <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                    <span class="text-indigo-400 font-semibold">${escapeHTML(job.company)}</span>
                                    <span>&bull;</span>
                                    <span><i class="fas fa-map-marker-alt text-rose-400 text-[10px] mr-1"></i>${escapeHTML(job.location)}</span>
                                    <span>&bull;</span>
                                    <span class="text-emerald-400"><i class="fas fa-dollar-sign text-[10px]"></i>${escapeHTML(job.salary)}</span>
                                </div>
                                ${app.coverLetter ? `
                                    <p class="text-xs text-slate-400 mt-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 italic max-w-xl">
                                        "${escapeHTML(app.coverLetter)}"
                                    </p>
                                ` : ''}
                            </div>
                        </div>

                        <div class="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}">
                                <i class="fas ${iconClass} text-[10px]"></i> ${badgeText}
                            </span>
                            <span class="text-[11px] text-slate-500">
                                <i class="far fa-calendar-alt mr-1"></i>Applied: ${app.appliedDate || 'Recently'}
                            </span>
                            <button onclick="Applications.withdraw(${app.id || app.jobId})" class="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition flex items-center gap-1">
                                <i class="fas fa-trash-alt text-[10px]"></i> Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    async withdraw(id) {
        if (!confirm("Are you sure you want to withdraw this application?")) return;

        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const updated = localApps.filter(a => a.id != id && a.jobId != id);
        localStorage.setItem("local_applications", JSON.stringify(updated));

        try {
            await fetch(`${API_BASE}/applications/${id}`, { method: "DELETE" });
        } catch (e) {}

        alert("Application withdrawn successfully.");
        const user = Auth.getUser();
        if (user) this.loadApplications(user.id);
    }
};

function cancelApp(id) { Applications.withdraw(id); }
