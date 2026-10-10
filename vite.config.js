import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('.', 'index.html'),
        login: resolve('.', 'login.html'),
        register: resolve('.', 'register.html'),
        jobs: resolve('.', 'jobs.html'),
        jobDetails: resolve('.', 'job-details.html'),
        myApplications: resolve('.', 'my-applications.html'),
        recruiter: resolve('.', 'recruiter-dashboard.html'),
        admin: resolve('.', 'admin-dashboard.html'),
        addJob: resolve('.', 'add-job.html')
      }
    }
  }
});
