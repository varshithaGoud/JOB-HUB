import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('JOB_SEEKER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 4) {
            setError('Password must be at least 4 characters long.');
            return;
        }

        setLoading(true);

        try {
            const res = await register(name, email, password, role);
            if (res.success) {
                if (role === 'RECRUITER') {
                    navigate('/recruiter-dashboard');
                } else {
                    navigate('/jobs');
                }
            } else {
                setError(res.error || 'Registration failed. Try another email.');
            }
        } catch (err) {
            setError('Registration error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full py-12">
            <div className="w-full max-w-md">
                <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700/80">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl mx-auto mb-3 shadow-lg shadow-indigo-500/25">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h1>
                        <p className="text-xs text-slate-400 mt-1">Join JobHub as a job candidate or talent recruiter</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                            <div className="flex items-center px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 focus-within:border-indigo-500">
                                <i className="fas fa-user text-slate-500 text-xs mr-2.5"></i>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Varshitha Goud"
                                    className="bg-transparent w-full text-white placeholder-slate-500 text-xs focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                            <div className="flex items-center px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 focus-within:border-indigo-500">
                                <i className="fas fa-envelope text-slate-500 text-xs mr-2.5"></i>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@domain.com"
                                    className="bg-transparent w-full text-white placeholder-slate-500 text-xs focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">I am registering as:</label>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setRole('JOB_SEEKER')}
                                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                                        role === 'JOB_SEEKER'
                                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fas fa-briefcase text-indigo-400"></i> Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('RECRUITER')}
                                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                                        role === 'RECRUITER'
                                            ? 'bg-amber-600/30 border-amber-500 text-white shadow-md shadow-amber-500/20'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <i className="fas fa-building text-amber-400"></i> Recruiter
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
                            <div className="flex items-center px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 focus-within:border-indigo-500">
                                <i className="fas fa-key text-slate-500 text-xs mr-2.5"></i>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-transparent w-full text-white placeholder-slate-500 text-xs focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                            <div className="flex items-center px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 focus-within:border-indigo-500">
                                <i className="fas fa-check-double text-slate-500 text-xs mr-2.5"></i>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-transparent w-full text-white placeholder-slate-500 text-xs focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
