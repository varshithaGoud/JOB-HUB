import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-800/80 py-8 mt-12 bg-slate-950/40">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-xs text-slate-500">
                    &copy; 2026 JobHub Platform &bull; Built with React, Tailwind CSS & Express.js. All rights reserved.
                </p>
                <div className="flex justify-center gap-4 mt-2 text-xs text-slate-400">
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <Link to="/jobs" className="hover:text-white transition">Jobs</Link>
                    <Link to="/login" className="hover:text-white transition">Sign In</Link>
                    <Link to="/register" className="hover:text-white transition">Register</Link>
                </div>
            </div>
        </footer>
    );
}
