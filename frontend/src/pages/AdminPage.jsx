import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchJobs, API_BASE, DEFAULT_USERS } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [users, setUsers] = useState([]);
    const [serverOnline, setServerOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadAdminData = async () => {
            // Check server health
            try {
                const healthRes = await fetch(`${API_BASE}/health`);
                if (healthRes.ok) setServerOnline(true);
            } catch (e) {
                setServerOnline(false);
            }

            // Fetch jobs
            const allJobs = await fetchJobs();
            setJobs(allJobs);

            // Fetch users from local storage and defaults
            const localUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
            const combinedUsers = [...DEFAULT_USERS, ...Object.values(localUsers)];
            // Deduplicate by email
            const uniqueUsers = Array.from(new Map(combinedUsers.map(u => [u.email, u])).values());
            setUsers(uniqueUsers);

            setLoading(false);
        };

        loadAdminData();
    }, [user, navigate]);

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to remove this job posting?")) return;
        setJobs(jobs.filter(j => j.id !== jobId));

        // Update local jobs
        const local = JSON.parse(localStorage.getItem("local_jobs") || "[]").filter(j => j.id !== jobId);
        localStorage.setItem("local_jobs", JSON.stringify(local));

        try {
            await fetch(`${API_BASE}/jobs/${jobId}`, { method: 'DELETE' });
        } catch (e) {}
    };

    const handleDeleteUser = (userEmail) => {
        if (!window.confirm(`Delete account ${userEmail}?`)) return;
        setUsers(users.filter(u => u.email !== userEmail));
        const local = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const filtered = Object.fromEntries(Object.entries(local).filter(([_, u]) => u.email !== userEmail));
        localStorage.setItem("registered_users", JSON.stringify(filtered));
    };

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
                        <i className="fas fa-shield-alt"></i> Platform Administration
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        JobHub Control Center
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        System health diagnostics, content moderation, and user governance
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        serverOnline 
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        Backend: {serverOnline ? 'Express.js Live (Port 8080)' : 'Client Local Fallback'}
                    </span>
                    <Link to="/add-job" className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md">
                        + New Job
                    </Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Platform Users</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{users.length}</h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Active Jobs</p>
                    <h3 className="text-2xl font-bold text-indigo-400 mt-1">{jobs.length}</h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Recruiter Accounts</p>
                    <h3 className="text-2xl font-bold text-amber-400 mt-1">
                        {users.filter(u => u.role === 'RECRUITER').length}
                    </h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Engine Status</p>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1">Operational</h3>
                </div>
            </div>

            {/* User Directory */}
            <div className="mb-10">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-users text-indigo-400"></i> Registered User Directory
                </h2>
                <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold">
                                    <th className="p-3.5">User</th>
                                    <th className="p-3.5">Email</th>
                                    <th className="p-3.5">Assigned Role</th>
                                    <th className="p-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {users.map(u => (
                                    <tr key={u.email} className="hover:bg-slate-800/40 transition">
                                        <td className="p-3.5 font-bold text-white flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-indigo-400 font-bold border border-slate-700">
                                                {u.name?.charAt(0) || 'U'}
                                            </div>
                                            {u.name || 'Member'}
                                        </td>
                                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{u.email}</td>
                                        <td className="p-3.5">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                                                u.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                                u.role === 'RECRUITER' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                            }`}>
                                                {u.role || 'JOB_SEEKER'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            {u.email !== 'admin@jobhub.com' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.email)}
                                                    className="text-rose-400 hover:text-rose-300 text-xs px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Moderated Job Listings */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-briefcase text-indigo-400"></i> Moderate Job Openings
                </h2>
                <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold">
                                    <th className="p-3.5">Title & Company</th>
                                    <th className="p-3.5">Category</th>
                                    <th className="p-3.5">Type & Location</th>
                                    <th className="p-3.5">Compensation</th>
                                    <th className="p-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {jobs.map(j => (
                                    <tr key={j.id} className="hover:bg-slate-800/40 transition">
                                        <td className="p-3.5">
                                            <p className="font-bold text-white">{j.title}</p>
                                            <p className="text-indigo-400 text-[11px]">{j.company}</p>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                                {j.category || 'Engineering'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-400">
                                            {j.jobType} &bull; {j.location}
                                        </td>
                                        <td className="p-3.5 text-emerald-400 font-semibold">
                                            {j.salary || 'Competitive'}
                                        </td>
                                        <td className="p-3.5 text-right space-x-2">
                                            <Link to={`/job-details/${j.id}`} className="text-slate-400 hover:text-white">
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteJob(j.id)}
                                                className="text-rose-400 hover:text-rose-300 text-xs px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
