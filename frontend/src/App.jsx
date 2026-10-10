import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicationsPage from './pages/ApplicationsPage';
import RecruiterPage from './pages/RecruiterPage';
import AdminPage from './pages/AdminPage';
import AddJobPage from './pages/AddJobPage';

export default function App() {
    return (
        <div className="min-h-screen flex flex-col justify-between text-slate-100 bg-[#090d16]">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/index.html" element={<HomePage />} />
                    
                    {/* Jobs routes */}
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs.html" element={<JobsPage />} />
                    <Route path="/job-details/:id" element={<JobDetailsPage />} />
                    <Route path="/job-details" element={<JobDetailsPage />} />
                    <Route path="/job-details.html" element={<JobDetailsPage />} />
                    
                    {/* Auth routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login.html" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/register.html" element={<RegisterPage />} />
                    
                    {/* Candidate routes */}
                    <Route path="/my-applications" element={<ApplicationsPage />} />
                    <Route path="/my-applications.html" element={<ApplicationsPage />} />
                    
                    {/* Recruiter routes */}
                    <Route path="/recruiter-dashboard" element={<RecruiterPage />} />
                    <Route path="/recruiter-dashboard.html" element={<RecruiterPage />} />
                    <Route path="/add-job" element={<AddJobPage />} />
                    <Route path="/add-job.html" element={<AddJobPage />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin-dashboard" element={<AdminPage />} />
                    <Route path="/admin-dashboard.html" element={<AdminPage />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
