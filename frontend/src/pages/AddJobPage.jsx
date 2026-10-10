import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AddJobPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState(user?.role === 'RECRUITER' ? 'TechCorp Solutions' : '');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('Full Time');
    const [category, setCategory] = useState('Engineering');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const newJob = {
            id: Date.now(),
            title: title.trim(),
            company: company.trim() || 'Verified Employer',
            location: location.trim() || 'Remote',
            jobType,
            category,
            salary: salary.trim() || '$100,000 - $140,000',
            description: description.trim(),
            postedDate: 'Just now',
            postedBy: user?.id || null
        };

        // 1. Save to local storage for instant responsiveness
        const local = JSON.parse(localStorage.getItem("local_jobs") || "[]");
        local.unshift(newJob);
        localStorage.setItem("local_jobs", JSON.stringify(local));

        // 2. Post to Express backend
        try {
            await fetch(`${API_BASE}/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob)
            });
        } catch (e) {}

        setSubmitting(false);
        alert("🎉 Position posted successfully!");
        if (user?.role === 'RECRUITER') {
            navigate('/recruiter-dashboard');
        } else {
            navigate('/jobs');
        }
    };

    return (
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-6">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
                    <i className="fas fa-arrow-left"></i> Back to Jobs
                </Link>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700/80">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/25">
                        <i className="fas fa-plus-circle"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Post a New Opportunity</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Reach thousands of verified developers, designers, and tech leaders</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Senior Backend Engineer"
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                            <input
                                type="text"
                                required
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g. Acme Tech Corp"
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. San Francisco (Remote)"
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type</label>
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                            >
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Product">Product</option>
                                <option value="Data & AI">Data & AI</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Compensation Range</label>
                        <input
                            type="text"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="e.g. $130,000 - $160,000 + Equity"
                            className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description & Requirements *</label>
                        <textarea
                            rows="6"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detail the day-to-day role, stack requirements, team structure, and qualifications..."
                            className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <Link to="/jobs" className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
                        >
                            {submitting ? 'Publishing...' : 'Publish Job Opening'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
