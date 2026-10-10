import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJobs, submitApplication } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JobDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchJobs().then(jobs => {
            const found = jobs.find(j => String(j.id) === String(id));
            setJob(found || null);
            setLoading(false);
        });
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please sign in first to apply for this position!");
            navigate('/login');
            return;
        }

        setSubmitting(true);
        const application = {
            id: Date.now(),
            jobId: job.id,
            userId: user.id,
            applicantName: user.name,
            applicantEmail: user.email,
            resumeUrl,
            coverLetter,
            status: "PENDING",
            appliedDate: new Date().toISOString().split('T')[0]
        };

        await submitApplication(application);
        setSubmitting(false);
        setSubmitted(true);
    };

    if (loading) {
        return (
            <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 text-sm">Loading job details...</p>
            </main>
        );
    }

    if (!job) {
        return (
            <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="glass-panel p-10 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-2">Job Not Found</h2>
                    <p className="text-slate-400 text-sm mb-6">The job you are looking for does not exist or may have expired.</p>
                    <Link to="/jobs" className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md">
                        Back to All Jobs
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Back link */}
            <div className="mb-6">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
                    <i className="fas fa-arrow-left"></i> Back to all positions
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left/Main Column: Job Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/25 shrink-0">
                                {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                            </div>
                            <div>
                                <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium mb-2">
                                    {job.category || 'Tech'}
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                                    {job.title}
                                </h1>
                                <p className="text-sm font-semibold text-indigo-400">{job.company}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-800/80 mb-6 text-xs">
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-slate-500 block mb-1">Location</span>
                                <span className="text-white font-semibold flex items-center gap-1">
                                    <i className="fas fa-map-marker-alt text-rose-400"></i> {job.location}
                                </span>
                            </div>
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-slate-500 block mb-1">Job Type</span>
                                <span className="text-white font-semibold flex items-center gap-1">
                                    <i className="fas fa-clock text-indigo-400"></i> {job.jobType}
                                </span>
                            </div>
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-slate-500 block mb-1">Compensation</span>
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                    <i className="fas fa-money-bill-wave"></i> {job.salary || 'Competitive'}
                                </span>
                            </div>
                            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                <span className="text-slate-500 block mb-1">Posted</span>
                                <span className="text-slate-300 font-semibold flex items-center gap-1">
                                    <i className="fas fa-calendar-alt text-purple-400"></i> {job.postedDate || 'Recent'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">About the Position</h3>
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                                    {job.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Key Responsibilities</h3>
                                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                                    <li>Architect, implement, and maintain high performance web applications and backend systems.</li>
                                    <li>Collaborate closely with product managers, UX designers, and senior engineering leadership.</li>
                                    <li>Write maintainable, cleanly documented, and well-tested code in modern tech stacks.</li>
                                    <li>Conduct code reviews and champion best security, performance, and testing standards.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Requirements & Qualifications</h3>
                                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                                    <li>Proficiency in modern JavaScript/TypeScript, React, Node.js/Express, or related frameworks.</li>
                                    <li>Strong understanding of RESTful APIs, database schema design, and asynchronous patterns.</li>
                                    <li>Demonstrated ability to self-start, solve complex system bottlenecks, and deploy reliably.</li>
                                    <li>Excellent communication and team collaboration capabilities.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Application Card */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl sticky top-24">
                        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                            <i className="fas fa-paper-plane text-indigo-400"></i> Apply for this position
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">
                            Submit your portfolio or resume directly to {job.company}'s hiring team.
                        </p>

                        {submitted ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mx-auto mb-3">
                                    <i className="fas fa-check"></i>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">Application Sent!</h4>
                                <p className="text-xs text-slate-300 mb-4">
                                    Your application has been recorded. The recruiter will review it shortly.
                                </p>
                                <div className="space-y-2">
                                    <Link to="/my-applications" className="block text-center btn-gradient py-2 px-3 rounded-xl text-xs font-bold text-white shadow-md">
                                        View In My Applications
                                    </Link>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="w-full text-center text-xs text-slate-400 hover:text-white py-1"
                                    >
                                        Submit another application
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleApply} className="space-y-4">
                                {user ? (
                                    <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs">
                                        <p className="text-slate-400">Applying as:</p>
                                        <p className="text-white font-semibold">{user.name} ({user.email})</p>
                                    </div>
                                ) : (
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                                        <i className="fas fa-info-circle"></i>
                                        <span>Sign in to apply with your saved profile.</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Resume / Portfolio URL</label>
                                    <input 
                                        type="url" 
                                        required
                                        value={resumeUrl}
                                        onChange={(e) => setResumeUrl(e.target.value)}
                                        placeholder="https://linkedin.com/in/... or Google Drive" 
                                        className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Note / Why You're a Fit</label>
                                    <textarea 
                                        rows="4"
                                        required
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Brief introduction of your skills and passion for this role..." 
                                        className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full btn-gradient py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting Application...' : 'Send Application Now'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
                            <p><i className="fas fa-shield-alt mr-1 text-indigo-400"></i> Verified hiring employer</p>
                            <p><i className="fas fa-bolt mr-1 text-amber-400"></i> Average response time: &lt; 48 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
