package com.educonnect.jobhub.service;

import com.educonnect.jobhub.model.Job;
import com.educonnect.jobhub.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job addJob(Job job) {
        if (job.getCategory() == null || job.getCategory().isEmpty()) {
            job.setCategory("Engineering");
        }
        if (job.getExperienceLevel() == null || job.getExperienceLevel().isEmpty()) {
            job.setExperienceLevel("Mid Level");
        }
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    public List<Job> getJobsByCategory(String category) {
        return jobRepository.findByCategoryIgnoreCase(category);
    }

    public Job updateJob(Long id, Job job) {
        Job existingJob = getJobById(id);

        existingJob.setTitle(job.getTitle());
        existingJob.setCompany(job.getCompany());
        existingJob.setLocation(job.getLocation());
        existingJob.setSalary(job.getSalary());
        existingJob.setJobType(job.getJobType());
        existingJob.setDescription(job.getDescription());
        if (job.getCategory() != null) existingJob.setCategory(job.getCategory());
        if (job.getExperienceLevel() != null) existingJob.setExperienceLevel(job.getExperienceLevel());

        return jobRepository.save(existingJob);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}