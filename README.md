# 💼 JobHub — Enterprise Job Search & Hiring Platform

[![Live Frontend Demo](https://img.shields.io/badge/🌐_Frontend-GitHub_Pages-6366f1?style=for-the-badge&logo=github)](https://varshithagoud.github.io/JOB-HUB/)
[![Backend Status](https://img.shields.io/badge/⚙️_Backend-Spring_Boot_8080-10b981?style=for-the-badge&logo=spring)](http://localhost:8080/api/jobs)
[![Java 17](https://img.shields.io/badge/Language-Java%2017-blue.svg)](https://www.oracle.com/java/)
[![H2 Database](https://img.shields.io/badge/Database-H2%20In--Memory-orange.svg)](http://localhost:8080/h2-console)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**JobHub** is a full-stack, enterprise-grade job portal and recruitment management platform. It seamlessly connects candidates looking for tech and business opportunities with recruiters and hiring managers managing job postings and reviewing applicant pipelines.

---

## 🌐 Application URLs

### 🎨 Frontend Application URLs
- 🚀 **Live Demo (GitHub Pages)**: [https://varshithagoud.github.io/JOB-HUB/](https://varshithagoud.github.io/JOB-HUB/)
- 💻 **Local Frontend (Vite Dev Server)**: `http://localhost:5173`
- 📄 **Static File Path**: `index.html` (Open directly in any modern browser)

### ⚙️ Backend API URLs
- 🔌 **API Base URL**: `http://localhost:8080/api`
- 💼 **Jobs Endpoint**: `http://localhost:8080/api/jobs`
- 👤 **Users / Auth Endpoint**: `http://localhost:8080/api/users`
- 📄 **Applications Endpoint**: `http://localhost:8080/api/applications`
- 📊 **Platform Statistics**: `http://localhost:8080/api/stats`
- 🗄️ **H2 Database Console**: `http://localhost:8080/h2-console` *(JDBC URL: `jdbc:h2:mem:jobhubdb`, User: `sa`, Password: empty)*

---

## ✨ Features Overview

### 🧑‍💻 Candidate Portal (Job Seeker)
- **Explore & Filter Openings**: Real-time search by keywords, location, job type (*Full Time*, *Remote*, *Contract*, *Part Time*), and categories (*Engineering*, *Design*, *Data & AI*, *Product*, *Marketing*).
- **Interactive Application Modal**: Quick 1-click job application with custom pitch/cover letter and portfolio/resume URL submission.
- **Application Status Tracker**: Live candidate dashboard tracking application progress timelines:
  - ⏳ `PENDING` (Received)
  - 🔍 `UNDER_REVIEW` (Recruiter Reviewing)
  - ✅ `ACCEPTED` (Offer Extended)
  - ❌ `REJECTED` (Application Closed)

### 🏢 Recruiter Management Console
- **Recruiter Metrics Dashboard**: Overview counters for active job postings, total applicants, and pending reviews.
- **Publish Job Openings**: Form to post new job listings with salary range, workplace type, category, experience level, and detailed requirements.
- **Applicant Review Modal**: Inspect applicant cover letters, portfolio links, applied dates, and update candidate statuses in 1-click.

### 🛡️ Admin Control Panel
- **Platform Analytics**: Real-time stats on total users, candidates vs recruiters split, active listings, and total submitted applications.
- **User Management**: View all registered platform accounts with role badges and account moderation.
- **Listing Audit**: Audit and remove job postings across the network.

---

## 🔑 1-Click Demo Login Credentials

Try the interactive platform instantly using pre-configured demo roles:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Candidate (Alex)** | `alex@seeker.com` | `seeker123` | Search jobs, submit applications, track status |
| **Recruiter (Sarah)** | `techcorp@jobs.com` | `recruiter123` | Post new listings, review applicants, accept/reject candidate |
| **System Admin** | `admin@jobhub.com` | `admin123` | System metrics, manage all users and job listings |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Spring Boot 4.1 (Java 17) |
| **Persistence / ORM** | Spring Data JPA / Hibernate |
| **Database** | H2 In-Memory DB (with Web Console enabled at `/h2-console`) |
| **Build Tool** | Apache Maven |
| **Frontend UI** | HTML5, Modern CSS Glassmorphism System, Vanilla JS (ES6 Fetch API) |
| **Styling Frameworks** | Bootstrap 5.3, FontAwesome 6 Icons, Google Fonts (*Outfit* & *Plus Jakarta Sans*) |

---

## 🔌 REST API Endpoints Table

### 👤 User & Authentication APIs (`/api/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new Candidate, Recruiter, or Admin |
| `POST` | `/api/users/login` | Authenticate user credentials |
| `GET` | `/api/users` | Retrieve list of all registered users |
| `GET` | `/api/users/{id}` | Get specific user profile details |
| `DELETE` | `/api/users/{id}` | Admin delete user account |

### 💼 Job APIs (`/api/jobs`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/jobs` | Get all active job listings (supports `?category=` parameter) |
| `GET` | `/api/jobs/{id}` | Get job details by ID |
| `GET` | `/api/jobs/recruiter/{recruiterId}` | Get jobs published by specific recruiter |
| `POST` | `/api/jobs` | Publish a new job opening |
| `PUT` | `/api/jobs/{id}` | Update existing job posting |
| `DELETE` | `/api/jobs/{id}` | Delete job listing |

### 📄 Application APIs (`/api/applications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/applications` | Submit application (prevents duplicate applications) |
| `GET` | `/api/applications` | Get all submitted applications |
| `GET` | `/api/applications/user/{userId}` | Get applications submitted by candidate |
| `GET` | `/api/applications/job/{jobId}` | Get applicants for a specific job listing |
| `PUT` | `/api/applications/{id}/status` | Update application status (`UNDER_REVIEW`, `ACCEPTED`, `REJECTED`) |
| `DELETE` | `/api/applications/{id}` | Cancel candidate application |

### 📊 Platform Analytics API (`/api/stats`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats` | Platform counters (`totalUsers`, `totalJobs`, `totalApplications`, etc.) |

---

## ⚡ Local Setup Guide

### 1. Clone & Run Backend
```bash
git clone https://github.com/varshithaGoud/JOB-HUB.git
cd JOB-HUB/backend/JobHub

# Run Spring Boot Application
.\mvnw.cmd spring-boot:run
```

### 2. Launch Frontend UI
Open `index.html` in your web browser:
```bash
cd JOB-HUB
npm run dev
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
