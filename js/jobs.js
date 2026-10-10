/**
 * JobHub - Jobs Module
 * Handles job listings, real-time searching, category filtering, and modal applications
 */

const Jobs = {
    allJobs: [],
    activeCategory: "",
    selectedJobId: null,

    // Load jobs with 0ms instant display + silent Express API sync
    async init() {
        const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        this.allJobs = [...FALLBACK_JOBS, ...localJobs];
        this.render();

        // Background sync with Express backend
        try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = setTimeout(() => controller && controller.abort(), 2500);

            const res = await fetch(`${API_BASE}/jobs`, controller ? { signal: controller.signal } : {});
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    this.allJobs = [...data, ...localJobs];
                    this.render();
                }
            }
        } catch (e) {
            console.log("Using cached/fallback jobs (Express backend silent sync):", e.message);
        }
    },

    // Render cards to container
    render(filteredList = null) {
        const container = document.getElementById("jobsContainer");
        const countText = document.getElementById("jobCountText");
        const list = filteredList !== null ? filteredList : this.allJobs;

        if (countText) {
            countText.innerText = `Showing ${list.length} active position${list.length === 1 ? '' : 's'}`;
        }

        if (!container) return;

        if (list.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="glass-panel p-6 rounded-2xl max-w-md mx-auto">
                        <i class="fas fa-folder-open text-slate-500 text-4xl mb-3"></i>
                        <h3 class="text-white font-bold text-lg">No Positions Found</h3>
                        <p class="text-slate-400 text-xs mt-1">Try adjusting your keywords or clearing filters.</p>
                    </div>
                </div>
            `;
            return;
        }

        let html = "";
        list.forEach(job => {
            const initial = job.company ? job.company.charAt(0).toUpperCase() : 'J';
            const cat = job.category || 'Engineering';
            const type = job.jobType || 'Full Time';
            const loc = job.location || 'Remote';
            const salary = job.salary || 'Competitive';

            html += `
                <div class="glass-panel p-5 rounded-2xl hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between group">
                    <div>
                        <div class="flex items-start justify-between gap-3 mb-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    ${initial}
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-white group-hover:text-indigo-400 transition">${escapeHTML(job.company)}</h4>
                                    <span class="text-xs text-slate-400 flex items-center gap-1">
                                        <i class="fas fa-map-marker-alt text-rose-400 text-[10px]"></i> ${escapeHTML(loc)}
                                    </span>
                                </div>
                            </div>
                            <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                ${escapeHTML(cat)}
                            </span>
                        </div>

                        <h3 class="text-base font-bold text-white mb-2 leading-snug">${escapeHTML(job.title)}</h3>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                            ${escapeHTML(job.description || 'No description available.')}
                        </p>
                    </div>

                    <div>
                        <div class="flex flex-wrap gap-1.5 mb-4">
                            <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                <i class="far fa-clock mr-1 text-indigo-400"></i>${escapeHTML(type)}
                            </span>
                            <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                <i class="fas fa-dollar-sign mr-0.5"></i>${escapeHTML(salary)}
                            </span>
                        </div>

                        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <a href="job-details.html?id=${job.id}" class="text-xs text-slate-400 hover:text-indigo-400 transition flex items-center gap-1">
                                Details <i class="fas fa-chevron-right text-[9px]"></i>
                            </a>
                            <button onclick="Jobs.openModal(${job.id})" class="btn-gradient text-xs font-semibold px-3.5 py-1.5 rounded-lg text-white shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5">
                                Quick Apply <i class="fas fa-paper-plane text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Search and filter
    filter() {
        const queryEl = document.getElementById("searchInput");
        const locEl = document.getElementById("locationInput");
        const typeEl = document.getElementById("typeFilter");

        const query = queryEl ? queryEl.value.toLowerCase().trim() : "";
        const location = locEl ? locEl.value.toLowerCase().trim() : "";
        const type = typeEl ? typeEl.value : "";

        const filtered = this.allJobs.filter(job => {
            const matchQuery = !query || 
                (job.title && job.title.toLowerCase().includes(query)) || 
                (job.company && job.company.toLowerCase().includes(query)) ||
                (job.description && job.description.toLowerCase().includes(query));

            const matchLocation = !location || (job.location && job.location.toLowerCase().includes(location));
            const matchType = !type || job.jobType === type;
            const matchCategory = !this.activeCategory || job.category === this.activeCategory;

            return matchQuery && matchLocation && matchType && matchCategory;
        });

        this.render(filtered);
    },

    selectCategory(category, buttonEl) {
        this.activeCategory = category;
        document.querySelectorAll("#categoryPills .filter-pill").forEach(pill => {
            pill.classList.remove("active");
        });
        if (buttonEl) {
            buttonEl.classList.add("active");
        }
        this.filter();
    },

    // Modal Handling
    openModal(id) {
        const job = this.allJobs.find(j => j.id == id);
        if (!job) return;

        this.selectedJobId = job.id;
        const modal = document.getElementById("jobModal");
        if (!modal) return;

        document.getElementById("modalCompanyAvatar").innerText = job.company ? job.company.charAt(0).toUpperCase() : 'J';
        document.getElementById("modalJobTitle").innerText = job.title;
        document.getElementById("modalCompanyName").innerText = job.company;
        document.getElementById("modalJobDescription").innerText = job.description || "No description provided.";
        
        const directLink = document.getElementById("modalDirectLink");
        if (directLink) directLink.href = `job-details.html?id=${job.id}`;

        document.getElementById("modalBadges").innerHTML = `
            <span class="text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">${escapeHTML(job.category || 'Tech')}</span>
            <span class="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium"><i class="fas fa-clock mr-1 text-indigo-400"></i>${escapeHTML(job.jobType || 'Full Time')}</span>
            <span class="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium"><i class="fas fa-map-marker-alt mr-1"></i>${escapeHTML(job.location || 'Remote')}</span>
            <span class="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium"><i class="fas fa-money-bill-wave mr-1"></i>${escapeHTML(job.salary || 'Competitive')}</span>
        `;

        modal.classList.remove("hidden");
    },

    closeModal() {
        const modal = document.getElementById("jobModal");
        if (modal) modal.classList.add("hidden");
    },

    // Submit Application
    async submitApplication() {
        const user = Auth.getUser();
        if (!user) {
            alert("Please sign in first to submit your application.");
            window.location.href = "login.html";
            return;
        }

        const resumeInput = document.getElementById("resumeUrlInput");
        const coverInput = document.getElementById("coverLetterInput");

        const application = {
            id: Date.now(),
            jobId: this.selectedJobId,
            userId: user.id,
            applicantName: user.name,
            applicantEmail: user.email,
            resumeUrl: resumeInput ? resumeInput.value.trim() : "",
            coverLetter: coverInput ? coverInput.value.trim() : "",
            status: "PENDING",
            appliedDate: new Date().toISOString().split('T')[0]
        };

        // Cache locally for instant feedback
        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const existingIdx = localApps.findIndex(a => a.jobId === this.selectedJobId && a.userId === user.id);
        if (existingIdx >= 0) {
            localApps[existingIdx] = application;
        } else {
            localApps.push(application);
        }
        localStorage.setItem("local_applications", JSON.stringify(localApps));

        // Submit to Express backend
        try {
            await fetch(`${API_BASE}/applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(application)
            });
        } catch (e) {
            console.warn("Express backend offline, saved locally:", e);
        }

        alert("Application submitted successfully!");
        this.closeModal();
        window.location.href = "my-applications.html";
    }
};

// Global bridging for onclicks in HTML
function filterJobs() { Jobs.filter(); }
function selectCategory(cat) { Jobs.selectCategory(cat, event.target); }
function openJobModal(id) { Jobs.openModal(id); }
function closeJobModal() { Jobs.closeModal(); }
function submitApplication() { Jobs.submitApplication(); }
