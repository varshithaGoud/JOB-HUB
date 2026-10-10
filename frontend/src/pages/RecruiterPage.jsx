import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchJobs, API_BASE } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecruiterPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            const allJobs = await fetchJobs();
            setJobs(allJobs);

            try {
                const res = await fetch(`${API_BASE}/applications`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setApplications(data);
                    }
                }
            } catch (e) {
                const local = JSON.parse(localStorage.getItem("local_applications") || "[]");
                setApplications(local);
            }
            setLoading(false);
        };

        loadData();
    }, [user, navigate]);

    const handleUpdateStatus = async (appId, newStatus) => {
        const updated = applications.map(a => a.id === appId ? { ...a, status: newStatus } : a);
        setApplications(updated);

        // Update local storage
        const local = JSON.parse(localStorage.getItem("local_applications") || "[]");
        const idx = local.findIndex(a => a.id === appId);
        if (idx >= 0) {
            local[idx].status = newStatus;
            localStorage.setItem("local_applications", JSON.stringify(local));
        }

        // Try backend
        try {
            await fetch(`${API_BASE}/applications/${appId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {}
    };

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
                        <i className="fas fa-building"></i> Recruiter Console
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Talent Acquisition Dashboard
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Manage active job openings, review candidate pipelines, and track hires
                    </p>
                </div>
                <Link to="/add-job" className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 self-start sm:self-auto">
                    <i className="fas fa-plus"></i> Post New Job
                </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Active Openings</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{jobs.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <i className="fas fa-briefcase"></i>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Candidate Applications</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">{applications.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                            <i className="fas fa-users"></i>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Accepted Candidates</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                                {applications.filter(a => a.status === 'ACCEPTED').length}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <i className="fas fa-check-circle"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidate Applications Review */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <i className="fas fa-user-check text-indigo-400"></i> Candidate Applications
                    </h2>
                    <span className="text-xs text-slate-400">{applications.length} submitted</span>
                </div>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-slate-400 text-xs">Loading applicants...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="glass-panel p-8 text-center rounded-2xl">
                        <p className="text-slate-400 text-sm">No applications have been submitted for your jobs yet.</p>
                    </div>
                ) : (
                    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold">
                                        <th className="p-3.5">Candidate</th>
                                        <th className="p-3.5">Target Job</th>
                                        <th className="p-3.5">Applied Date</th>
                                        <th className="p-3.5">Resume / Links</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-300">
                                    {applications.map(app => {
                                        const job = jobs.find(j => String(j.id) === String(app.jobId));
                                        return (
                                            <tr key={app.id} className="hover:bg-slate-800/40 transition">
                                                <td className="p-3.5">
                                                    <p className="font-bold text-white">{app.applicantName || 'Anonymous'}</p>
                                                    <p className="text-slate-500 text-[11px]">{app.applicantEmail}</p>
                                                </td>
                                                <td className="p-3.5">
                                                    <p className="font-semibold text-indigo-300">{job?.title || `Job #${app.jobId}`}</p>
                                                    <p className="text-slate-500 text-[11px]">{job?.company || ''}</p>
                                                </td>
                                                <td className="p-3.5 text-slate-400">
                                                    {app.appliedDate || 'Recent'}
                                                </td>
                                                <td className="p-3.5">
                                                    {app.resumeUrl ? (
                                                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                                                            <i className="fas fa-file-pdf"></i> View Link
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-500">None</span>
                                                    )}
                                                </td>
                                                <td className="p-3.5">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                                                        app.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                        app.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                    }`}>
                                                        {app.status || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-right space-x-1.5">
                                                    <button
                                                        onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                                        className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-medium"
                                                        title="Accept"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                        className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-medium"
                                                        title="Reject"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Current Openings */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <i className="fas fa-list text-indigo-400"></i> Active Job Postings
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map(job => (
                        <div key={job.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold mb-2 inline-block">
                                    {job.category || 'Tech'}
                                </span>
                                <h3 className="text-sm font-bold text-white line-clamp-1">{job.title}</h3>
                                <p className="text-xs text-slate-400">{job.company} &bull; {job.location}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
                                <span className="text-emerald-400 font-semibold">{job.salary || 'Competitive'}</span>
                                <Link to={`/job-details/${job.id}`} className="text-indigo-400 hover:underline">
                                    View Live <i className="fas fa-external-link-alt text-[10px] ml-1"></i>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
