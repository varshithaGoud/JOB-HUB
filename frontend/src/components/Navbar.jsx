import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    let roleBadgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    if (user?.role === 'ADMIN') roleBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    if (user?.role === 'RECRUITER') roleBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

    return (
        <header className="w-full glass-panel sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                        <i className="fas fa-briefcase"></i>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Job<span className="text-indigo-400">Hub</span></span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link to="/" className="hover:text-white transition flex items-center gap-1.5">
                        <i className="fas fa-home text-xs"></i> Home
                    </Link>
                    <Link to="/jobs" className="hover:text-white transition flex items-center gap-1.5">
                        <i className="fas fa-search text-xs"></i> All Jobs
                    </Link>
                    {user?.role === 'JOB_SEEKER' && (
                        <Link to="/my-applications" className="hover:text-white transition flex items-center gap-1.5">
                            <i className="fas fa-file-alt text-xs"></i> My Applications
                        </Link>
                    )}
                    {user?.role === 'RECRUITER' && (
                        <Link to="/recruiter-dashboard" className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5">
                            <i className="fas fa-building text-xs"></i> Recruiter Console
                        </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin-dashboard" className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1.5">
                            <i className="fas fa-shield-alt text-xs"></i> Admin Panel
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                                    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border mt-0.5 ${roleBadgeColor}`}>{user.role}</span>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
                                Sign In
                            </Link>
                            <Link to="/register" className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg btn-gradient text-white shadow-md shadow-indigo-500/20 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
