import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchJobs, API_BASE } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ApplicationsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            const allJobs = await fetchJobs();
            setJobs(allJobs);

            // Fetch applications from backend or localStorage
            let userApps = [];
            try {
                const res = await fetch(`${API_BASE}/applications`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        userApps = data.filter(a => String(a.userId) === String(user.id));
                    }
                }
            } catch (e) {}

            const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]")
                .filter(a => String(a.userId) === String(user.id));

            // Merge local and remote
            const map = new Map();
            [...localApps, ...userApps].forEach(app => map.set(app.id || `${app.jobId}-${app.userId}`, app));
            setApplications(Array.from(map.values()));
            setLoading(false);
        };

        loadData();
    }, [user, navigate]);

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'ACCEPTED':
            case 'APPROVED':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'REJECTED':
                return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            case 'REVIEWED':
                return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
            default:
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        }
    };

    const handleDelete = (appId) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) return;
        const updated = applications.filter(a => a.id !== appId);
        setApplications(updated);
        const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]")
            .filter(a => a.id !== appId);
        localStorage.setItem("local_applications", JSON.stringify(localApps));
    };

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                        <i className="fas fa-file-signature"></i> Application Tracker
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        My Job Applications
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Track submissions, hiring manager review stages, and interview statuses
                    </p>
                </div>
                <Link to="/jobs" className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md self-start sm:self-auto">
                    <i className="fas fa-search mr-1.5"></i> Explore More Jobs
                </Link>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Loading your submissions...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl mx-auto mb-4">
                        <i className="fas fa-folder-open"></i>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Applications Yet</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                        You haven't submitted any job applications yet. Discover matching positions and apply in one click.
                    </p>
                    <Link to="/jobs" className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25">
                        Browse Open Opportunities
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map(app => {
                        const job = jobs.find(j => String(j.id) === String(app.jobId)) || {
                            title: `Position #${app.jobId}`,
                            company: "Verified Hiring Partner",
                            location: "Remote",
                            jobType: "Full Time"
                        };

                        return (
                            <div key={app.id || `${app.jobId}-${app.appliedDate}`} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/80 hover:border-indigo-500/40 transition">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-md shrink-0">
                                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-white">{job.title}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(app.status)}`}>
                                                {app.status || 'PENDING'}
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-indigo-400 mb-2">{job.company}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                            <span><i className="fas fa-map-marker-alt text-rose-400 mr-1"></i> {job.location}</span>
                                            <span><i className="fas fa-calendar text-slate-500 mr-1"></i> Applied: {app.appliedDate || 'Recently'}</span>
                                            {app.resumeUrl && (
                                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                                                    <i className="fas fa-link mr-1"></i> Resume Link
                                                </a>
                                            )}
                                        </div>
                                        {app.coverLetter && (
                                            <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 mt-2 line-clamp-2 max-w-2xl">
                                                "{app.coverLetter}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                    <Link to={`/job-details/${app.jobId}`} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
                                        View Job
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
