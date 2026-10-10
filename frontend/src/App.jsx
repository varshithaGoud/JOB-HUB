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
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/job-details/:id" element={<JobDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/my-applications" element={<ApplicationsPage />} />
                    <Route path="/recruiter-dashboard" element={<RecruiterPage />} />
                    <Route path="/admin-dashboard" element={<AdminPage />} />
                    <Route path="/add-job" element={<AddJobPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
