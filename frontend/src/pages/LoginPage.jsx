import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res.success) {
                // Route to appropriate screen based on role
                const role = res.user?.role;
                if (role === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else if (role === 'RECRUITER') {
                    navigate('/recruiter-dashboard');
                } else {
                    navigate('/jobs');
                }
            } else {
                setError(res.error || 'Invalid email or password.');
            }
        } catch (err) {
            setError('Login failed. Please check credentials or try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFill = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError('');
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full py-12">
            <div className="w-full max-w-md">
                <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700/80">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl mx-auto mb-3 shadow-lg shadow-indigo-500/25">
                            <i className="fas fa-lock"></i>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-xs text-slate-400 mt-1">Sign in to manage applications, jobs, or recruiter posts</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Quick Fill Demo Badges */}
                    <div className="mb-5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i className="fas fa-bolt text-amber-400"></i> Quick Fill Demo Accounts
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickFill('admin@jobhub.com', 'admin')}
                                className="text-[11px] py-1.5 px-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition text-center font-medium"
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill('recruiter@jobhub.com', 'recruiter')}
                                className="text-[11px] py-1.5 px-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition text-center font-medium"
                            >
                                Recruiter
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill('user@jobhub.com', 'user')}
                                className="text-[11px] py-1.5 px-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition text-center font-medium"
                            >
                                Job Seeker
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-slate-300">Password</label>
                            </div>
                            <div className="flex items-center px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 focus-within:border-indigo-500">
                                <i className="fas fa-key text-slate-500 text-xs mr-2.5"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="bg-transparent w-full text-white placeholder-slate-500 text-xs focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-500 hover:text-white text-xs ml-2"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        Don't have an account yet?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
