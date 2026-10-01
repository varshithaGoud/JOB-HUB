package com.educonnect.jobhub.service;

import com.educonnect.jobhub.model.Application;
import com.educonnect.jobhub.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application apply(Application application) {
        if (application.getJobId() == null || application.getUserId() == null) {
            throw new RuntimeException("Job ID and User ID are required");
        }

        if (applicationRepository.existsByJobIdAndUserId(application.getJobId(), application.getUserId())) {
            throw new RuntimeException("You have already applied for this position");
        }

        application.setStatus("PENDING");
        application.setAppliedDate(LocalDate.now());

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Application> getUserApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application updateStatus(Long id, String status) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    public void cancelApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}