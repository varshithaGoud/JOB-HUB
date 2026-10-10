// JobHub Universal Data & API Layer
// Synchronizes client state with localStorage & fallback mechanisms for offline/cold backend resiliency.

const API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080/api"
    : "https://jobhub-backend.onrender.com/api";

const SEED_USERS = [
    { id: 1, name: "System Administrator", email: "admin@jobhub.com", role: "ADMIN", title: "Security Lead & Admin" },
    { id: 2, name: "Sarah Jenkins", email: "techcorp@jobs.com", role: "RECRUITER", title: "Lead Recruiter @ TechCorp Inc." },
    { id: 3, name: "Marcus Vance", email: "nextgen@jobs.com", role: "RECRUITER", title: "Talent Acquisition @ NextGen AI" },
    { id: 4, name: "Alex Johnson", email: "alex@seeker.com", role: "JOB_SEEKER", title: "Senior Full-Stack Engineer" },
    { id: 5, name: "Elena Rostova", email: "elena@seeker.com", role: "JOB_SEEKER", title: "Machine Learning Researcher" }
];

const SEED_JOBS = [
    {
        id: 1,
        title: "Senior Full-Stack Developer",
        company: "TechCorp Inc.",
        recruiterId: 2,
        location: "Remote / San Francisco",
        salary: "$140,000 - $165,000",
        jobType: "Full Time",
        category: "Engineering",
        experienceLevel: "Senior Level",
        description: "We are looking for a Senior Full-Stack Developer to lead architectural decisions across our core cloud platforms. You will work closely with backend Java/Spring Boot microservices and modern reactive frontends.",
        postedDate: "2026-10-09"
    },
    {
        id: 2,
        title: "UI/UX Product Designer",
        company: "NextGen AI",
        recruiterId: 3,
        location: "San Francisco, CA",
        salary: "$115,000 - $135,000",
        jobType: "Full Time",
        category: "Design",
        experienceLevel: "Mid Level",
        description: "Join our design team to craft beautiful visual interfaces, design systems, and micro-interactions for our generative AI suite.",
        postedDate: "2026-10-09"
    },
    {
        id: 3,
        title: "Machine Learning Researcher",
        company: "NextGen AI",
        recruiterId: 3,
        location: "Remote",
        salary: "$155,000 - $185,000",
        jobType: "Full Time",
        category: "Data & AI",
        experienceLevel: "Senior Level",
        description: "Opportunity to train and fine-tune large language models and neural architectures for specialized enterprise applications.",
        postedDate: "2026-10-09"
    },
    {
        id: 4,
        title: "DevOps & Cloud Engineer",
        company: "TechCorp Inc.",
        recruiterId: 2,
        location: "New York, NY",
        salary: "$130,000 - $150,000",
        jobType: "Full Time",
        category: "Engineering",
        experienceLevel: "Mid Level",
        description: "Build scalable Kubernetes clusters, Automated CI/CD pipelines, and maintain high-availability cloud infrastructure on AWS.",
        postedDate: "2026-10-09"
    },
    {
        id: 5,
        title: "Technical Product Manager",
        company: "InnovateLabs",
        recruiterId: 2,
        location: "Hybrid (Chicago, IL)",
        salary: "$120,000 - $140,000",
        jobType: "Full Time",
        category: "Product",
        experienceLevel: "Senior Level",
        description: "Drive product vision, roadmap, and cross-functional team execution for enterprise SaaS platform solutions.",
        postedDate: "2026-10-09"
    },
    {
        id: 6,
        title: "Frontend React Specialist",
        company: "CloudScale Technologies",
        recruiterId: 3,
        location: "Remote",
        salary: "$100,000 - $120,000",
        jobType: "Full Time",
        category: "Engineering",
        experienceLevel: "Mid Level",
        description: "Create responsive, high-performance web dashboards and interactive visualizations using modern React & JavaScript ecosystem.",
        postedDate: "2026-10-09"
    }
];

const SEED_APPLICATIONS = [
    {
        id: 101,
        jobId: 1,
        userId: 4,
        userName: "Alex Johnson",
        userEmail: "alex@seeker.com",
        status: "UNDER_REVIEW",
        appliedDate: "2026-10-09",
        coverLetter: "Over 5 years of experience delivering robust full-stack solutions with Spring Boot and reactive modern frontends.",
        resumeUrl: "https://github.com/alex-johnson"
    },
    {
        id: 102,
        jobId: 2,
        userId: 4,
        userName: "Alex Johnson",
        userEmail: "alex@seeker.com",
        status: "PENDING",
        appliedDate: "2026-10-08",
        coverLetter: "Passionate about creating clean user interfaces, Figma design libraries, and polished micro-animations.",
        resumeUrl: "https://dribbble.com/alex"
    },
    {
        id: 103,
        jobId: 3,
        userId: 5,
        userName: "Elena Rostova",
        userEmail: "elena@seeker.com",
        status: "ACCEPTED",
        appliedDate: "2026-10-07",
        coverLetter: "Completed postgraduate research on attention mechanisms and transformer optimization.",
        resumeUrl: "https://github.com/elena-rostova"
    }
];

const JobHubStore = {
    // Users
    getUsers() {
        const customUsers = JSON.parse(localStorage.getItem("jobhub_custom_users") || "[]");
        const regUsersMap = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const registeredUsers = Object.values(regUsersMap);
        const deletedIds = JSON.parse(localStorage.getItem("jobhub_deleted_user_ids") || "[]");

        const all = [...SEED_USERS];
        customUsers.forEach(u => { if (!all.some(x => x.id === u.id || x.email === u.email)) all.push(u); });
        registeredUsers.forEach(u => { if (!all.some(x => x.id === u.id || x.email === u.email)) all.push(u); });

        return all.filter(u => !deletedIds.includes(u.id));
    },

    saveUser(user) {
        const users = JSON.parse(localStorage.getItem("jobhub_custom_users") || "[]");
        const newUser = { id: user.id || Date.now(), ...user };
        users.push(newUser);
        localStorage.setItem("jobhub_custom_users", JSON.stringify(users));
        return newUser;
    },

    deleteUser(id) {
        const deletedIds = JSON.parse(localStorage.getItem("jobhub_deleted_user_ids") || "[]");
        if (!deletedIds.includes(Number(id))) {
            deletedIds.push(Number(id));
            localStorage.setItem("jobhub_deleted_user_ids", JSON.stringify(deletedIds));
        }
    },

    // Jobs
    getJobs() {
        const customJobs = JSON.parse(localStorage.getItem("jobhub_custom_jobs") || "[]");
        const deletedIds = JSON.parse(localStorage.getItem("jobhub_deleted_job_ids") || "[]");

        const all = [...SEED_JOBS, ...customJobs];
        return all.filter(j => !deletedIds.includes(Number(j.id)));
    },

    getJobById(id) {
        return this.getJobs().find(j => Number(j.id) === Number(id));
    },

    saveJob(job) {
        const customJobs = JSON.parse(localStorage.getItem("jobhub_custom_jobs") || "[]");
        const newJob = {
            id: job.id || Date.now(),
            postedDate: new Date().toISOString().split("T")[0],
            ...job
        };
        customJobs.unshift(newJob);
        localStorage.setItem("jobhub_custom_jobs", JSON.stringify(customJobs));
        return newJob;
    },

    deleteJob(id) {
        const deletedIds = JSON.parse(localStorage.getItem("jobhub_deleted_job_ids") || "[]");
        if (!deletedIds.includes(Number(id))) {
            deletedIds.push(Number(id));
            localStorage.setItem("jobhub_deleted_job_ids", JSON.stringify(deletedIds));
        }
    },

    // Applications
    getApplications() {
        const stored = localStorage.getItem("jobhub_applications");
        let list = stored ? JSON.parse(stored) : null;
        if (!list) {
            list = [...SEED_APPLICATIONS];
            localStorage.setItem("jobhub_applications", JSON.stringify(list));
        }
        const cancelledIds = JSON.parse(localStorage.getItem("jobhub_cancelled_app_ids") || "[]");
        return list.filter(a => !cancelledIds.includes(Number(a.id)));
    },

    getUserApplications(userId) {
        const apps = this.getApplications();
        return apps.filter(a => Number(a.userId) === Number(userId));
    },

    getJobApplications(jobId) {
        const apps = this.getApplications();
        return apps.filter(a => Number(a.jobId) === Number(jobId));
    },

    saveApplication(app) {
        const apps = this.getApplications();
        const newApp = {
            id: app.id || Date.now(),
            status: "PENDING",
            appliedDate: new Date().toISOString().split("T")[0],
            ...app
        };
        apps.unshift(newApp);
        localStorage.setItem("jobhub_applications", JSON.stringify(apps));
        return newApp;
    },

    updateApplicationStatus(id, newStatus) {
        const apps = this.getApplications();
        const app = apps.find(a => Number(a.id) === Number(id));
        if (app) {
            app.status = newStatus;
            localStorage.setItem("jobhub_applications", JSON.stringify(apps));
            return app;
        }
        return null;
    },

    deleteApplication(id) {
        const apps = this.getApplications().filter(a => Number(a.id) !== Number(id));
        localStorage.setItem("jobhub_applications", JSON.stringify(apps));

        const cancelledIds = JSON.parse(localStorage.getItem("jobhub_cancelled_app_ids") || "[]");
        if (!cancelledIds.includes(Number(id))) {
            cancelledIds.push(Number(id));
            localStorage.setItem("jobhub_cancelled_app_ids", JSON.stringify(cancelledIds));
        }
    },

    // System Stats
    getStats() {
        const users = this.getUsers();
        const jobs = this.getJobs();
        const apps = this.getApplications();

        return {
            totalUsers: users.length,
            totalJobs: jobs.length,
            totalApplications: apps.length,
            totalRecruiters: users.filter(u => u.role === "RECRUITER").length,
            totalJobSeekers: users.filter(u => u.role === "JOB_SEEKER").length
        };
    }
};

// Global export
window.JobHubStore = JobHubStore;
