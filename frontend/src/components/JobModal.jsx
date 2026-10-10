import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitApplication } from '../services/api';

export default function JobModal({ job, onClose }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [resumeUrl, setResumeUrl] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);

    if (!job) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in first to apply for positions!");
            navigate('/login');
            return;
        }

        setLoading(true);
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
        setLoading(false);
        alert("🎉 Application submitted successfully!");
        onClose();
        navigate('/my-applications');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative border border-slate-700/80 shadow-2xl">
                <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg">
                    <i className="fas fa-times"></i>
                </button>

                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-0.5">{job.title}</h3>
                        <p className="text-indigo-400 text-sm font-semibold">{job.company}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">{job.category || 'Tech'}</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium"><i className="fas fa-clock mr-1 text-indigo-400"></i>{job.jobType || 'Full Time'}</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium"><i className="fas fa-map-marker-alt mr-1"></i>{job.location || 'Remote'}</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium"><i className="fas fa-money-bill-wave mr-1"></i>{job.salary || 'Competitive'}</span>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Role Overview</h4>
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        {job.description || 'No description provided.'}
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fas fa-paper-plane text-indigo-400"></i> Submit Your Application
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Resume / Portfolio Link</label>
                            <input 
                                type="url" 
                                value={resumeUrl} 
                                onChange={(e) => setResumeUrl(e.target.value)}
                                placeholder="https://linkedin.com/in/... or drive link"
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Note / Cover Letter</label>
                            <textarea 
                                rows="3" 
                                value={coverLetter} 
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Tell the hiring manager why you are a great fit..."
                                className="w-full bg-slate-900/90 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" 
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link to={`/job-details/${job.id}`} onClick={onClose} className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-slate-800">
                                Open Full Page <i className="fas fa-external-link-alt text-[10px] ml-1"></i>
                            </Link>
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="btn-gradient px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition">
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
