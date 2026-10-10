import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import JobModal from '../components/JobModal';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('All');
    const [category, setCategory] = useState('All');
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs().then(data => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    const categories = ['All', 'Engineering', 'Design', 'Product', 'Data & AI', 'Marketing'];
    const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Remote', 'Internship'];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !search || 
            job.title?.toLowerCase().includes(search.toLowerCase()) || 
            job.company?.toLowerCase().includes(search.toLowerCase()) ||
            job.description?.toLowerCase().includes(search.toLowerCase());
        const matchesLoc = !location || job.location?.toLowerCase().includes(location.toLowerCase());
        const matchesType = jobType === 'All' || job.jobType === jobType;
        const matchesCat = category === 'All' || job.category === category;
        return matchesSearch && matchesLoc && matchesType && matchesCat;
    });

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                    <i className="fas fa-briefcase"></i> Explore Available Roles
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                    Find Opportunities That Match Your Ambition
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                    Browse top tech, product, and engineering roles from verified companies worldwide.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel p-4 rounded-2xl mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-6 flex items-center gap-3 px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                        <i className="fas fa-search text-indigo-400"></i>
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by role title, skill, or company..." 
                            className="bg-transparent w-full text-white placeholder-slate-500 text-sm focus:outline-none"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white text-xs">
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    <div className="md:col-span-6 flex items-center gap-3 px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                        <i className="fas fa-map-marker-alt text-rose-400"></i>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, State, or 'Remote'..." 
                            className="bg-transparent w-full text-white placeholder-slate-500 text-sm focus:outline-none"
                        />
                        {location && (
                            <button onClick={() => setLocation('')} className="text-slate-500 hover:text-white text-xs">
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Category:</span>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`text-xs px-3 py-1 rounded-lg border transition ${
                                    category === cat 
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20' 
                                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Type:</span>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                        >
                            {jobTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400 font-medium">
                    Showing <span className="text-white font-bold">{filteredJobs.length}</span> positions
                </p>
                {(search || location || jobType !== 'All' || category !== 'All') && (
                    <button 
                        onClick={() => { setSearch(''); setLocation(''); setJobType('All'); setCategory('All'); }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Loading verified jobs...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl mx-auto mb-4">
                        <i className="fas fa-search-minus"></i>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No matching positions found</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                        We couldn't find any positions matching your search criteria. Try loosening your filters or clearing search terms.
                    </p>
                    <button 
                        onClick={() => { setSearch(''); setLocation(''); setJobType('All'); setCategory('All'); }}
                        className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredJobs.map(job => (
                        <div 
                            key={job.id} 
                            className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition group"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-indigo-500/20">
                                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                                    </div>
                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                                        {job.category || 'Engineering'}
                                    </span>
                                </div>
                                
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition line-clamp-1">
                                    {job.title}
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 mb-3">{job.company}</p>

                                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                    {job.description}
                                </p>
                            </div>

                            <div>
                                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mb-4 pt-3 border-t border-slate-800">
                                    <span className="flex items-center gap-1">
                                        <i className="fas fa-map-marker-alt text-rose-400"></i> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="fas fa-briefcase text-indigo-400"></i> {job.jobType}
                                    </span>
                                    {job.salary && (
                                        <span className="flex items-center gap-1 font-semibold text-emerald-400">
                                            <i className="fas fa-money-bill-wave"></i> {job.salary}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link 
                                        to={`/job-details/${job.id}`}
                                        className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                                    >
                                        Details
                                    </Link>
                                    <button 
                                        onClick={() => setSelectedJob(job)}
                                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold btn-gradient text-white shadow-md shadow-indigo-500/20 transition"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Modal */}
            <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        </main>
    );
}
