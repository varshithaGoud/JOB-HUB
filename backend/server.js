const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Data Directory & Persistence Helpers
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPS_FILE = path.join(DATA_DIR, 'applications.json');

function loadData(file, fallback) {
    try {
        if (fs.existsSync(file)) {
            const raw = fs.readFileSync(file, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn(`Could not read ${file}, using default seed data.`);
    }
    return fallback;
}

function saveData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error(`Failed to save to ${file}:`, e.message);
    }
}

// Initial Seed Data
const DEFAULT_USERS = [
    {
        id: 1,
        name: "Platform Administrator",
        email: "admin@jobhub.com",
        password: "admin",
        role: "ADMIN",
        title: "Platform Admin",
        createdAt: "2026-01-01"
    },
    {
        id: 2,
        name: "Sarah Jenkins",
        email: "recruiter@jobhub.com",
        password: "recruiter",
        role: "RECRUITER",
        title: "Talent Acquisition Lead at Google Cloud",
        createdAt: "2026-01-02"
    },
    {
        id: 3,
        name: "Varshitha Goud",
        email: "user@jobhub.com",
        password: "user",
        role: "JOB_SEEKER",
        title: "Software Engineer",
        createdAt: "2026-01-03"
    },
    {
        id: 4,
        name: "Alex Johnson",
        email: "alex@seeker.com",
        password: "user",
        role: "JOB_SEEKER",
        title: "Senior Full-Stack Developer",
        createdAt: "2026-01-04"
    },
    {
        id: 5,
        name: "Marcus Vance",
        email: "techcorp@jobs.com",
        password: "recruiter",
        role: "RECRUITER",
        title: "Technical Recruiter at Netflix",
        createdAt: "2026-01-05"
    }
];

const DEFAULT_JOBS = [
    {
        id: 1,
        title: "Senior Full Stack Engineer",
        company: "Google",
        location: "Mountain View, CA (Hybrid)",
        salary: "$165,000 - $195,000",
        jobType: "Full Time",
        category: "Engineering",
        description: "Architect and scale resilient cloud solutions using Node.js, Spring Boot, React, and Kubernetes. Mentor engineers and conduct architectural reviews.",
        recruiterId: 2,
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
        recruiterId: 2,
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
        recruiterId: 5,
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
        recruiterId: 2,
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
        recruiterId: 5,
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
        recruiterId: 5,
        postedDate: "4 days ago"
    }
];

const DEFAULT_APPLICATIONS = [
    {
        id: 1001,
        jobId: 1,
        userId: 3,
        applicantName: "Varshitha Goud",
        applicantEmail: "user@jobhub.com",
        resumeUrl: "https://github.com/varshithaGoud",
        coverLetter: "Excited about distributed cloud computing and building world-class developer experiences.",
        status: "PENDING",
        appliedDate: "2026-10-09"
    },
    {
        id: 1002,
        jobId: 2,
        userId: 4,
        applicantName: "Alex Johnson",
        applicantEmail: "alex@seeker.com",
        resumeUrl: "https://linkedin.com/in/alex",
        coverLetter: "10+ years designing digital design systems and enterprise web applications.",
        status: "UNDER_REVIEW",
        appliedDate: "2026-10-08"
    }
];

// In-Memory Stores
let users = loadData(USERS_FILE, DEFAULT_USERS);
let jobs = loadData(JOBS_FILE, DEFAULT_JOBS);
let applications = loadData(APPS_FILE, DEFAULT_APPLICATIONS);

// Root & Health check
app.get('/', (req, res) => {
    res.json({
        status: "online",
        service: "JobHub Express.js Backend API",
        version: "1.0.0",
        uptime: process.uptime(),
        endpoints: [
            "/api/health",
            "/api/auth/register",
            "/api/auth/login",
            "/api/users",
            "/api/jobs",
            "/api/applications",
            "/api/stats"
        ]
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// ==========================================
// AUTHENTICATION & USER ROUTES
// ==========================================

// Register
const handleRegister = (req, res) => {
    const { name, email, password, role, title } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
        return res.status(409).json({ error: "An account with this email address already exists." });
    }

    const newUser = {
        id: Date.now(),
        name: name ? name.trim() : cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password,
        role: role ? role.toUpperCase() : "JOB_SEEKER",
        title: title ? title.trim() : (role === "RECRUITER" ? "Hiring Manager" : "Candidate"),
        createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    saveData(USERS_FILE, users);

    const safeUser = { ...newUser };
    delete safeUser.password;

    res.status(201).json({
        message: "Account registered successfully",
        user: safeUser,
        token: "token_" + newUser.id
    });
};

app.post('/api/auth/register', handleRegister);
app.post('/api/users/register', handleRegister);

// Login
const handleLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password credentials." });
    }

    const safeUser = { ...user };
    delete safeUser.password;

    res.json({
        message: "Login successful",
        user: safeUser,
        token: "token_" + user.id
    });
};

app.post('/api/auth/login', handleLogin);
app.post('/api/users/login', handleLogin);

// List All Users
app.get('/api/users', (req, res) => {
    const safeUsers = users.map(u => {
        const copy = { ...u };
        delete copy.password;
        return copy;
    });
    res.json(safeUsers);
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLen = users.length;
    users = users.filter(u => u.id !== id);

    if (users.length === initialLen) {
        return res.status(404).json({ error: "User not found." });
    }

    saveData(USERS_FILE, users);
    res.json({ message: "User deleted successfully." });
});

// ==========================================
// JOB LISTINGS ROUTES
// ==========================================

// Get All Jobs (with query filter support)
app.get('/api/jobs', (req, res) => {
    let result = [...jobs];
    const { search, category, jobType, location } = req.query;

    if (search) {
        const q = search.toLowerCase();
        result = result.filter(j => 
            (j.title && j.title.toLowerCase().includes(q)) ||
            (j.company && j.company.toLowerCase().includes(q)) ||
            (j.description && j.description.toLowerCase().includes(q))
        );
    }

    if (category) {
        result = result.filter(j => j.category && j.category.toLowerCase() === category.toLowerCase());
    }

    if (jobType) {
        result = result.filter(j => j.jobType && j.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (location) {
        result = result.filter(j => j.location && j.location.toLowerCase().includes(location.toLowerCase()));
    }

    res.json(result);
});

// Get Single Job By ID
app.get('/api/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const job = jobs.find(j => j.id === id);

    if (!job) {
        return res.status(404).json({ error: "Job listing not found." });
    }

    res.json(job);
});

// Create New Job
app.post('/api/jobs', (req, res) => {
    const { title, company, location, salary, jobType, category, description, recruiterId } = req.body;

    if (!title || !company) {
        return res.status(400).json({ error: "Job title and company name are required." });
    }

    const newJob = {
        id: Date.now(),
        title: title.trim(),
        company: company.trim(),
        location: location ? location.trim() : "Remote",
        salary: salary ? salary.trim() : "Competitive",
        jobType: jobType || "Full Time",
        category: category || "Engineering",
        description: description ? description.trim() : "No detailed description provided.",
        recruiterId: recruiterId ? parseInt(recruiterId) : null,
        postedDate: "Just now"
    };

    jobs.unshift(newJob);
    saveData(JOBS_FILE, jobs);

    res.status(201).json(newJob);
});

// Update Job
app.put('/api/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const idx = jobs.findIndex(j => j.id === id);

    if (idx === -1) {
        return res.status(404).json({ error: "Job listing not found." });
    }

    jobs[idx] = { ...jobs[idx], ...req.body, id };
    saveData(JOBS_FILE, jobs);

    res.json(jobs[idx]);
});

// Delete Job
app.delete('/api/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLen = jobs.length;
    jobs = jobs.filter(j => j.id !== id);

    if (jobs.length === initialLen) {
        return res.status(404).json({ error: "Job listing not found." });
    }

    saveData(JOBS_FILE, jobs);
    res.json({ message: "Job listing removed successfully." });
});

// ==========================================
// APPLICATIONS ROUTES
// ==========================================

// Get All Applications
app.get('/api/applications', (req, res) => {
    res.json(applications);
});

// Get Applications by User ID
app.get('/api/applications/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userApps = applications.filter(a => a.userId === userId);
    res.json(userApps);
});

// Get Applications by Job ID
app.get('/api/applications/job/:jobId', (req, res) => {
    const jobId = parseInt(req.params.jobId);
    const jobApps = applications.filter(a => a.jobId === jobId);
    res.json(jobApps);
});

// Submit Application
app.post('/api/applications', (req, res) => {
    const { jobId, userId, applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

    if (!jobId || !userId) {
        return res.status(400).json({ error: "jobId and userId are required." });
    }

    // Check if already applied
    const existing = applications.find(a => a.jobId === parseInt(jobId) && a.userId === parseInt(userId));
    if (existing) {
        existing.resumeUrl = resumeUrl || existing.resumeUrl;
        existing.coverLetter = coverLetter || existing.coverLetter;
        saveData(APPS_FILE, applications);
        return res.json({ message: "Application updated successfully", application: existing });
    }

    const user = users.find(u => u.id === parseInt(userId));

    const newApp = {
        id: Date.now(),
        jobId: parseInt(jobId),
        userId: parseInt(userId),
        applicantName: applicantName || (user ? user.name : "Candidate"),
        applicantEmail: applicantEmail || (user ? user.email : "user@jobhub.com"),
        resumeUrl: resumeUrl || "",
        coverLetter: coverLetter || "",
        status: "PENDING",
        appliedDate: new Date().toISOString().split('T')[0]
    };

    applications.push(newApp);
    saveData(APPS_FILE, applications);

    res.status(201).json(newApp);
});

// Update Application Status
app.put('/api/applications/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status field is required." });
    }

    const appItem = applications.find(a => a.id === id);
    if (!appItem) {
        return res.status(404).json({ error: "Application not found." });
    }

    appItem.status = status.toUpperCase();
    saveData(APPS_FILE, applications);

    res.json(appItem);
});

// Delete Application (Withdraw)
app.delete('/api/applications/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLen = applications.length;
    applications = applications.filter(a => a.id !== id);

    if (applications.length === initialLen) {
        return res.status(404).json({ error: "Application not found." });
    }

    saveData(APPS_FILE, applications);
    res.json({ message: "Application withdrawn successfully." });
});

// ==========================================
// SYSTEM STATS ROUTE
// ==========================================
app.get('/api/stats', (req, res) => {
    const totalUsers = users.length;
    const totalJobSeekers = users.filter(u => u.role === "JOB_SEEKER").length;
    const totalRecruiters = users.filter(u => u.role === "RECRUITER").length;
    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    res.json({
        totalUsers,
        totalJobSeekers,
        totalRecruiters,
        totalJobs,
        totalApplications
    });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 JobHub Express.js Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`💼 Jobs Endpoint:   http://localhost:${PORT}/api/jobs`);
    console.log(`👤 Users Endpoint:  http://localhost:${PORT}/api/users`);
    console.log(`=========================================`);
});
