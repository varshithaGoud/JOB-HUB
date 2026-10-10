import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import JobModal from '../components/JobModal';

export default function HomePage() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [category, setCategory] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobs().then(data => setJobs(data));
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchSearch = !search || 
            job.title?.toLowerCase().includes(search.toLowerCase()) || 
            job.company?.toLowerCase().includes(search.toLowerCase()) ||
            job.description?.toLowerCase().includes(search.toLowerCase());
        const matchLoc = !location || job.location?.toLowerCase().includes(location.toLowerCase());
        const matchType = !jobType || job.jobType === jobType;
        const matchCat = !category || job.category === category;
        return matchSearch && matchLoc && matchType && matchCat;
    });

    const categories = ['Engineering', 'Design', 'Product', 'Data & AI', 'Marketing'];

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Hero Section */}
            <section className="text-center py-10 md:py-14 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Over 1,200+ Verified Opportunities Live</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
                    Discover Your Dream Career in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tech & Beyond</span>
                </h1>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
                    Connect directly with forward-thinking tech companies, startups, and enterprise teams hiring today.
                </p>

                {/* Search Bar Panel */}
                <div className="glass-panel p-3 rounded-2xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2.5 items-center">
                    <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 w-full">
                        <i className="fas fa-search text-indigo-400"></i>
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Job title, keywords, or company..."
                            className="bg-transparent w-full text-white placeholder-slate-500 text-sm focus:outline-none" 
                        />
                    </div>
                    <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 w-full">
                        <i className="fas fa-map-marker-alt text-rose-400"></i>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or 'Remote'..."
                            className="bg-transparent w-full text-white placeholder-slate-500 text-sm focus:outline-none" 
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <select 
                            value={jobType} 
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full md:w-auto bg-slate-900/80 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">All Types</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <button 
                        onClick={() => setCategory('')} 
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${!category ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'}`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setCategory(category === cat ? '' : cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-400 font-medium">
                    Showing {filteredJobs.length} active position{filteredJobs.length === 1 ? '' : 's'}
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Instant React State
                </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => {
                    const initial = job.company ? job.company.charAt(0).toUpperCase() : 'J';
                    return (
                        <div key={job.id} className="glass-panel p-5 rounded-2xl hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {initial}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">{job.company}</h4>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <i className="fas fa-map-marker-alt text-rose-400 text-[10px]"></i> {job.location || 'Remote'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                        {job.category || 'Tech'}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-white mb-2 leading-snug">{job.title}</h3>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                                    {job.description || 'No description available.'}
                                </p>
                            </div>

                            <div>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                        <i className="far fa-clock mr-1 text-indigo-400"></i>{job.jobType || 'Full Time'}
                                    </span>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                        <i className="fas fa-dollar-sign mr-0.5"></i>{job.salary || 'Competitive'}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                    <Link to={`/job-details/${job.id}`} className="text-xs text-slate-400 hover:text-indigo-400 transition flex items-center gap-1">
                                        Details <i className="fas fa-chevron-right text-[9px]"></i>
                                    </Link>
                                    <button onClick={() => setSelectedJob(job)} className="btn-gradient text-xs font-semibold px-3.5 py-1.5 rounded-lg text-white shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5">
                                        Quick Apply <i className="fas fa-paper-plane text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Application Modal */}
            {selectedJob && (
                <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </main>
    );
}
