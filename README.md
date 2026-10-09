# 💼 JobHub — Enterprise Job Search & Hiring Platform

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-JobHub_Portal-6366f1?style=for-the-badge&logo=github)](https://varshithagoud.github.io/JOB-HUB/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%204.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Language-Java%2017-blue.svg)](https://www.oracle.com/java/)
[![H2 Database](https://img.shields.io/badge/Database-H2%20In--Memory-orange.svg)](https://www.h2database.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**JobHub** is a full-stack, enterprise-grade job portal and recruitment management platform. It seamlessly connects candidates looking for tech and business opportunities with recruiters and hiring managers managing job postings and reviewing applicant pipelines.

---

## 🚀 Live Demo & Preview

- 🌐 **Frontend Application (Vercel)**: [https://job-hub-frontend.vercel.app](https://job-hub-frontend.vercel.app)
- ⚡ **Backend REST API (Render)**: [https://jobhub-backend.onrender.com](https://jobhub-backend.onrender.com)
- 🌐 **GitHub Pages Mirror**: [https://varshithagoud.github.io/JOB-HUB/](https://varshithagoud.github.io/JOB-HUB/)
- 📦 **GitHub Repository**: [https://github.com/varshithaGoud/JOB-HUB](https://github.com/varshithaGoud/JOB-HUB)

> **Note**: The Vercel frontend automatically connects to the live Spring Boot REST API backend hosted on Render (`https://jobhub-backend.onrender.com/api`). When running locally, it defaults to `http://localhost:8080/api`.

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

## 🔌 REST API Endpoints

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

## ⚙️ How to Enable GitHub Pages (Free Live Hosting)

To activate your live website on GitHub in 10 seconds:
1. Go to repository settings: **[https://github.com/varshithaGoud/JOB-HUB/settings/pages](https://github.com/varshithaGoud/JOB-HUB/settings/pages)**
2. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: Select **`main`** and **`/ (root)`**
3. Click **Save**. Your live site will be published at: [https://varshithagoud.github.io/JOB-HUB/](https://varshithagoud.github.io/JOB-HUB/)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
