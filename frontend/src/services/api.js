/**
 * JobHub - API Service
 * Handles communication with Express.js Backend with local fallback resilience
 */

const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname === ""
);

export const API_BASE = isLocalhost 
    ? "http://localhost:8080/api" 
    : "https://jobhub-backend.onrender.com/api";

export const FALLBACK_JOBS = [
    {
        id: 1,
        title: "Senior Full Stack Engineer",
        company: "Google",
        location: "Mountain View, CA (Hybrid)",
        salary: "$165,000 - $195,000",
        jobType: "Full Time",
        category: "Engineering",
        description: "Architect and scale resilient cloud solutions using Node.js, Express, React, and Kubernetes. Mentor engineers and conduct architectural reviews.",
        postedDate: "Just now"
    },
    {
        id: 2,
        title: "Lead UI/UX Product Designer",
        company: "Airbnb",
        location: "San Francisco, CA (Remote)",
        salary: "$140,000 - $170,000",
        jobType: "Remote",
        category: "Design",
        description: "Craft modern, accessible, and high-conversion interfaces for millions of global travelers. Drive our modern design token system and user research.",
        postedDate: "2 hours ago"
    },
    {
        id: 3,
        title: "DevOps & Cloud Architect",
        company: "Netflix",
        location: "Los Gatos, CA",
        salary: "$180,000 - $220,000",
        jobType: "Full Time",
        category: "Engineering",
        description: "Scale high-throughput streaming pipelines with Kubernetes, Terraform, AWS, and distributed telemetry. Optimize edge latency and fault recovery.",
        postedDate: "1 day ago"
    },
    {
        id: 4,
        title: "AI & Machine Learning Engineer",
        company: "OpenAI",
        location: "San Francisco, CA (Hybrid)",
        salary: "$200,000 - $260,000",
        jobType: "Full Time",
        category: "Data & AI",
        description: "Build scalable training pipelines, inference optimization, and developer toolkits for cutting-edge multimodal intelligence models.",
        postedDate: "2 days ago"
    },
    {
        id: 5,
        title: "Technical Product Manager",
        company: "Stripe",
        location: "Seattle, WA (Remote)",
        salary: "$150,000 - $185,000",
        jobType: "Remote",
        category: "Product",
        description: "Drive strategy and developer experience for global billing and payout APIs. Work alongside engineering and top fintech merchant partners.",
        postedDate: "3 days ago"
    },
    {
        id: 6,
        title: "Growth Marketing Specialist",
        company: "Spotify",
        location: "New York, NY",
        salary: "$110,000 - $135,000",
        jobType: "Full Time",
        category: "Marketing",
        description: "Execute user acquisition campaigns, optimize funnels, and analyze listener retention metrics across digital channels and podcasts.",
        postedDate: "4 days ago"
    }
];

export const DEFAULT_USERS = [
    { id: 1, name: "System Administrator", email: "admin@jobhub.com", role: "ADMIN", title: "Platform Admin" },
    { id: 2, name: "Sarah Jenkins", email: "recruiter@jobhub.com", role: "RECRUITER", title: "Talent Acquisition Lead" },
    { id: 3, name: "Varshitha Goud", email: "user@jobhub.com", role: "JOB_SEEKER", title: "Software Engineer" },
    { id: 4, name: "Alex Johnson", email: "alex@seeker.com", role: "JOB_SEEKER", title: "Senior Developer" },
    { id: 5, name: "Marcus Vance", email: "techcorp@jobs.com", role: "RECRUITER", title: "TechCorp Hiring Manager" }
];

export async function fetchJobs() {
    const localJobs = JSON.parse(localStorage.getItem("local_jobs") || "[]");
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(`${API_BASE}/jobs`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                return [...data, ...localJobs];
            }
        }
    } catch (e) {}
    return [...FALLBACK_JOBS, ...localJobs];
}

export async function submitApplication(appData) {
    const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
    const existingIdx = localApps.findIndex(a => a.jobId === appData.jobId && a.userId === appData.userId);
    if (existingIdx >= 0) {
        localApps[existingIdx] = appData;
    } else {
        localApps.push(appData);
    }
    localStorage.setItem("local_applications", JSON.stringify(localApps));

    try {
        await fetch(`${API_BASE}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appData)
        });
    } catch (e) {}
}
